'use babel';

import TemplatesList from './templates-list';

export default class TemplatesView {

  constructor({ templates, onSubmit }) {
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

    footer.appendChild(okButton);
    this.element.appendChild(footer);
  }

  destroy() {
    this.templatesList.destroy();
  }

  getElement() {
    return this.element;
  }

}
