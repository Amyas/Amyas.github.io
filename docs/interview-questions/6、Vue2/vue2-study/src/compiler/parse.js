const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 用来获取的标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root = null
let stack = []
function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    type: 1, // 元素：1，文本：3
    children: [],
    parent: null,
    attrs
  }
}

function start(tagName, attributes) {
  let parent = stack[stack.length - 1]
  let element = createAstElement(tagName, attributes)
  if(!root) {
    root = element
  }
  if(parent) {
    element.parent = parent
    parent.children.push(element)
  }
  stack.push(element)
}
function end(tagName) {
  let last = stack.pop()
  if(last.tag !== tagName) {
    throw new Error("标签闭合错误")
  }
}
function chars(text) {
  text = text.replace(/\s/g, "")
  let parent = stack[stack.length - 1]
  if(text) {
    parent.children.push({
      type: 3, // 元素：1，文本：3
      text
    })
  }
}

export function parseHTML(html){
  root = null
  stack = []

  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 删除已经匹配的开始标签

      let end
      let attr
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 没有遇到标签结尾
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if(end) {
        advance(end[0].length)
      }
      return match
    }
    return false // 不是开始标签
  }

  while(html) {
    let textEnd = html.indexOf('<')
    if(textEnd === 0) {
      const startTagMatch = parseStartTag() // 解析开始标签
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }

      const endTagMatch = html.match(endTag)// 解析结束标签
      if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue;
      }
    }
    let text
    if(textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if(text) {
      chars(text)
      advance(text.length)
    }
  }

  return root
}