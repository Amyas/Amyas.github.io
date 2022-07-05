function compileToFunction(html) {
  const root = parseHTML(html);
  const code = generate(root);
  const render = new Function(`with(this){return ${code}}`);
  return render;
}

function generate(el) {
  const children = genChildren(el);
  const code = `_c("${el.tag}",${
    el.attrs.length ? genProps(el.attrs) : "undefined"
  }${children ? `,${children}` : ""})`;
  return code;
}

function gen(el) {
  if (el.type === 1) {
    return generate(el);
  } else {
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
    const text = el.text;
    if (!defaultTagRE.test(text)) {
      return `_v("${text}")`;
    }
    const tokens = [];
    let match;
    let lastIndex = (defaultTagRE.lastIndex = 0);

    while ((match = defaultTagRE.exec(text))) {
      const index = match.index;
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

function genChildren(el) {
  const children = el.children;
  if (children) {
    return children.map((child) => gen(child)).join(",");
  }
  return false;
}

function genProps(attrs) {
  let str = "";

  attrs.forEach((attr) => {
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  });

  return `{${str.slice(0, -1)}}`;
}

function parseHTML(html) {
  let root = null;
  const stack = [];

  const ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'<>`=]+)))?/;
  const startTagClose = /^\s*(\/?)>/;
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

  function createAstElement(tag, attrs) {
    return {
      tag,
      attrs,
      type: 1,
      parent: null,
      children: [],
    };
  }

  function start(tag, attrs) {
    const parent = stack[stack.length - 1];
    const element = createAstElement(tag, attrs);
    if (!root) {
      root = element;
    }
    element.parent = parent;
    if (parent) {
      parent.children.push(element);
    }
    stack.push(element);
  }

  function end(tag) {
    const last = stack.pop();
    if (last.tag !== tag) {
      throw new Error("标签闭合错误");
    }
  }

  function chars(text) {
    text = text.replace(/\s*/g, "");
    const parent = stack[stack.length - 1];
    if (text) {
      parent.children.push({
        type: 3,
        text,
      });
    }
  }

  function advance(len) {
    html = html.substring(len);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tag: start[1],
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

  while (html) {
    const textEnd = html.indexOf("<");
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tag, startTagMatch.attrs);
        continue;
      }

      const endTagMatch = html.match(endTag);
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