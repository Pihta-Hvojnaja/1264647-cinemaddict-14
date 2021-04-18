/*  Функция переформатирует время из mm -> h mm
   ========================================================================== */

export const getRuntime = (runtime) => {
  if (runtime > 59) {
    const resultHours = `${(runtime / 60 + '').split('.')[0]}h`;
    const resultMinutes = (runtime % 60) === 0 ? '' : `${runtime % 60}m`;

    return `${resultHours} ${resultMinutes}`;

  } else {
    return `${runtime}m`;
  }
};


/*  Для создания и отрисовки компонентов
    ========================================================================== */

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
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


/*  Close popup
    ========================================================================== */

export const createClosePopup = (evt, body, popup, btnClose) => {
  const closePopup = () => {
    evt.preventDefault();
    popup.remove();
    body.classList.remove('hide-overflow');
    btnClose.removeEventListener('click', onPopupCloseClick);
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closePopup();
    }
  };

  const onPopupCloseClick = () => {
    closePopup();
  };

  document.addEventListener('keydown', onEscKeyDown);
  btnClose.addEventListener('click', onPopupCloseClick);
};
