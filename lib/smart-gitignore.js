'use babel';

import { CompositeDisposable } from 'atom';
import axios from 'axios';
import TemplatesView from './templates-view';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.callGitignoreApi('list?format=lines')
      .then(res => {
        const templates = res.data.split('\n');

        this.templatesView = new TemplatesView({
          templates,
          onSubmit: this.generateGitignore.bind(this),
          onExit: this.closeTemplatesView.bind(this)
        });

        this.modal = atom.workspace.addModalPanel({
          item: this.templatesView.getElement(),
          autoFocus: true
        });

        this.subscriptions.add(atom.commands.add('atom-workspace', {
          'smart-gitignore:generate': () => this.openTemplatesView()
        }));
      })
      .catch(err => this.onGitignoreApiError(err));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.templatesView.destroy();
    this.modal.destroy();
  },

  openTemplatesView() {
    this.modal.show();
  },

  closeTemplatesView() {
    this.modal.hide();
  },

  generateGitignore(template) {
    atom.workspace
      .open(".gitignore")
      .then(editor => {
        this.callGitignoreApi(template)
          .then(res  => editor.insertText(res.data))
          .catch(err => this.onGitignoreApiError(err));
      });
  },

  callGitignoreApi(resource) {
    return axios.get(`https://www.gitignore.io/api/${resource}`);
  },

  onPackageWarning(message, description) {
    const options = {
      description,
      dismissable: true,
      icon: 'alert'
    };
    atom.notifications.addWarning(message, options);
  },

  onGitignoreApiError(error = {}) {
    const { message } = error;
    const options = {
      detail: message,
      dismissable: true,
      icon: 'flame'
    };
    atom.notifications.addError("Failed to reach Gitignore Api.", options);
  }

};
