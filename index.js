// Import stylesheets
import './style.css';
import {
  listenOnce,
  observeMouseOutsideOfContainer,
  setValueForNode,
  getValueForNode,
} from './utils.js';
import { makeEditor } from './editor.js';

// TODO:
// 1. Still need the "New" case, replace the list with a form.
// 2. Need to handle the form from within the editor and Still
//    emit lifecycle events.

const table = document.querySelector('#center-column table');

// cc.appendChild(makeEditor());

// Notice the pattern for this focus handler.
// It has the entire responsibility for managing
// the editor.
// It sets the initial value.
// Listens for change, cancel, and clickOutside.
let isEditing = false;
const sourceOnFocus = (evt) => {
  if (!isEditing) {
    const src = evt.target;
    let editor = makeEditor();
    // Set the intial value.
    editor.querySelector('input').value = getValueForNode(src);

    // Style and add to DOM.
    editor.style.top = '0px';
    src.appendChild(editor);
    editor.querySelector('input').focus();

    // Setup the listeners.
    listenOnce(editor, 'change', (event) => {
      isEditing = false;
      setValueForNode(src, event.detail);
      console.log(editor.parentElement, src.contains(editor));
      try {
        if (src.contains(editor)) {
          src.removeChild(editor);
        } else if (editor.parentElement) {
          editor.parentElement.removeChild(editor);
        }
        editor = null;
      } catch (er) {
        console.error(er);
      }
    });

    listenOnce(editor, 'cancel', (event) => {
      isEditing = false;
      editor.parentElement.removeChild(editor);
      editor = null;
    });

    const sub = observeMouseOutsideOfContainer(editor).subscribe((evt) => {
      sub.unsubscribe();
      isEditing = false;
      try {
        if (src.contains(editor)) {
          src.removeChild(editor);
        } else if (editor.parentElement) {
          editor.parentElement.removeChild(editor);
        }
        editor = null;
      } catch (er) {
        console.error(er);
      } finally {
        editor = null;
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
console.log(cells);
// Add a listener to each of the p.rel's in the stamp.
// When they get focus, we'll overlay the editor.
sources.forEach((p) => p.addEventListener('focus', sourceOnFocus));

cells.forEach((p) => p.addEventListener('focus', sourceOnFocus));

console.log('========== end of file ==========');
