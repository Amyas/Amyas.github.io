function parseHTML(html) {
  const startTagClose = /^\s*(\/?)>/;
  const ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
  const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*("([^"]*)"+|'([^']*)'+|([^\s"'<>`=]+)))?/;

  function advance(len) {
    html = html.substring(len);
  }
  function parseStartOpen() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);

      let end;
      let attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }

      if (end) {
        advance(end[0].length);
      }

      return match;
    }
    return false;
  }

  let root = null;
  let stack = [];
  function createAstElement(tag, attrs) {
    return {
      type: 1,
      tag,
      attrs,
      parent: null,
      children: [],
    };
  }
  function start(tagName, attrs) {
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    element.parent = parent;
    if (parent) {
      parent.children.push(element);
    }
    stack.push(element);
  }
  function end(tagName) {
    let last = stack.pop();
    if (last.tag !== tagName) {
      throw new Error("标签闭合错误");
    }
  }
  function chars(text) {
    text = text.replace(/\s/g, "");
    let parent = stack[stack.length - 1];
    if (text) {
      parent.children.push({
        type: 3,
        text,
      });
    }
  }

  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      let startTagMatch = parseStartOpen();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }

    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }

  return root;
}

function genProps(attrs) {
  let str = "";

  attrs.forEach((attr) => {
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  });

  return `{${str.slice(0, -1)}}`;
}

function gen(el) {
  if (el.type === 1) {
    return generate(el);
  } else {
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
    let text = el.text;
    if (!defaultTagRE.test(text)) {
      return `_v("${text}")`;
    } else {
      let tokens = [];
      let match;
      let lastIndex = (defaultTagRE.lastIndex = 0);

      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return `_v(${tokens.join("+")})`;
    }
  }
}

function genChildren(el) {
  let children = el.children;
  if (children) {
    return children.map((v) => gen(v)).join(",");
  }
  return false;
}

function generate(el) {
  let children = genChildren(el);

  let code = `_c("${el.tag}",${
    el.attrs.length ? genProps(el.attrs) : "undefined"
  }${children ? `,${children}` : ""})`;

  return code;
}

function compileToFunction(html) {
  let root = parseHTML(html);

  let code = generate(root);

  console.log(code);
}
