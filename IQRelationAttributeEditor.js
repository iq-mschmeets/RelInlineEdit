import {
  reifyTemplate,
  isNull,
  show,
  showItem,
  hide,
  hideItem,
  dispatchEvent,
  listenOnce,
  addSafeEventListener,
} from './utils.js';

import { IQAttributeForm, makeIQAttributeForm } from './IQAttributeForm.js';

export class IQRelationAttributeEditor extends HTMLElement {
  constructor() {
    super();
    this.onChanged = this.onChanged.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onCancelKey = this.onCancelKey.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onNew = this.onNew.bind(this);

    this._listeners = [];
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldVal, newVal) {}

  connectedCallback() {
    console.log('%s.connectedCallback', this.tagName);
    this.appendChild(reifyTemplate('editor-template'));
    this.addEventHandlers();
    requestAnimationFrame(() => {
      this.qs('input').focus();
    });
  }

  disconnectedCallback() {
    console.log('%s.disconnectedCallback', this.tagName);
    try {
      this.removeEventHandlers();
    } catch (er) {
      console.error(er);
    }
  }

  editor() {
    return this.shadowRoot || this;
  }

  qs(selector) {
    return this.editor().querySelector(selector);
  }

  addEventHandlers() {
    const input = this.editor().querySelector('input');
    const newBtn = this.editor().querySelector('.listbox .footer');
    const list = this.editor().querySelector('.listbox');

    this._listeners.push(
      addSafeEventListener(this.editor(), 'input', 'change', this.onChanged)
    );
    this._listeners.push(
      addSafeEventListener(this.editor(), 'input', 'input', this.onInput)
    );
    this._listeners.push(
      addSafeEventListener(this.editor(), 'input', 'focus', this.onFocus)
    );
    this._listeners.push(
      addSafeEventListener(this.editor(), 'input', 'keydown', this.onCancelKey)
    );
    this._listeners.push(
      addSafeEventListener(this.editor(), '.listbox', 'click', this.onSelect)
    );
    this._listeners.push(
      addSafeEventListener(this.editor(), '.listbox', 'click', this.onNew)
    );
  }

  removeEventHandlers() {
    this._listeners.forEach((listener) => listener.unsub());
    this._listeners = [];
  }

  set value(val) {
    this._val = val;
  }

  set stringValue(val) {
    this._stringVal = val;
  }

  get stringValue() {
    return this._stringVal;
  }

  onChanged(evt) {
    evt.target.value === '' ? hide(evt.target) : show(evt.target);
  }

  onFocus(evt) {
    show(this.qs('.listbox'));
  }

  onCancelKey(evt) {
    switch (evt.which) {
      case 27: {
        hide(this);
        this.qs('input').blur();
        dispatchEvent(this, 'change', evt.target.textContent);
        break;
      }
    }
  }

  onSelect(evt) {
    if (evt.target.tagName.toLowerCase() === 'li') {
      this.stringValue = evt.target.textContent;
      this.qs('input').blur();
      hide(this);
      dispatchEvent(this, 'change', evt.target.textContent);
    }
  }

  // keyup 38 keydown 40
  onInput(evt) {
    switch (evt.which) {
      case 13: {
        break;
      }
      default: {
        const choices = Array.from(this.editor().querySelectorAll('li'));

        if (evt.target.value === '') {
          choices.forEach(showItem);
          console.log('choices show %o', choices);
        } else {
          let re = new RegExp(evt.target.value, 'i');
          const matched = choices.filter((li) => re.test(li.textContent));
          console.log(evt.target.value, matched);
          requestAnimationFrame(() => {
            choices.forEach(hideItem);
            matched.forEach(showItem);
          });
        }
      }
    }
  }

  onNew(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const aForm = makeIQAttributeForm();
    const editorPanel = this.qs('.editor-panel');

    listenOnce(aForm, 'cancel', () => {
      requestAnimationFrame(() => {
        aForm.replaceWith(editorPanel);
      });
    });

    requestAnimationFrame(() => {
      editorPanel.replaceWith(aForm);
    });
  }
}

try {
  if (isNull(customElements.get('iq-relation-attribute-editor'))) {
    customElements.define(
      'iq-relation-attribute-editor',
      IQRelationAttributeEditor
    );
  }
} catch (er) {
  console.error(er);
}

export function makeIQRelationAttributeEditor() {
  return new IQRelationAttributeEditor();
}
