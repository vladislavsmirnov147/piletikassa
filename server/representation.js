import { matches } from './mime-match.js';
import { range } from './range.js';

export function parseAccept(header) {
    if (!header || !header.trim()) {
        return [{ type: '*/*', q: 1 }];
    }

    return header.split(',').map((part, index) => {
        const pieces = part.trim().split(';');
        const type = pieces[0].trim().toLowerCase();

        let q = 1;

        for (const piece of pieces.slice(1)) {
            const match = /^q\s*=\s*(.+)$/i.exec(piece.trim());

            if (match) {
                const value = Number(match[1]);
                q = Number.isFinite(value) && value >= 0 && value <= 1
                    ? value
                    : 0;
            }
        }

        return { type, q, index };
    }).sort((a, b) => {
        if (b.q !== a.q) return b.q - a.q;

        const specificity = type =>
            type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;

        return specificity(b.type) - specificity(a.type)
            || a.index - b.index;
    }).map(({ type, q }) => ({ type, q }));
}

export function pickRepresentation(acceptHeader, offered) {
    const accepted = parseAccept(acceptHeader);
    let bestType = null;
    let bestQ = 0;

    for (const offeredType of offered) {
        let bestSpecificity = -1;
        let quality = 0;

        for (const item of accepted) {
            if (!matches(item.type, offeredType)) continue;

            const specificity = item.type === '*/*'
                ? 0
                : item.type.endsWith('/*')
                    ? 1
                    : 2;

            if (specificity > bestSpecificity) {
                bestSpecificity = specificity;
                quality = item.q;
            } else if (specificity === bestSpecificity) {
                quality = Math.max(quality, item.q);
            }
        }

        if (quality > bestQ) {
            bestQ = quality;
            bestType = offeredType;
        }
    }

    return bestType;
}

export function representationHeaders(type) {
    return {
        'Content-Type': type,
        'Vary': 'Accept'
    };
}

export function rangeHeaders(value) {
    const length = value.length;

    if (value.kind === 'invalid') {
        return {
            code: 416,
            headers: {
                'Accept-Ranges': 'bytes',
                'Content-Range': `bytes */${length}`
            }
        };
    }

    if (value.kind === 'whole') {
        return {
            code: 200,
            headers: {
                'Accept-Ranges': 'bytes',
                'Content-Length': String(length)
            }
        };
    }

    const size = value.end - value.start + 1;

    return {
        code: 206,
        headers: {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${value.start}-${value.end}/${length}`,
            'Content-Length': String(size)
        }
    };
}

export function rangeBody(text, value) {
    const body = Buffer.isBuffer(text)
        ? text
        : Buffer.from(String(text), 'utf8');

    if (value.kind === 'invalid') {
        return body.subarray(0, 0);
    }

    if (value.kind === 'whole') {
        return body;
    }

    return body.subarray(value.start, value.end + 1);
}