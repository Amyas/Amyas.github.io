import { parseHTML } from './parse'
import { generate } from './generate'

export function compileToFunction(template) {
  let root = parseHTML(template)

  let code = generate(root)
  console.log(code)
}