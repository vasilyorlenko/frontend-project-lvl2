import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import genDiff from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => (
  join(__dirname, '..', '__fixtures__', filename)
);

const testCases = [
  ['json', 'json', 'stylish'],
  ['yml', 'yml', 'stylish'],
  ['json', 'yml', 'stylish'],
  ['yml', 'json', 'stylish'],
  ['yaml', 'yml', 'stylish'],
  ['json', 'json', 'plain'],
  ['json', 'json', 'json'],
];

const expected = {};

beforeAll(async () => {
  expected.stylish = (
    await fs.readFile(getFixturePath('stylish.txt'), 'utf-8')
  ).trim();
  expected.plain = (
    await fs.readFile(getFixturePath('plain.txt'), 'utf-8')
  ).trim();
  expected.json = (
    await fs.readFile(getFixturePath('json.txt'), 'utf-8')
  ).trim();
});

test.each(testCases)('genDiff (%s, %s) [format: %s]', (type1, type2, format) => {
  const file1path = getFixturePath(`file1.${type1}`);
  const file2path = getFixturePath(`file2.${type2}`);

  expect(genDiff(file1path, file2path, format)).toBe(expected[format]);
});

test('default format', () => {
  const file1path = getFixturePath('file1.json');
  const file2path = getFixturePath('file2.json');

  expect(genDiff(file1path, file2path)).toBe(expected.stylish);
});

test('invalid format', () => {
  const file1path = getFixturePath('file1.json');
  const file2path = getFixturePath('file2.json');

  expect(() => genDiff(file1path, file2path, 'wrong')).toThrow();
});
