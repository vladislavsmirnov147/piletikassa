
import { CONTRACT } from '../materials/api-contract.js';
import { toType } from '../materials/api-schemas.js';

// Leping on etteantud failis. Ekspordime selle edasi.
export { CONTRACT };

// 1. Skeemi kontroll kahes suunas:
// puuduv nõutud väli JA lepingus puuduv lisaväli.
export function checkSchema(contract, schemaName, value) {
  const schema = contract.schemas[schemaName];

  if (!schema) {
    return [`tundmatu skeem: ${schemaName}`];
  }

  const errors = [];

  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return [`ootasin object, sain ${toType(value)}`];
  }

  // Kõigepealt kontrollime nõutud välju.
  for (const field of schema.required ?? []) {
    if (!Object.hasOwn(value, field)) {
      errors.push(`puudub nõutud väli: ${field}`);
    }
  }

  // Seejärel kontrollime kõiki saadetud välju.
  for (const [field, fieldValue] of Object.entries(value)) {
    if (!Object.hasOwn(schema.fields, field)) {
      errors.push(`lepingus puuduv väli: ${field}`);
      continue;
    }

    const expected = schema.fields[field];
    const actual = toType(fieldValue);

    // Valikuline väli võib olla null.
    if (
      fieldValue === null &&
      !(schema.required ?? []).includes(field)
    ) {
      continue;
    }

    // Integer sobib number-väljale, aga mitte vastupidi.
    const matches =
      actual === expected ||
      (expected === 'number' && actual === 'integer');

    if (!matches) {
      errors.push(
        `${field}: ootasin ${expected}, sain ${actual}`
      );
    }
  }

  return errors;
}

// 2. HTTP-vastuse kontroll:
// tee, meetod, staatus, keha ja nõutud päised.
export function checkResponse(
  contract,
  path,
  method,
  status,
  body,
  headers = {}
) {
  const operation = contract.paths[path]?.[method.toLowerCase()];

  if (!operation) {
    return [`lepingus ei ole: ${method.toUpperCase()} ${path}`];
  }

  const response = operation.responses?.[status];

  if (!response) {
    return [
      `lepingus ei ole vastust ${status} teele ${method.toUpperCase()} ${path}`
    ];
  }

  const errors = response.schema
    ? checkSchema(contract, response.schema, body)
    : [];

  // HTTP päiste nimed ei ole tõstutundlikud.
  for (const requiredHeader of response.headers ?? []) {
    const found = Object.entries(headers).some(
      ([name, value]) =>
        name.toLowerCase() === requiredHeader.toLowerCase() &&
        value !== undefined &&
        value !== null &&
        value !== ''
    );

    if (!found) {
      errors.push(`puudub nõutud päis: ${requiredHeader}`);
    }
  }

  return errors;
}

// 3. Mock luuakse lepingu järgi, mitte käsitsi.
// Näidisandmed antakse skeemi nime järgi.
export function createMock(contract, examples = {}) {
  return (method, path) => {
    const operation = contract.paths[path]?.[method.toLowerCase()];

    if (!operation) {
      return {
        code: 404,
        body: { err: 'Ei leitud', code: 'NOT_FOUND' }
      };
    }

    // Esimene lepingus kirjeldatud vastus.
    const [status, response] = Object.entries(
      operation.responses
    )[0];

    const headers = {};

    for (const name of response.headers ?? []) {
      if (name.toLowerCase() === 'location') {
        const id = examples[response.schema]?.id ?? 1;
        headers[name] = `/api/orders/${id}`;
      } else {
        headers[name] = 'example';
      }
    }

    return {
      code: Number(status),
      body: structuredClone(examples[response.schema] ?? {}),
      headers
    };
  };
}

// 4. Murdva muudatuse reegel on ASÜMMEETRILINE.
// Vastuses ja päringus on erinevad reeglid.
export function changeKind(where, action, required = false) {
  if (action === 'update' || where === 'type') {
    return 'BREAKING';
  }

  if (where === 'response') {
    return action === 'remove' ? 'BREAKING' : 'safe';
  }

  if (where === 'request') {
    if (action === 'remove') return 'BREAKING';
    if (action === 'add') {
      return required ? 'BREAKING' : 'safe';
    }
  }

  return 'BREAKING';
}

// 5. Leiame kahe lepingu skeemide erinevused.
export function compareContracts(oldContract, newContract) {
  const changes = [];

  // NewOrder on päringu keha; ülejäänud skeemid on vastused.
  const requestSchemas = new Set();

  for (const path of Object.values(oldContract.paths)) {
    for (const operation of Object.values(path)) {
      if (operation.requestBody?.schema) {
        requestSchemas.add(operation.requestBody.schema);
      }
    }
  }

  for (const path of Object.values(newContract.paths)) {
    for (const operation of Object.values(path)) {
      if (operation.requestBody?.schema) {
        requestSchemas.add(operation.requestBody.schema);
      }
    }
  }

  const schemaNames = new Set([
    ...Object.keys(oldContract.schemas),
    ...Object.keys(newContract.schemas)
  ]);

  for (const schemaName of schemaNames) {
    const oldSchema = oldContract.schemas[schemaName];
    const newSchema = newContract.schemas[schemaName];

    if (!oldSchema || !newSchema) {
      continue;
    }

    const where = requestSchemas.has(schemaName)
      ? 'request'
      : 'response';

    const oldFields = oldSchema.fields ?? {};
    const newFields = newSchema.fields ?? {};

    const fieldNames = new Set([
      ...Object.keys(oldFields),
      ...Object.keys(newFields)
    ]);

    for (const field of fieldNames) {
      const hadField = Object.hasOwn(oldFields, field);
      const hasField = Object.hasOwn(newFields, field);

      let action;

      if (!hadField && hasField) {
        action = 'add';
      } else if (hadField && !hasField) {
        action = 'remove';
      } else if (oldFields[field] !== newFields[field]) {
        action = 'update';
      } else {
        continue;
      }

      const required = (newSchema.required ?? []).includes(field);

      changes.push({
        schema: schemaName,
        field,
        action,
        kind: changeKind(where, action, required)
      });
    }
  }

  return changes;
}
