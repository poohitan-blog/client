const deserializers = {
  [String]: value => value,
  [Date]: value => new Date(value),
  [Number]: value => Number(value),
  [Boolean]: value => value === true || value === 'true',
};

const deserializeOne = (data, schema) => Object.keys(data).reduce((result, fieldName) => {
  const fieldValue = data[fieldName];
  const fieldType = schema[fieldName] || String;
  let deserializedValue;

  if (Array.isArray(fieldType)) {
    const deserialize = deserializers[fieldType[0]];
    deserializedValue = fieldValue.map(item => deserialize(item));
  } else {
    const deserialize = deserializers[fieldType];
    deserializedValue = deserialize(fieldValue);
  }

  return Object.assign({ }, result, { [fieldName]: deserializedValue });
}, {});

export default (data, schema) => {
  if (Array.isArray(data)) {
    return data.map(object => deserializeOne(object, schema));
  }

  return deserializeOne(data, schema);
};
