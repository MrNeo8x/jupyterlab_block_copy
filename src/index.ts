import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_block_copy extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_block_copy:plugin',
  description: 'A JupyterLab extension. block copy/cut events in jupyterLab',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_block_copy is activated!');
     // Inject script để chặn events
    const script = document.createElement('script');
    script.textContent = `
      // Chặn copy, cut, paste, và contextmenu
      ['copy', 'cut', 'contextmenu'].forEach(eventType => {
        document.addEventListener(eventType, function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, true); // Capture phase để chặn sớm
      });
      console.log('Copy/paste blocking script injected!');
    `;
    (document.head || document.documentElement).appendChild(script);
  }
};

export default plugin;
