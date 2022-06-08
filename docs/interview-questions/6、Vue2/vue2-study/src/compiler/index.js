import { parseHTML } from './parse'
import { generate } from './generate'

export function compileToFunction(template) {
  let root = parseHTML(template)

  let code = generate(root)

  let render = new Function(`with(this){return ${code}}`)

  return render
}