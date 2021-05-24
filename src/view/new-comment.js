
import he from 'he';

import SmartView from './smart.js';
import { EmotionType } from '../const.js';


/**
 * Функция возвращает заполненный шаблон картинки-эмоции комментария
 * @param {string} emotion - тип выбранной пользователем эмоции
 * @returns {string} - заполненный шаблон картинки-эмоции комментария в виде строки или пустая строка
 */
const getImgEmotion = (emotion) => {
  return (emotion) ?
    `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`
    : emotion;
};


/**
 * Функция включает выбранную пользователем радиокнопку
 * @param {string} currentEmotion - выбранная пользователем эмоция
 * @param {string} emotionType - тип эмоции, передаваемый радиокнопкой
 * @returns {string} - атрибут 'checked' или пустая строка
 */
const getStatusRadioButton = (currentEmotion, emotionType) => {
  return currentEmotion === emotionType ? 'checked' : '';
};

const getStateInput = (isDisabled) => {
  return isDisabled ? 'disabled' : '';
};

const createNewCommentTemplate = (dataComent) => {

  const { comment, emotion, isDisabled } = dataComent;

  return `<div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${getImgEmotion(emotion)}
            </div>
            <label class="film-details__comment-label">
              <textarea ${getStateInput(isDisabled)} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(comment)}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input ${getStatusRadioButton(emotion, EmotionType.SMILE)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input ${getStateInput(isDisabled)} ${getStatusRadioButton(emotion, EmotionType.SLEEPING)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input ${getStateInput(isDisabled)} ${getStatusRadioButton(emotion, EmotionType.PUKE)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input ${getStateInput(isDisabled)} ${getStatusRadioButton(emotion, EmotionType.ANGRY)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>`;
};

export default class NewComment extends SmartView {
  constructor() {
    super();
    this._data = {
      comment: '',
      emotion: '',
      isDisabled: false,
    };

    this._commentInputElement = this.getElement().querySelector('.film-details__comment-input');

    this._commentTextareaInputHandler = this._commentTextareaInputHandler.bind(this);
    this._commentRadioChangeHandlers = this._commentRadioChangeHandlers.bind(this);

    this._setCommentHandlers();
    this._setCommentEmojiHandlers();
  }

  getTemplate() {
    return createNewCommentTemplate(this._data);
  }

  getData() {
    return NewComment.parseDataForServer(this._data);
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this._returnScrollTextArea();
    this.restoreHandlers();
  }

  restoreHandlers() {
    this._setCommentHandlers();
    this._setCommentEmojiHandlers();
  }

  _setCommentHandlers() {
    this._commentInputElement.addEventListener('input', this._commentTextareaInputHandler);
  }

  _returnScrollTextArea() {
    this._commentInputElement = this.getElement().querySelector('.film-details__comment-input');
    this._commentInputElement.scrollTop = this._commentInputElement.scrollHeight;
  }

  _setCommentEmojiHandlers() {
    this.getElement().querySelector('.film-details__emoji-list')
      .addEventListener('change', this._commentRadioChangeHandlers);
  }

  _commentTextareaInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _commentRadioChangeHandlers(evt) {
    evt.preventDefault();

    this.updateData({
      emotion: evt.target.value,
    });

    this._returnScrollTextArea();
    this.restoreHandlers();
  }

  static parseDataForServer(data) {
    delete data.isDisabled;

    return data;
  }
}
