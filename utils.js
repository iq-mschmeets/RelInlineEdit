/* Example to keep focus within a component.*/ export const focusChecker =
  (el) => (evt) => {
    if (!el.contains(evt.target)) {
      evt.stopPropagation();
      el.focus();
    }
  };
// and then...
// document.addEvenListener("focus", focusChecker(el), true );
// to return focus after the component is finished...
// let lastFocus = document.activeElement;

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
};

export const show = (el) => {
  el.classList.remove('hide');
  el.classList.add('show');
};

export const setValue = (input, value) => (input.value = value);
