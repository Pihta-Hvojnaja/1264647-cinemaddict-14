
import { removeComponent } from './render.js';

/*  Close popup
    ========================================================================== */

export const createPopupCloser = (body, popupComponent) => {

  const closePopup = () => {
    removeComponent(popupComponent);
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closePopup();
    }
  };

  document.addEventListener('keydown', onEscKeyDown);
  popupComponent.setClickHandler(() => closePopup());
};
