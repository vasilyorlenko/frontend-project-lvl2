import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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

test.each(testCases)('genDiff (%s, %s) [format: %s]', (type1, type2, format) => {
  expect(
    genDiff(getFixturePath(`file1.${type1}`), getFixturePath(`file2.${type2}`), format),
  ).toBe(fs.readFileSync(getFixturePath(`${format}.txt`), 'utf-8').trim());
});

test('default format', () => {
  expect(
    genDiff(getFixturePath('file1.json'), getFixturePath('file2.json')),
  ).toBe(fs.readFileSync(getFixturePath('stylish.txt'), 'utf-8').trim());
});

test('invalid format', () => {
  expect(
    () => genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'wrong'),
  ).toThrow();
});
