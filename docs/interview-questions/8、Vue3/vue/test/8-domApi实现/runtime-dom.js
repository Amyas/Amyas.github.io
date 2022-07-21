const nodeOps = {
  createElement(target) {
    return document.createElement(target);
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
    return document.createElement(selectors);
  },
  parentNode(child) {
    return child.parentNode;
  },
  setText(element, text) {
    element.nodeValue = text;
  },
  setElementText(element, text) {
    element.textContent = text;
  },
};

const patchProp = (el, key, preValue, nextValue) => {
  if (key === "class") {
    patchClass(el, nextValue);
  } else if (key === "style") {
    patchStyle(el, preValue, nextValue);
  } else if (/on[^a-z]/.test(key)) {
    patchEvent(el, key, nextValue);
  }
};

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
    style[key] = nextValue;
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
