import * as test from 'japa'
import { Parser } from '../src/Parser'

test('basic parameter parsing', (assert) => {
  let result = Parser.parse('command:name')

  assert.equal('command:name', result[0])

  result = Parser.parse('command:name {argument} {--option}')

  assert.equal('command:name', result[0])
  assert.equal('argument', result[1][0].name)
  assert.equal('option', result[2][0].name)
  assert.isFalse(result[2][0].acceptValue())

  result = Parser.parse('command:name {argument*} {--option=}')

  assert.equal('command:name', result[0])
  assert.equal('argument', result[1][0].name)
  assert.isTrue(result[1][0].isArray())
  assert.isTrue(result[1][0].isRequired())
  assert.equal('option', result[2][0].name)
  assert.isTrue(result[2][0].acceptValue())

  result = Parser.parse('command:name {argument?*} {--option=*}')

  assert.equal('command:name', result[0])
  assert.equal('argument', result[1][0].name)
  assert.isTrue(result[1][0].isArray())
  assert.isFalse(result[1][0].isRequired())
  assert.equal('option', result[2][0].name)
  assert.isTrue(result[2][0].acceptValue())
  assert.isTrue(result[2][0].isArray())

  result = Parser.parse('command:name {argument?* : The argument description.}    {--option=* : The option description.}')

  assert.equal('command:name', result[0])
  assert.equal('argument', result[1][0].name)
  assert.equal('The argument description.', result[1][0].description)
  assert.isTrue(result[1][0].isArray())
  assert.isFalse(result[1][0].isRequired())
  assert.equal('option', result[2][0].name)
  assert.equal('The option description.', result[2][0].description)
  assert.isTrue(result[2][0].acceptValue())
  assert.isTrue(result[2][0].isArray())
})

test('shortcut name parsing', (assert) => {
  let result = Parser.parse('command:name {--o|option}')

  assert.equal('option', result[2][0].name)
  assert.equal('o', result[2][0].shortcut)
  assert.isFalse(result[2][0].acceptValue())
})
