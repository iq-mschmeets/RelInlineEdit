import {
  reifyTemplate,
  dispatchEvent,
  hide,
  show,
  hideItem,
  showItem,
  setValue,
  observeMouseOutsideOfContainer,
} from './utils.js';

import { IQRelationAttributeEditor } from './IQRelationAttributeEditor.js';

export const getHandlers = (editor) => {
  return {
    editor: editor,
    onChanged(evt) {
      evt.target.value === '' ? hide(evt.target) : show(evt.target);
    },
    onFocus(evt) {
      show(editor.querySelector('.listbox'));
    },
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
    },
    onSelect(evt) {
      if (evt.target.tagName.toLowerCase() === 'li') {
        setValue(editor.querySelector('input'), evt.target.textContent);
        editor.querySelector('input').blur();
        hide(editor);
        dispatchEvent(editor, 'change', evt.target.textContent);
      }
    },
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
    },
    onNew(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      const formPanel = reifyTemplate('form-template').firstElementChild;

      editor.replaceChild(
        formPanel.querySelector('.form-panel'),
        editor.querySelector('.editor-panel')
      );

      console.log('New button clicked !!');
    },
  };
};

export const makeEditor = () => {
  // const editor = reifyTemplate('editor-template').firstElementChild;
  // const input = editor.querySelector('input');
  // const newBtn = editor.querySelector('.listbox .footer');
  // const list = editor.querySelector('.listbox');
  // const handlers = getHandlers(editor);

  // input.addEventListener('change', handlers.onChanged);
  // input.addEventListener('input', handlers.onInput);
  // input.addEventListener('focus', handlers.onFocus);
  // list.addEventListener('click', handlers.onSelect);
  // input.addEventListener('keydown', handlers.onCancelKey);
  // newBtn.addEventListener('click', handlers.onNew);

  return new IQRelationAttributeEditor();
};
