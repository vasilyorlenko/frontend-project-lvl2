import _ from 'lodash';

const spacesPerIndentLevel = 4;

const formatValue = (currentValue, indentLevel) => {
  if (!_.isPlainObject(currentValue)) {
    return `${currentValue}`;
  }

  const padding = spacesPerIndentLevel * indentLevel;

  const lines = _.entries(currentValue).map(([key, value]) => (
    `${' '.repeat(padding)}${key}: ${formatValue(value, indentLevel + 1)}`
  ));

  return `{\n${lines.join('\n')}\n${' '.repeat(padding - spacesPerIndentLevel)}}`;
};

export default (diff) => {
  const iter = (current, indentLevel) => {
    const padding = spacesPerIndentLevel * indentLevel;

    const lines = current.map(({
      type, key, value, children,
    }) => {
      switch (type) {
        case 'removed':
          return `${'- '.padStart(padding)}${key}: ${formatValue(value, indentLevel + 1)}`;
        case 'added':
          return `${'+ '.padStart(padding)}${key}: ${formatValue(value, indentLevel + 1)}`;
        case 'unchanged':
          return `${' '.repeat(padding)}${key}: ${formatValue(value, indentLevel + 1)}`;
        case 'updated':
          return `${'- '.padStart(padding)}${key}: ${formatValue(value.oldValue, indentLevel + 1)}\n${'+ '.padStart(padding)}${key}: ${formatValue(value.newValue, indentLevel + 1)}`;
        case 'nested':
          return `${' '.repeat(padding)}${key}: {\n${iter(children, indentLevel + 1)}\n${' '.repeat(padding)}}`;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    });

    return lines.join('\n');
  };

  return `{\n${iter(diff, 1)}\n}`;
};
