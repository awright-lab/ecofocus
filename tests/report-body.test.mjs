import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports = {};
const code = ts.transpileModule(fs.readFileSync(new URL('../lib/report-body.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(code, { exports });
const parse = body => JSON.parse(JSON.stringify(exports.parseReportBody(body)));
test('plain text retains separate paragraphs and line breaks', () => {
  assert.deepEqual(parse('First line\r\nFirst line\r\n\r\nSecond paragraph'), [{type:'paragraph',text:'First line\nFirst line'},{type:'paragraph',text:'Second paragraph'}]);
});
test('headings, bullet lists and numbered contents keep their structure', () => {
  assert.deepEqual(parse('## Contents\n\n3. Third chapter\n4. Fourth chapter\n\n## Included\n\n- Data\n- Benchmarks'), [{type:'heading',text:'Contents'},{type:'ordered',items:['Third chapter','Fourth chapter'],start:3},{type:'heading',text:'Included'},{type:'unordered',items:['Data','Benchmarks'],start:1}]);
});
test('workforce draft has all supplied sections and no fabricated publication facts', () => {
  const draft=JSON.parse(fs.readFileSync(new URL('../content/report-drafts/environmental-sustainability-and-the-workforce.json',import.meta.url)));
  const blocks=parse(draft.body);
  assert.equal(draft._status,'draft');
  assert.equal(draft.price,1495);
  assert.equal(draft.pages,72);
  assert.match(draft.body,/^Published November 2026/);
  assert.equal(draft.cover,394);
  assert.equal(draft.downloadFile,undefined);
  assert.equal(blocks.filter(b=>b.type==='heading').length,9);
  assert.equal(blocks.find(b=>b.type==='ordered').items.length,7);
  assert.match(draft.body,/internal use across one organization/);
  assert.match(draft.body,/4,046/);
  assert.match(draft.body,/2,472/);
  assert.match(draft.body,/2,825/);
});
