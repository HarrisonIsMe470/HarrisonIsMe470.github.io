import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import katex from 'katex';

// Fixtures are extracted from real migrated body text, with pre/code excluded.
const fixtures = JSON.parse(readFileSync(new URL('../migration/formula-fixtures.json', import.meta.url)));
assert.ok(fixtures.length > 0);
for (const { tex, display } of fixtures) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: true, trust: false, strict: false });
  assert.ok(html.includes('class="katex"'));
}
const component = readFileSync(new URL('../src/components/Math.astro', import.meta.url), 'utf8');
const arraySource = component.match(/delimiters:\s*(\[[\s\S]*?\]),/)[1];
const delimiters = JSON.parse(JSON.stringify(vm.runInNewContext(arraySource)));
assert.deepEqual(delimiters, [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
  { left: '\\(', right: '\\)', display: false },
  { left: '\\[', right: '\\]', display: true },
]);
assert.ok(component.includes("'pre', 'code'"));
console.log(`PASS: ${fixtures.length} recovered formulas render; all four delimiter pairs and code exclusions are correct.`);
