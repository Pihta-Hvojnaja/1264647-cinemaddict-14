
import Abstract from './../view/abstract.js';


/**
 * @type {Object} - перечисление содержит позиции для отрисовки элементов
 */
const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};


/**
 * Ф-ция отрисовки элемента
 * @param {Object} container - родитель, в котором отрисовывается элемент
 * @param {Object} child - что отрисовать
 * @param {Object} place - место отрисовки в родителе
 */
const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};


/**
 * Ф-ция создает DOM элемент на основе шаблона
 * @param {string} template - шаблон разметки. HTML в template должен иметь общую обёртку,
 * то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
 * а не просто <a>Link 1</a><a>Link 2</a>
 * @returns {Object} - возвращает готовый DOM элемент
 */
const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};


/**
 * Ф-ция перерисовывает DOM-элемент
 * @param {Object} newChild - новый компонент или элемент разметки
 * @param {Object} oldChild - заменяемый компонент или элемент разметки
 */
const replaceComponent = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};


/**
 * Ф-ция удаления компонента
 * @param {Object} component - удаляемый компонент
 */
const removeComponent = (component) => {
  if (component === null) {
    return;
  }


  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};


export {
  RenderPosition,
  render,
  createElement,
  replaceComponent,
  removeComponent
};
