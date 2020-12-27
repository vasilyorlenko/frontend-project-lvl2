import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
  json: JSON.stringify,
};

export default (format) => {
  if (!_.has(formatters, format)) {
    throw new Error(`Unknown format: ${format}`);
  }

  return formatters[format];
};
