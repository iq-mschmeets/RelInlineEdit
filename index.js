// Import stylesheets
import './style.css';
import { listenOnce, setValue } from './utils.js';
import { makeEditor } from './editor.js';
import { of, map, Observable } from 'rxjs';

// of('World')
//   .pipe(map((name) => `Hello, ${name}!`))
//   .subscribe(console.log);

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById('myDropdown').classList.toggle('show');
}

// Close the dropdown menu if the user clicks outside of it
// window.onclick = function (event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName('dropdown-content');
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// };

console.log('==========starting out==========');
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
  }
  isEditing = true;
};
const sources = Array.from(
  document.querySelector('.stamp').querySelectorAll('p.rel')
);
sources.forEach((p) => p.addEventListener('focus', sourceOnFocus));

console.log('==========ending up==========');

console.log('end of file');
