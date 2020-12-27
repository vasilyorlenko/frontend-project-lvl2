import { extname } from 'path';
import yaml from 'js-yaml';

const parsersByExtension = {
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  json: JSON.parse,
};

export default (filepath) => {
  const extension = extname(filepath).slice(1);
  return parsersByExtension[extension];
};
