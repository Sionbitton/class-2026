function getElement(selector) {
  return document.querySelector(selector);
}

function setCss(element, property, value) {
  // element.style.property = value;
  element.style[property] = value;
}

function getCss(element, property) {
  // return element.style[property];
  return getComputedStyle(element)[property];
}

function on(element, eventType, callback) {
  element.addEventListener(eventType, callback);
}

function click(element, callback) {
  on(element, 'click', callback);
}

/*
const pcsTools = {
  getElement,
  /*setCss,
  getCss,* /
  css: function (element, property, value) {
    console.log(arguments);

    if (arguments.length < 3) {
      return getCss(element, property);
    } else {
      setCss(element, property, value);
    }
  },
  on,
  click
};

export default pcsTools;
*/

export default function (selector) {
  const element = getElement(selector);

  return {
    css: function (property, value) {
      console.log(arguments);

      if (arguments.length < 2) {
        return getCss(element, property);
      } else {
        setCss(element, property, value);
      }
    },
    on: (eventType, callback) => on(element, eventType, callback),
    click: callback => click(element, callback),
    hide() {
      setCss(element, 'display', 'none');
    },
    show() {
      setCss(element, 'display', 'inline-block');
    },
    sparkle(speed = 1000, duration = 5000) {
      const originalColor = element.style.color;
      const colors = ['red', 'green', 'blue', 'purple'];
      let nextColor = 0;

      const interval = setInterval(() => {
        setCss(element, 'color', colors[nextColor]);
        nextColor = (nextColor + 1) % colors.length;
      }, speed);

      setTimeout(() => {
        clearInterval(interval);
        setCss(element, 'color', originalColor);
      }, duration);
    }
  };
}
