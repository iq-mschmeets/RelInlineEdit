// Import stylesheets
import './style.css';

import {
  listenOnce,
  observeMouseOutsideOfContainer,
  setValueForNode,
  getValueForNode,
} from './utils.js';
import { makeEditor } from './editor.js';
import { makeIQRelationAttributeEditor } from './IQRelationAttributeEditor.js';
import { IQRelationshipValue } from './IQRelationshipValue.js';

// TODO:
// 1. Still need the "New" case, replace the list with a form.
// 2. Need to handle the form from within the editor and Still
//    emit lifecycle events.

const table = document.querySelector('#center-column table');
let irv = new IQRelationshipValue();

customElements.whenDefined('iq-relation-attribute-editor').then(() => {
  console.log('CE1 defined');
});
customElements.whenDefined('iq-attribute-form').then(() => {
  console.log('CE2 defined');
});
customElements.whenDefined('iq-relationship-value').then(() => {
  console.log('CE3 defined');
});

// Notice the pattern for this focus handler.
// It has the entire responsibility for managing
// the editor.
// It sets the initial value.
// Listens for change, cancel, and clickOutside.
let isEditing = false;
const sourceOnFocus = (evt) => {
  if (!isEditing) {
    const src = evt.target;
    let editor = makeIQRelationAttributeEditor();
    // requestAnimationFrame( () => {
    editor.rows = [
      'BigCo',
      'LittleCo',
      'Magic Money',
      'NoTax Co',
      'Profits From Heaven',
      'Widgets Unlimited',
      'Toxicity',
    ];
    console.log( "editor.rows set %o", editor.rows );
    // });

    // Set the intial value.
    requestAnimationFrame(() => {
      src.appendChild(editor);
      editor.stringValue = getValueForNode(src);
      editor.style.top = '0px';
    });

    const removeEditor = () => {
      if (src.contains(editor)) {
        src.removeChild(editor);
      } else if (editor.parentElement) {
        editor.parentElement.removeChild(editor);
      }
      editor = null;
    };

    // Setup the listeners.
    const sub = observeMouseOutsideOfContainer(editor).subscribe((evt) => {
      sub.unsubscribe();
      isEditing = false;
      try {
        removeEditor();
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
      }
    });

    listenOnce(editor, 'change', (event) => {
      isEditing = false;
      editor.stringValue = event.detail;
      setValueForNode(src, editor.stringValue);
      console.log(editor.parentElement, src.contains(editor));
      try {
        removeEditor();
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
        sub.unsubscribe();
      }
    });

    listenOnce(editor, 'cancel', (event) => {
      isEditing = false;
      try {
        removeEditor();
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
        sub.unsubscribe();
      }
    });
  }
  isEditing = true;
};

// The p.rel in the document, these are the "target" elements
// to host the editor.
const sources = Array.from(
  document.querySelector('.stamp').querySelectorAll('p.rel')
);

const cells = Array.from(table.querySelectorAll('td[tabindex="0"]'));
// console.log(cells);
// Add a listener to each of the p.rel's in the stamp.
// When they get focus, we'll overlay the editor.
// sources.forEach((p) => p.addEventListener('focus', sourceOnFocus));

cells.forEach((p) => p.addEventListener('focus', sourceOnFocus));

// console.log('========== end of file ==========');
