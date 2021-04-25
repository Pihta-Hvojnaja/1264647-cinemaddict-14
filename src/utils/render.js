
import Abstract from './../view/abstract.js';


/*  Для создания и отрисовки компонентов
    ========================================================================== */

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, child, place = RenderPosition.BEFOREEND) => {
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

// Принцип работы:
// 1. создаёт пустой div-блок
// 2. берёт HTML в виде строки и вкладывает в этот div-блок, превращая в DOM-элемент
// 3. возвращает ребенка div-блока (шаблон ввиде DOM-элемента)
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2
  return newElement.firstChild; // 3
};
// Нюанс: HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

export const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};
