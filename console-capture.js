(function () {
  const entries = [];
  const originalLog = console.log;
  const originalError = console.error;

  function addEntry(type, args) {
    const message = args
      .map((arg) => {
        try {
          if (arg instanceof Error) {
            return arg.stack || arg.message || String(arg);
          } else if (typeof arg === 'object' && arg !== null) {
            if (arg.stack || arg.message) {
              return `${arg.message || ''}${arg.stack ? `\n${arg.stack}` : ''}`.trim();
            }
            return JSON.stringify(arg);
          }
          return String(arg);
        } catch (e) {
          return String(arg);
        }
      })
      .join(' ');
    entries.push({ type, message });
    updateDisplay();
  }

  console.log = function (...args) {
    addEntry('log', args);
    originalLog.apply(console, args);
  };

  console.error = function (...args) {
    addEntry('error', args);
    originalError.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    addEntry('error', [event.message]);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason && (reason.stack || reason.message || reason);
    addEntry('error', [message]);
  });

  let container;
  let content;

  function copyEntries() {
    const text = entries
      .map((e) => `[${e.type}] ${e.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  }

  function dismiss() {
    if (container) {
      container.remove();
    }
  }

  function updateDisplay() {
    if (!content) return;
    content.innerHTML = entries
      .map(
        (e) =>
          `<div class="${
            e.type === 'error' ? 'text-red-600' : ''
          }">${e.message}</div>`
      )
      .join('');
  }

  function init() {
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.maxHeight = '40%';
    container.style.overflowY = 'auto';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.fontFamily = 'monospace';
    container.style.zIndex = '9999';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'flex-end';
    controls.style.gap = '0.5rem';
    controls.style.padding = '0.25rem';
    controls.style.borderBottom = '1px solid #ccc';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', copyEntries);

    const dismissBtn = document.createElement('button');
    dismissBtn.textContent = 'Dismiss';
    dismissBtn.addEventListener('click', dismiss);

    controls.appendChild(copyBtn);
    controls.appendChild(dismissBtn);

    content = document.createElement('div');
    content.style.padding = '0.25rem';

    container.appendChild(controls);
    container.appendChild(content);

    document.body.appendChild(container);
    updateDisplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
