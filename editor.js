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

export const getHandlers = (editor) => {
  return {
    editor: editor,
    onChanged(evt) {
      evt.target.value === '' ? hideItem(evt.target) : showItem(evt.target);
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
          let re = new RegExp(evt.target.value, 'i');
          const choices = Array.from(editor.querySelectorAll('li'));
          choices.forEach(hide);
          const matched = choices.filter((li) => re.test(li.textContent));
          matched.length == 0 ? choices.forEach(show) : matched.forEach(show);
        }
      }
    },
    onNew(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      console.log('New button clicked !!');
    },
  };
};

export const makeEditor = () => {
  const editor = reifyTemplate('editor-template').firstElementChild;
  const input = editor.querySelector('input');
  const newBtn = editor.querySelector('.listbox .footer');
  const list = editor.querySelector('.listbox');
  const handlers = getHandlers(editor);

  input.addEventListener('change', handlers.onChanged);
  input.addEventListener('input', handlers.onInput);
  input.addEventListener('focus', handlers.onFocus);
  list.addEventListener('click', handlers.onSelect);
  input.addEventListener('keydown', handlers.onCancelKey);
  newBtn.addEventListener('click', handlers.onNew);

  return editor;
};
