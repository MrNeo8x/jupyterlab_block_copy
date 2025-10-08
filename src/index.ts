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
  }
};

export default plugin;
