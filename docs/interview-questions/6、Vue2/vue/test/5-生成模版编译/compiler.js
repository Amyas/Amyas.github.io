const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^'])'+|([^\s"'=<>`]+)))?/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)


function start(tagName, attrs) {
  console.log('start:', tagName, attrs)
}

function end(tagName) {
  console.log('end:', tagName)
}

function chars(text) {
  console.log('chars:', text)
}

function compileToFunction(html) {
  parseHTML(html)
}

function parseHTML(html) {
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag(){
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)

      let end;
      let attr;
      while(
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
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
    return false
  }

  while(html) {
    let textEnd = html.indexOf('<')
    if(textEnd === 0) {
      const startTagMatch = parseStartTag()
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag)
      if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }

    let text;
    if(textEnd > 0) {
      text = html.substring(0, textEnd)
    }

    if(text) {
      chars(text)
      advance(text.length)
    }
  }
}