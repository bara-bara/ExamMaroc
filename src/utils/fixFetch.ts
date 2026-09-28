// Fix for environments where window.fetch has only a getter
(function patchFetch() {
  if (typeof window === 'undefined') return;

  // 1. Error event listeners to prevent unhandled TypeError from bubbling
  window.addEventListener(
    'error',
    (event) => {
      if (
        event &&
        event.message &&
        event.message.includes('fetch') &&
        event.message.includes('getter')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
        return true;
      }
    },
    true
  );

  const prevOnError = window.onerror;
  window.onerror = function (msg, ...args) {
    if (
      typeof msg === 'string' &&
      msg.includes('fetch') &&
      msg.includes('getter')
    ) {
      return true;
    }
    return prevOnError ? prevOnError.call(this, msg, ...args) : false;
  };

  // 2. Patch Window.prototype, window, and prototype chain
  try {
    let customFetch: typeof window.fetch | null = null;

    let curr: any = window;
    while (curr) {
      try {
        const desc = Object.getOwnPropertyDescriptor(curr, 'fetch');
        if (desc && desc.get && !desc.set) {
          const originalGet = desc.get;
          Object.defineProperty(curr, 'fetch', {
            configurable: true,
            enumerable: desc.enumerable !== false,
            get() {
              return customFetch !== null ? customFetch : originalGet.call(this);
            },
            set(fn) {
              customFetch = fn;
            },
          });
        }
      } catch (_) {}
      curr = Object.getPrototypeOf(curr);
    }

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        const pDesc = Object.getOwnPropertyDescriptor(Window.prototype, 'fetch');
        if (pDesc && pDesc.get && !pDesc.set) {
          const origGet = pDesc.get;
          Object.defineProperty(Window.prototype, 'fetch', {
            configurable: true,
            enumerable: pDesc.enumerable !== false,
            get() {
              return customFetch !== null ? customFetch : origGet.call(this);
            },
            set(fn) {
              customFetch = fn;
            },
          });
        }
      } catch (_) {}
    }
  } catch (_) {}
})();

export {};
