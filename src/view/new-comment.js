
import SmartView from './smart.js';

/**
 * @type {Object} - перечисление с типами эмоций
 */
const EmotionType = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};


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


const createNewCommentTemplate = (dataComent) => {

  const { comment, emotion } = dataComent;

  return `<div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${getImgEmotion(emotion)}
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input ${getStatusRadioButton(emotion, EmotionType.SMILE)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input ${getStatusRadioButton(emotion, EmotionType.SLEEPING)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input ${getStatusRadioButton(emotion, EmotionType.PUKE)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input ${getStatusRadioButton(emotion, EmotionType.ANGRY)} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
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

  restoreHandlers() {
    this._setCommentHandlers();
    this._setCommentEmojiHandlers();
  }

  _setCommentHandlers() {
    this._commentInputElement.addEventListener('input', this._commentTextareaInputHandler);
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

    this._commentInputElement = this.getElement().querySelector('.film-details__comment-input');

    /** Возвращаем скролл textarea вниз */
    this._commentInputElement.scrollTop = this._commentInputElement.scrollHeight;

    this.restoreHandlers();
  }
}
