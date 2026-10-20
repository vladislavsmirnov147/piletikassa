import { createHash } from 'node:crypto';

function stableStringify(value) {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        return '[' + value.map(stableStringify).join(',') + ']';
    }

    const keys = Object.keys(value).sort();

    return '{' + keys.map(key =>
        JSON.stringify(key) + ':' + stableStringify(value[key])
    ).join(',') + '}';
}

export function stateTag(obj) {
    return '"' + createHash('sha256')
        .update(stableStringify(obj))
        .digest('hex')
        .slice(0, 16) + '"';
}

function normalizeTag(tag) {
    return String(tag).trim().replace(/^W\//, '');
}

function unquoteTag(tag) {
    return normalizeTag(tag).replace(/^"(.*)"$/, '$1');
}

export function tagsEqual(a, b, { weak = false } = {}) {
    const left = String(a ?? '').split(',').map(s => s.trim());
    const right = String(b ?? '').split(',').map(s => s.trim());

    if (left.includes('*') || right.includes('*')) {
        return true;
    }

    return left.some(x => right.some(y => {
        if (!x || !y) return false;

        if (weak) {
            return unquoteTag(x) === unquoteTag(y);
        }

        return x === y ||
            (unquoteTag(x) === unquoteTag(y) &&
             !x.startsWith('W/') && !y.startsWith('W/'));
    }));
}

function getHeader(headers, name) {
    const key = Object.keys(headers || {}).find(
        k => k.toLowerCase() === name.toLowerCase()
    );

    return key === undefined ? undefined : headers[key];
}

function quotedTag(resource) {
    return stateTag(resource);
}

export function httpDate(time) {
    const date = time instanceof Date ? time : new Date(time);

    if (Number.isNaN(date.getTime())) {
        throw new RangeError('Invalid date');
    }

    return date.toUTCString();
}

export function cacheHeader(kind) {
    const values = {
        immutable: 'public, max-age=31536000, immutable',
        short: 'public, max-age=60',
        revalidate: 'no-cache',
        secret: 'no-store, private'
    };

    if (!Object.hasOwn(values, kind)) {
        throw new RangeError('Unknown cache kind');
    }

    return values[kind];
}

export function answerRead(headers, resource, { modified } = {}) {
    const etag = quotedTag(resource);
    const responseHeaders = {
        ETag: etag,
        'Cache-Control': cacheHeader('revalidate')
    };

    if (modified !== undefined) {
        responseHeaders['Last-Modified'] = httpDate(modified);
    }

    const ifNoneMatch = getHeader(headers, 'if-none-match');
    const ifModifiedSince = getHeader(headers, 'if-modified-since');

    if (ifNoneMatch !== undefined) {
        if (tagsEqual(ifNoneMatch, etag, { weak: true })) {
            return { code: 304, headers: responseHeaders, body: null };
        }
    } else if (modified !== undefined && ifModifiedSince !== undefined) {
        const since = Date.parse(ifModifiedSince);
        const lastModified = new Date(modified).getTime();

        if (Number.isFinite(since) &&
            lastModified <= since) {
            return { code: 304, headers: responseHeaders, body: null };
        }
    }

    return {
        code: 200,
        headers: responseHeaders,
        body: resource
    };
}

export function answerWrite(headers, resource, change) {
    const ifMatch = getHeader(headers, 'if-match');

    if (ifMatch === undefined) {
        return {
            code: 428,
            headers: {},
            body: { error: 'If-Match required' }
        };
    }

    const currentTag = quotedTag(resource);
    const tags = String(ifMatch).split(',').map(tag => tag.trim());

    const matched = tags.some(tag => {
        if (tag === '*') return true;
        if (tag.startsWith('W/')) return false;

        return tagsEqual(tag, currentTag);
    });

    if (!matched) {
        return {
            code: 412,
            headers: { ETag: currentTag },
            body: { error: 'Precondition failed' }
        };
    }

    const updated = { ...resource, ...change };

    Object.assign(resource, updated);

    return {
        code: 200,
        headers: { ETag: quotedTag(updated) },
        body: updated
    };
}