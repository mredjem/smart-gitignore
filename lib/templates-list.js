'use babel';

import SelectList from 'atom-select-list';

export default class TemplatesList {

  selectedTemplate: null;

  constructor({ templates }) {
    const elementForItem = (item, options) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      return listItem;
    };

    this.selectList = new SelectList({
      items: templates,
      elementForItem,
      didChangeSelection: item => this.selectedTemplate = item
    });
  }

  destroy() {
    this.selectList.destroy();
  }

  getElement() {
    return this.selectList.element;
  }

  getSelectedTemplate() {
    return this.selectedTemplate;
  }

}
