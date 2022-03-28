import { makeIQRelationAttributeEditor } from './IQRelationAttributeEditor.js';
import { isNull, observeMouseOutsideOfContainer, listenOnce } from './utils.js';

export class IQRelationshipValue extends HTMLElement {
  constructor() {
    super();
    this.onFocus = this.onFocus.bind(this);
    this.onClick = this.onClick.bind(this);

    this._isEditing = false;
    this._initialValue = '';
  }
  static get observedAttributes() {
    return [
      'data-class-id',
      'data-relationship-name',
      'data-element-id',
      'data-column-name',
    ];
  }
  set classId(val) {
    this._classId = val;
  }
  set columnName(val) {
    this._columnName = val;
  }
  set relationshipName(val) {
    this._relationshipName = val;
  }
  set elementId(val) {
    this._elementId = val;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'data-class-id': {
        this.classId = newVal;
        break;
      }
      case 'data-column-name': {
        this.columnName = newVal;
        break;
      }
      case 'data-element-id': {
        this.elementId = newVal;
      }
      case 'data-relationship-name': {
        this.relationshipName = newVal;
      }
    }
  }
  connectedCallback() {
    this.addListeners();
  }
  disconnectedCallback() {
    this.removeListeners();
  }
  addListeners() {
    // Having both listeners results in an "infinite loop" of editing.
    // this.addEventListener('click', this.onClick);
    this.addEventListener('focus', this.onFocus);
  }
  removeListeners() {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('focus', this.onFocus);
  }
  onFocus(evt) {
    console.log('%s.onFocus %o', this.tagName, evt);
    if (!this._isEditing) {
      this.removeListeners();
      this.invokeEdit();
    }
  }
  onClick(evt) {
    console.log('%s.onClick %o', this.tagName, evt);
    evt.preventDefault();
    evt.stopPropagation();
    if (!this._isEditing) {
      this.removeListeners();
      this.invokeEdit();
    }
  }
  invokeEdit() {
    let editor = makeIQRelationAttributeEditor();       
    this._initialValue = this.textContent;

    // Set the intial value.
    requestAnimationFrame(() => {
      this.appendChild(editor);
      editor.stringValue = this._initialValue;
      editor.style.top = '0px';
    });

    const removeEditor = () => {
      this.addListeners();
      if (this.contains(editor)) {
        this.removeChild(editor);
      } else if (editor.parentElement) {
        editor.parentElement.removeChild(editor);
      }
      editor = null;
    };

    // Setup the listeners.
    const sub = observeMouseOutsideOfContainer(editor).subscribe((evt) => {
      sub.unsubscribe();
      this._isEditing = false;
      this.textContent = this._initialValue;
      try {
        removeEditor();
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
      }
    });

    // Who should be responsible for the UPDATE?
    listenOnce(editor, 'change', (event) => {
      this._isEditing = false;
      editor.stringValue = event.detail;
      this._initialValue = event.detail;

      try {
        removeEditor();
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
        sub.unsubscribe();
        this.textContent = this._initialValue;
      }
    });

    listenOnce(editor, 'cancel', (event) => {
      this._isEditing = false;
      try {
        removeEditor();
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
        sub.unsubscribe();
        this.textContent = this._initialValue;
      }
    });
    this._isEditing = true;
  }
}
try {
  if (isNull(customElements.get('iq-relationship-value'))) {
    customElements.define('iq-relationship-value', IQRelationshipValue);
  }
} catch (er) {
  console.error(er);
}
