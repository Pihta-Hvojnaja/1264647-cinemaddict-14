
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { createFilterItemTemplate, filterTimeInterval } from '../utils/filter.js';
import { getCountRuntimeFilms, getGenres } from '../utils/statistics.js';
import { ONE_HOUR, TypeInterval } from '../const.js';

import SmartView from './smart.js';

dayjs.extend(isBetween);

const BAR_HEIGHT = 50;

const createStatisticRank = (countWatchingFilms) => {
  return countWatchingFilms === 0 ? '' : `<p class="statistic__rank">
                                            Your rank
                                            <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
                                            <span class="statistic__rank-label">${createFilterItemTemplate(countWatchingFilms)}</span>
                                          </p>`;
};

const createTopGenre = (genres) => {
  if (genres.length === 0) {
    return '';
  }

  const nameTopGenre = genres[0].genreName;

  return `<h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${nameTopGenre}</p>`;
};

const renderStatisticsChart = (statisticCtx, genres) => {

  const genresNames = [];
  const countersGenres = [];

  genres.forEach((genre) => {
    genresNames.push(genre.genreName);
    countersGenres.push(genre.count);
  });

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresNames,
      datasets: [{
        data: countersGenres,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatisticsTemplate = (dataForTemplate) => {
  const { countWatchingFilms, typeInterval, dataFilms, genres } = dataForTemplate;
  const runtime = getCountRuntimeFilms(dataFilms);

  return `<section class="statistic">
            ${createStatisticRank(countWatchingFilms)}
            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>
              <input ${typeInterval === TypeInterval.ALL ? 'checked' : ''}  type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time">
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>
              <input ${typeInterval === TypeInterval.TODAY ? 'checked' : ''} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day">
              <label for="statistic-today" class="statistic__filters-label">Today</label>
              <input ${typeInterval === TypeInterval.WEEK ? 'checked' : ''} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
              <label for="statistic-week" class="statistic__filters-label">Week</label>
              <input ${typeInterval === TypeInterval.MONTH ? 'checked' : ''} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
              <label for="statistic-month" class="statistic__filters-label">Month</label>
              <input ${typeInterval === TypeInterval.YEAR ? 'checked' : ''} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
              <label for="statistic-year" class="statistic__filters-label">Year</label>
            </form>
            <ul class="statistic__text-list">
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${dataFilms.length} <span class="statistic__item-description">movies</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
                <p class="statistic__item-text">${Math.floor(runtime / ONE_HOUR)} <span class="statistic__item-description">h</span> ${runtime % ONE_HOUR} <span class="statistic__item-description">m</span></p>
              </li>
              <li class="statistic__text-item">
                ${createTopGenre(genres)}
              </li>
            </ul>
            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000"></canvas>
            </div>
          </section>`;
};

export default class Statistics extends SmartView {
  constructor(dataFilms, countWatchingFilms) {
    super();
    this._data = {
      dataFilms,
      dateFrom: (typeInterval) => {
        const interval = 1;
        const date = dayjs().subtract(interval, typeInterval);
        return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      },
      dateTo: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    };

    this._statisticsChart = null;

    this._countWatchingFilms = countWatchingFilms;
    this._typeInterval = TypeInterval.ALL;

    this._dataForTemplate = this._getDataTemplate();

    this._filterChangeHandlers = this._filterChangeHandlers.bind(this);
    this._setFilterHandlers();

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._dataForTemplate);
  }

  removeElement() {
    super.removeElement();

    if (this._statisticsChart !== null) {
      this._statisticsChart = null;
    }
  }

  restoreHandlers() {
    this._setFilterHandlers();
  }

  _getDataFilms() {
    switch (this._typeInterval) {
      case TypeInterval.ALL:
        return filterTimeInterval[TypeInterval.ALL](this._data);
      case TypeInterval.TODAY:
        return filterTimeInterval[TypeInterval.TODAY](this._data);
      case TypeInterval.WEEK:
        return filterTimeInterval[TypeInterval.WEEK](this._data);
      case TypeInterval.MONTH:
        return filterTimeInterval[TypeInterval.MONTH](this._data);
      case TypeInterval.YEAR:
        return filterTimeInterval[TypeInterval.YEAR](this._data);
    }
  }

  _getDataTemplate() {
    const dataFilms = this._getDataFilms();

    return {
      countWatchingFilms: this._countWatchingFilms,
      typeInterval: this._typeInterval,
      dataFilms: dataFilms,
      genres: getGenres(dataFilms),
    };
  }

  _setCharts() {
    const { genres } = this._getDataTemplate();
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    if (genres.length === 0) {
      return;
    }

    this._statisticsChart = renderStatisticsChart(statisticCtx, genres);
  }

  _setFilterHandlers() {
    this.getElement().querySelector('.statistic__filters')
      .addEventListener('change', this._filterChangeHandlers);
  }

  _filterChangeHandlers(evt) {
    evt.preventDefault();
    this._typeInterval = evt.target.value;
    this._dataForTemplate = this._getDataTemplate();
    this.updateElement();
    this._setCharts();
    this.restoreHandlers();
  }
}
