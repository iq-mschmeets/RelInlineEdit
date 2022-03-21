import { reifyTemplate, isNull, hide, dispatchEvent } from './utils.js';

export class IQAttributeForm extends HTMLElement {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onCancelKey = this.onCancelKey.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldVal, newVal) {}

  connectedCallback() {
    this.appendChild(reifyTemplate('form-template'));
    this.addEventHandlers();
    requestAnimationFrame(() => {
      this.qs('input:first-of-type').focus();
    });
  }

  disconnectedCallback() {
    this.removeEventHandlers();
  }

  editor() {
    return this.shadowRoot || this;
  }

  qs(selector) {
    return this.editor().querySelector(selector);
  }

  addEventHandlers() {
    this.qs('.save-button').addEventListener('click', this.onChange);
    this.qs('.cancel-button').addEventListener('click', this.onCancel);
    this.addEventListener('keydown', this.onCancelKey);
  }

  removeEventHandlers() {
    this.qs('.save-button').removeEventListener('click', this.onChange);
    this.qs('.cancel-button').removeEventListener('click', this.onCancel);
    this.addEventListener('keydown', this.onCancelKey);
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
    hide(this);
    dispatchEvent(this, 'cancel', {});
  }

  onChange(evt) {
    hide(this);
    let fData = new FormData(this.qs('form'));
    dispatchEvent(this, 'change', fData);
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
