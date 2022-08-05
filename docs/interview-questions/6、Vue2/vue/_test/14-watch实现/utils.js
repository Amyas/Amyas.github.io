let callbacks = [];
let waiting = false;

function fluashCallbacks() {
  callbacks.forEach((callback) => callback());
  callbacks = [];
  waiting = false;
}

function timer(fluashCallbacks) {
  let timerFn = () => {};

  if (Promise) {
    timerFn = () => Promise.resolve().then(fluashCallbacks);
  } else if (MutationObserver) {
    const textNode = document.createTextNode(3);
    const observer = new MutationObserver(fluashCallbacks);
    observer.observe(textNode, {
      characterData: true,
    });
    timerFn = () => {
      textNode.textContent = 1;
    };
  } else if (setImmediate) {
    timerFn = () => setImmediate(fluashCallbacks);
  } else {
    timerFn = () => setTimeout(fluashCallbacks);
  }
  timerFn();
}

function nextTick(callback) {
  callbacks.push(callback);

  if (!waiting) {
    timer(fluashCallbacks);
    waiting = true;
  }
}
