const nodeOps = {
  createElement(tagName) {
    return document.createElement(tagName);
  },
  createTextNode(text) {
    return document.createTextNode(text);
  },
  insert(element, container, anchor = null) {
    container.insertBefore(element, anchor);
  },
  remove(child) {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  querySelector(selectors) {
    return document.querySelector(selectors);
  },
  parentNode(child) {
    return child.parentNode;
  },
  nextSibling(child) {
    return child.nextSibling;
  },
  setText(element, text) {
    element.nodeValue = text;
  },
  setElementText(element, text) {
    element.textContent = text;
  },
};

function patchProp(el, key, preValue, nextValue) {
  if (key === "class") {
    patchClass(el, nextValue);
  } else if (key === "style") {
    patchStyle(el, preValue, nextValue);
  } else if (/on[^a-z]/.test(key)) {
    patchEvent(el, key, nextValue);
  }
}

function patchClass(el, nextValue) {
  if (nextValue === null) {
    el.removeAttribute("class");
  } else {
    el.className = nextValue;
  }
}

function patchStyle(el, preValue, nextValue) {
  const style = el.style;
  for (let key in nextValue) {
    style[key] = nextValue[key];
  }

  if (preValue) {
    for (let key in preValue) {
      if (nextValue[key] === null) {
        style[key] = null;
      }
    }
  }

  el.setAttribute("style", style);
}

function createInvoker(preValue) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = preValue;
  return invoker;
}

function patchEvent(el, key, nextValue) {
  const invokers = el._vei || (el._vei = {});

  const exitingInvoker = invokers[key];
  if (exitingInvoker && nextValue) {
    exitingInvoker.value = nextValue;
  } else {
    const eventName = key.slice(2).toLowerCase();
    if (nextValue) {
      const invoker = createInvoker(nextValue);
      invokers[key] = invoker;
      el.addEventListener(eventName, invoker);
    } else if (exitingInvoker) {
      el.removeEventListener(eventName, exitingInvoker);
      invokers[key] = null;
    }
  }
}
