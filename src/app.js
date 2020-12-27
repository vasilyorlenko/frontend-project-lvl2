import program from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import genDiff from './index.js';

export default () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const packagePath = join(__dirname, '..', 'package.json');
  const { version } = JSON.parse(readFileSync(packagePath, 'utf-8'));

  program
    .description('Compares two configuration files and shows a difference.')
    .version(version)
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format', 'stylish')
    .action((filepath1, filepath2, { format }) => (
      console.log(genDiff(filepath1, filepath2, format))
    ));

  program.parse(process.argv);
};
