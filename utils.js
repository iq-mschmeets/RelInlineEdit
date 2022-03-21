import { fromEvent } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

/* Example to keep focus within a component.*/
export const focusChecker = (el) => (evt) => {
  if (!el.contains(evt.target)) {
    evt.stopPropagation();
    el.focus();
  }
};
// and then...
// document.addEvenListener("focus", focusChecker(el), true );
// to return focus after the component is finished...
// let lastFocus = document.activeElement;

export const observeMouseOutsideOfContainer = (element) => {
  return fromEvent(document, 'mousedown').pipe(
    filter((evt) => !element.contains(evt.target))
  );
};

export const eventFactory = (name, data) => {
  var rval = null;
  if (document.createCustomEvent) {
    rval = document.createEvent('Event');
    rval.detail = data;
    rval.initEvent(name, true, true);
  } else {
    rval = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail: data,
    });
  }
  return rval;
};

export const dispatchEvent = (el, name, data) => {
  el.dispatchEvent(eventFactory(name, data));
};

export const listenOnce = (el, name, handler, context) => {
  const f = function onEvent(evt) {
    if (context) {
      handler.call(context, evt);
    } else {
      handler(evt);
    }
    el.removeEventListener(name, f);
  };

  el.addEventListener(name, f);
};

export const reifyTemplate = (domID) =>
  document.getElementById(domID).content.cloneNode(true);

export const hide = (el) => {
  el.classList.remove('show');
  el.classList.add('hide');
  // listenOnce(el, 'transitionend', () => {
  //   // el.style.display = 'none';
  //   console.log('hide.transitionend fired ', el);
  // });
};

export const show = (el) => {
  el.classList.remove('hide');
  el.classList.add('show');
  // listenOnce(el, 'transitionend', () => {
  //   // el.style.display = 'block';
  //   console.log('show.transitionend fired ', el);
  // });
};

export const hideItem = (el) => {
  el.classList.remove('showItem');
  el.classList.add('hideItem');
  listenOnce(el, 'transitionend', () => {
    el.style.display = 'none';
    console.log('hide.transitionend fired ', el);
  });
};

export const showItem = (el) => {
  el.classList.remove('hideItem');
  el.classList.add('showItem');
  listenOnce(el, 'transitionend', () => {
    el.style.display = 'block';
    console.log('show.transitionend fired ', el);
  });
};

export const setValue = (input, value) => (input.value = value);

export const getValueForNode = (node) => {
  let pref = node.querySelector('.value');
  if (pref) {
    return node.querySelector('.value').textContent;
  }
  return node.textContent;
};

export const setValueForNode = (node, value) => {
  let pref = node.querySelector('.value');
  if (pref) {
    node.querySelector('.value').textContent = value;
  } else {
    node.textContent = value;
  }
};
