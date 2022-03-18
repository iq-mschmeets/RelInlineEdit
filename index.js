// Import stylesheets
import './style.css';
import { listenOnce, observeMouseOutsideOfContainer } from './utils.js';
import { makeEditor } from './editor.js';

const cc = document.querySelector('#center-column');
cc.appendChild(makeEditor());

let isEditing = false;
const sourceOnFocus = (evt) => {
  if (!isEditing) {
    const editor = makeEditor();
    const src = evt.target;
    editor.style.top = '0px';
    src.appendChild(editor);
    src.querySelector('input').focus();
    listenOnce(editor, 'change', (event) => {
      src.querySelector('.value').textContent = event.detail;
      isEditing = false;
    });
    listenOnce(editor, 'cancel', (event) => {
      isEditing = false;
    });
    const sub = observeMouseOutsideOfContainer(editor).subscribe((evt) => {
      sub.unsubscribe();
      editor.parentElement.removeChild(editor);
      isEditing = false;
    });
  }
  isEditing = true;
};

// The p.rel in the document, these are the "target" elements
// to host the editor.
const sources = Array.from(
  document.querySelector('.stamp').querySelectorAll('p.rel')
);

// Add a listener to each of the p.rel's in the stamp.
// When they get focus, we'll overlay the editor.
sources.forEach((p) => p.addEventListener('focus', sourceOnFocus));

console.log('========== end of file ==========');
