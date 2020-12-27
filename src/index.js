import { readFileSync } from 'fs';
import _ from 'lodash';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';

const buildDiff = (parsedConfig1, parsedConfig2) => {
  const keys = _.sortBy(_.union(_.keys(parsedConfig1), _.keys(parsedConfig2)));

  const diff = keys.map((key) => {
    if (!_.has(parsedConfig2, key)) {
      return { type: 'removed', key, value: parsedConfig1[key] };
    }

    if (!_.has(parsedConfig1, key)) {
      return { type: 'added', key, value: parsedConfig2[key] };
    }

    const oldValue = parsedConfig1[key];
    const newValue = parsedConfig2[key];

    if (_.isEqual(oldValue, newValue)) {
      return { type: 'unchanged', key, value: oldValue };
    }

    if (!_.isPlainObject(oldValue) || !_.isPlainObject(newValue)) {
      return { type: 'updated', key, value: { oldValue, newValue } };
    }

    return { type: 'nested', key, children: buildDiff(oldValue, newValue) };
  });

  return diff;
};

export default (filepath1, filepath2, format = 'stylish') => {
  const config1 = readFileSync(filepath1, 'utf-8');
  const config2 = readFileSync(filepath2, 'utf-8');

  const parsedConfig1 = getParser(filepath1)(config1);
  const parsedConfig2 = getParser(filepath2)(config2);

  const diff = buildDiff(parsedConfig1, parsedConfig2);
  const formattedDiff = getFormatter(format)(diff);

  return formattedDiff;
};
