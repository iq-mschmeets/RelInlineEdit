import { reifyTemplate } from './utils.js';

const getRelLink = () => {
  const r = document.createElement('link');
  r.setAttribute('rel', 'stylesheet');
  r.setAttribute('href', './style.css');
  return r;
};
export class IQRelationAttributeEditor extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({ mode: 'open' });
    // this.shadowRoot.appendChild(
    //   reifyTemplate('editor-template').firstElementChild
    // );

    this.onChanged = this.onChanged.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onCancelKey = this.onCancelKey.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onNew = this.onNew.bind(this);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldVal, newVal) {}

  connectCallback() {
    this.appendChild(reifyTemplate('editor-template').firstElementChild);
    this.addEventHandlers();
    requestAnimationFrame(() => {
      this._el.querySelector('input').focus();
    });
  }

  disconnectedCallback() {
    this.removeEventHandlers();
  }

  _el() {
    // return this.shadowRoot;
    return this;
  }

  addEventHandlers() {
    const editor = this._el;
    const input = editor.querySelector('input');
    const newBtn = editor.querySelector('.listbox .footer');
    const list = editor.querySelector('.listbox');

    input.addEventListener('change', this.onChanged);
    input.addEventListener('input', this.onInput);
    input.addEventListener('focus', this.onFocus);
    list.addEventListener('click', this.onSelect);
    input.addEventListener('keydown', this.onCancelKey);
    newBtn.addEventListener('click', this.onNew);
  }

  removeEventHandlers() {
    const editor = this._el;
    const input = editor.querySelector('input');
    const newBtn = editor.querySelector('.listbox .footer');
    const list = editor.querySelector('.listbox');
    const handlers = getHandlers(editor);

    input.removeEventListener('change', this.onChanged);
    input.remvoeEventListener('input', this.onInput);
    input.removeEventListener('focus', this.onFocus);
    list.removeEventListener('click', this.onSelect);
    input.removeEventListener('keydown', this.onCancelKey);
    newBtn.removeEventListener('click', this.onNew);
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
    show(editor.querySelector('.listbox'));
  }

  onCancelKey(evt) {
    switch (evt.which) {
      case 27: {
        console.log('escape ', editor);
        hide(editor);
        editor.querySelector('input').blur();
        dispatchEvent(editor, 'change', evt.target.textContent);
        break;
      }
    }
  }

  onSelect(evt) {
    if (evt.target.tagName.toLowerCase() === 'li') {
      setValue(editor.querySelector('input'), evt.target.textContent);
      editor.querySelector('input').blur();
      hide(editor);
      dispatchEvent(editor, 'change', evt.target.textContent);
    }
  }

  // keyup 38 keydown 40
  onInput(evt) {
    switch (evt.which) {
      case 13: {
        break;
      }
      default: {
        console.log('input ', evt.target.value, evt.target.value === '');
        const choices = Array.from(editor.querySelectorAll('li'));
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
    const formPanel = reifyTemplate('form-template').firstElementChild;

    editor.replaceChild(
      formPanel.querySelector('.form-panel'),
      editor.querySelector('.editor-panel')
    );

    console.log('New button clicked !!');
  }
}

try {
  customElements.define(
    'iq-relation-attribute-editor',
    IQRelationAttributeEditor
  );
} catch (er) {
  console.error(er);
}
