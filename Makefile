install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-watch:
	npm exec -c 'node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./jest.config.json --watch'

test-coverage:
	npm exec -c 'node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./jest.config.json --coverage --coverageProvider=v8'