import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

export default (diff) => {
  const iter = (current, propertyPath) => {
    const path = propertyPath && `${propertyPath}.`;

    const items = current.map(({
      type, key, value, children,
    }) => {
      switch (type) {
        case 'removed':
          return `Property '${path}${key}' was removed`;
        case 'added':
          return `Property '${path}${key}' was added with value: ${formatValue(value)}`;
        case 'unchanged':
          return '';
        case 'updated':
          return `Property '${path}${key}' was updated. From ${formatValue(value.oldValue)} to ${formatValue(value.newValue)}`;
        case 'nested':
          return iter(children, `${path}${key}`);
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    })
      .filter(_.identity);

    return items.join('\n');
  };

  return iter(diff, '');
};
