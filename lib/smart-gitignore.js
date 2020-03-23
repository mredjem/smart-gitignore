'use babel';

import { CompositeDisposable } from 'atom';
import axios from 'axios';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'smart-gitignore:generate': () => this.generateGitignore()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  generateGitignore() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }

    const selection = editor.getSelectedText() || '';
    const templates = selection.split('\n').filter(template => template);

    if (!templates.length) {
      this.onPackageWarning(
        "No .gitignore templates were specified.",
        `At least **one** valid template has to be specified to generate the .gitignore file. Find the complete list of supported templates at [https://www.gitignore.io](https://www.gitignore.io).`
      );
      return;
    }

    this.callGitignoreApi('list?format=lines')
      .then(res => {
        const { data } = res;

        // find if any template is unknown to gitignore api
        const gitignoreTemplates = data.split('\n');
        const knownTemplates = templates.filter(template => gitignoreTemplates.includes(template));

        // if all templates are unknown, stop
        if (!knownTemplates.length) {
          this.onPackageWarning(
            "No .gitignore templates were specified.",
            `At least **one** valid template has to be specified to generate the .gitignore file. Find the complete list of supported templates at [https://www.gitignore.io](https://www.gitignore.io).`
          );
        }

        // if unknown template are found, notify and continue
        if (knownTemplates.length !== templates.length) {
          this.onPackageWarning(
            "Ignoring unknown .gitignore templates.",
            `Unknown templates will be ignored when generating the .gitignore file. Find the complete list of supported templates at [https://www.gitignore.io](https://www.gitignore.io).`
          );
        }

        return knownTemplates;
      })
      .then(knownTemplates => {
        if (!knownTemplates.length) {
          return;
        }

        const templateResources = knownTemplates.join(',');

        // fetch gitignore templates content
        return this.callGitignoreApi(templateResources)
          .then(res  => editor.insertText(res.data))
          .catch(err => this.onGitignoreApiError(err));
      })
      .catch(err => this.onGitignoreApiError(err));
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
