'use babel';

import TemplatesList from './templates-list';

export default class TemplatesView {

  constructor({ templates, onSubmit, onExit }) {
    this.templatesList = new TemplatesList({ templates });

    this.element = document.createElement('div');
    this.element.classList.add('smart-gitignore');

    // add templates selection list
    this.element.appendChild(this.templatesList.getElement());

    // add footer with validation button
    const footer = document.createElement('div');
    footer.classList.add('footer');

    const okButton = document.createElement('button');
    okButton.classList.add('btn-primary');
    okButton.textContent = 'Generate';
    okButton.addEventListener('click', () => onSubmit(this.templatesList.getSelectedTemplate()));

    const closeButton = document.createElement('button');
    closeButton.classList.add('btn-success');
    closeButton.textContent = 'All done';
    closeButton.addEventListener('click', onExit);

    footer.appendChild(okButton);
    footer.appendChild(closeButton);

    this.element.appendChild(footer);
  }

  destroy() {
    this.templatesList.destroy();
  }

  getElement() {
    return this.element;
  }

}
