const plugin = {
    id: 'jupyterlab_block_copy:plugin',
    description: 'A JupyterLab extension. block copy/cut events in jupyterLab 0.1.6',
    autoStart: true,
    activate: (app) => {
        console.log('JupyterLab extension jupyterlab_block_copy is activated!');
        // Inject script để chặn events
        const script = document.createElement('script');
        script.textContent = `
setTimeout(function() {
  let pendingClearTimeout = null;

  function clearClipboardNow() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('').catch(err => {
        console.warn('Failed to clear clipboard:', err);
      });
    } else {
      console.warn('Clipboard API not supported');
    }
    console.log('Clipboard cleared immediately on blur/hidden.');
    if (pendingClearTimeout) {
      clearTimeout(pendingClearTimeout);
      pendingClearTimeout = null;
    }
  }

  function scheduleClipboardClear(delay = 1000) {  // Reduced to 1s for faster clear
    if (pendingClearTimeout) {
      clearTimeout(pendingClearTimeout);
    }
    pendingClearTimeout = setTimeout(() => {
      clearClipboardNow();
    }, delay);
    console.log('Clipboard clear scheduled in ' + delay + 'ms.');
  }

  function onClipboardEvent(e) {
    const isCodeCell = e.target && e.target.closest && e.target.closest('.cm-editor, .CodeMirror');

    if (e.type === 'copy' || e.type === 'cut') {
      if (isCodeCell) {
        console.log('Detected ' + e.type + ' from code cell, scheduling clear.');
        scheduleClipboardClear(1000);
      }
    } else if (e.type === 'paste') {
      if (isCodeCell && pendingClearTimeout) {
        console.log('Detected internal paste to code cell, resetting clear timer.');
        scheduleClipboardClear(1000);  // Reset timer to allow chained operations
      } else if (isCodeCell) {
        console.log('Paste from external to code cell (no pending clear).');
      }
    }
  }

  // Listen for clipboard events
  ['copy', 'cut', 'paste'].forEach(eventType => {
    document.addEventListener(eventType, onClipboardEvent, { capture: false });
  });

  // Clear on window blur (e.g., switch to external app or tab)
  window.addEventListener('blur', () => {
    clearClipboardNow();
  });

  // Clear on page hidden (e.g., switch tabs or minimize)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearClipboardNow();
    }
  });

  console.log('Enhanced clipboard protection: Short delay + auto-clear on blur/hidden for stronger external block, internal resets timer.');
}, 1000);
    `;
        (document.head || document.documentElement).appendChild(script);
    }
};
export default plugin;
