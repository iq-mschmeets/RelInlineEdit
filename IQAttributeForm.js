import { reifyTemplate, isNull, hide, dispatchEvent } from './utils.js';

export class IQAttributeForm extends HTMLElement {
  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
    this.onCancelKey = this.onCancelKey.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldVal, newVal) {}

  connectedCallback() {
    this.appendChild(reifyTemplate('form-template'));

    this.addFormItems();

    this.addEventHandlers();
  }

  disconnectedCallback() {
    this.removeEventHandlers();
    this.replaceChildren(document.createTextNode(''));
  }

  editor() {
    return this.shadowRoot || this;
  }

  qs(selector) {
    return this.editor().querySelector(selector);
  }

  addEventHandlers() {
    this.qs('.save-button').addEventListener('click', this.onSave);
    this.qs('.cancel-button').addEventListener('click', this.onCancel);
    this.addEventListener('keydown', this.onCancelKey);
    this.qs('form').addEventListener('change', this.onStop);
    this.addEventListener('change', this.onStop);
    this.addEventListener('click', this.onStop);
  }

  removeEventHandlers() {
    this.qs('.save-button').removeEventListener('click', this.onSave);
    this.qs('.cancel-button').removeEventListener('click', this.onCancel);
    this.qs('form').removeEventListener('change', this.onStop);
    this.removeEventListener('keydown', this.onCancelKey);
    this.removeEventListener('change', this.onStop);
    this.removeEventListener('click', this.onStop);
  }

  onCancelKey(evt) {
    switch (evt.which) {
      case 27: {
        this.onCanel();
        break;
      }
    }
  }

  onCancel(evt) {
    console.log('%s.onSave ', this.tagName, evt);
    hide(this);
    dispatchEvent(this, 'cancel', {});
  }

  onSave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    hide(this);
    let fData = new FormData(this.qs('form'));
    console.log('%s.onSave ', this.tagName, evt, fData);
    dispatchEvent(this, 'change', fData);
  }

  onStop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log('%s.onStop ', this.tagName, evt);
  }

  addFormItems() {
    let fi = [
      { name: 'one-1', value: '', label: 'One' },
      { name: 'two-2', value: '', label: 'Two' },
      { name: 'three-3', value: '', label: 'Three' },
    ];
    const df = fi.reduce((acc, item, indx) => {
      const fid = reifyTemplate('form-item').firstElementChild;
      fid.querySelector('input').setAttribute('name', item.name);
      fid.querySelector('input').setAttribute('id', '_indx' + indx);
      fid.querySelector('label').textContent = item.label;
      fid.querySelector('label').setAttribute('for', '_indx' + indx);
      acc.appendChild(fid);
      return acc;
    }, document.createDocumentFragment());

    requestAnimationFrame(() => {
      this.qs('.item-container').appendChild(df);
      setTimeout(() => {
        this.qs('input:first-of-type').focus();
      }, 25);
    });
  }
}

try {
  if (isNull(customElements.get('iq-attribute-form'))) {
    customElements.define('iq-attribute-form', IQAttributeForm);
  }
} catch (er) {
  console.error(er);
}

export function makeIQAttributeForm() {
  return new IQAttributeForm();
}
