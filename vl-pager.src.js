import { VlElement, define } from '/node_modules/vl-ui-core/vl-core.js';

/**
 * VlPager
 * @class
 * @classdesc Gebruik de pager component om het aantal beschikbare pagina's weer te geven, markeer de huidige pagina en voeg navigatie knoppen toe.
 *
 * @extends VlElement
 *
 * @property {number} total-items - Attribuut wordt gebruikt om totaal van elementen te bepalen.
 * @property {number} current-page - Attribuut wordt gebruikt om huidige pagina te bepalen.
 * @property {number} items-per-page - Attribuut wordt gebruikt om het aantal rijen per pagina te bepalen.
 * @property {number} pagination-disabled - Attribuut wordt gebruikt om geen pagina links te tonen..
 * @property {boolean} align-center - Attribuut wordt gebruikt om de paginatie te centreren.
 * @property {boolean} align-right - Attribuut wordt gebruikt om de paginatie rechts uit te lijnen.
 *
 * @event pagechanged - Als de huidge pagina van nummer verandert.
 *
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-pager/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-pager/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-pager.html|Demo}
 *
 */
export class VlPager extends VlElement(HTMLElement) {
  static get _observedAttributes() {
    return ['total-items', 'items-per-page', 'current-page', 'pagination-disabled'];
  }

  static get _observedChildClassAttributes() {
    return ['align-center', 'align-right'];
  }

  constructor() {
    super();
    this._shadow(`
      <style>
        @import "../style.css";
      </style>
      <div class="vl-pager">
        <ul class="vl-pager__list">
          <li id="bounds" class="vl-pager__element"></li>
          <li id="page-back-list-item" class="vl-pager__element">
            <a id="page-back-link" class="vl-pager__element__cta vl-link vl-link--bold">
              <i class="vl-link__icon vl-link__icon--before vl-vi vl-vi-arrow-left-fat" aria-hidden="true"></i>
              Vorige <span id="previous-items-per-page" class="vl-u-visually-hidden"></span>
            </a>
          </li>
          <li id="page-forward-list-item" class="vl-pager__element">
            <a id="page-forward-link" class="vl-pager__element__cta vl-link vl-link--bold">
              Volgende <span id="next-items-per-page" class="vl-u-visually-hidden"></span>
              <i class="vl-link__icon vl-link__icon--after vl-vi vl-vi-arrow-right-fat" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </div>
    `);

    this.__addPageBackLinkListener();
    this.__addPageForwardLinkListener();
  }

  get _classPrefix() {
    return 'vl-pager--';
  }

  /**
   * Geeft het aantal pagina's terug.
   * 
   * @returns {Number} Aantal pagina's.
   */
  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  /**
   * Geeft het totaal aantal items terug.
   * 
   * @returns {Number} Totaal aantal items.
   */
  get totalItems() {
    return parseInt(this.getAttribute('total-items'));
  }

  /**
   * Geeft het huidige pagina nummer terug.
   * 
   * @returns {Number} Huidig pagina nummer.
   */
  get currentPage() {
    let currentPage = parseInt(this.getAttribute('current-page'));
    if (currentPage < 1) {
      return 1;
    } else {
      return currentPage <= this.totalPages ? currentPage : this.totalPages;
    }
  }

  /**
   * Geeft het aantal items per pagina terug.
   * 
   * @returns {Number} Aantal items per pagina.
   */
  get itemsPerPage() {
    return parseInt(this.getAttribute('items-per-page'));
  }

  get _firstItemNumberOfPage() {
    if (!this.totalItems) {
      return 0;
    } else {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    }
  }

  get _lastItemNumberOfPage() {
    const lastItemNumber = this._firstItemNumberOfPage + this.itemsPerPage - 1;
    return lastItemNumber > this.totalItems ? this.totalItems : lastItemNumber;
  }

  get _isPagination() {
    return this.getAttribute('pagination-disabled') == undefined;
  }

  get _boundsElement() {
    return this.shadowRoot.querySelector('#bounds');
  }

  get _pagesListElement() {
    return this.shadowRoot.querySelector('.vl-pager__list');
  }

  get _pagesElement() {
    return this.shadowRoot.querySelector('#pages');
  }

  get _pageBackLink() {
    return this.shadowRoot.querySelector('#page-back-link');
  }

  get _pageForwardLink() {
    return this.shadowRoot.querySelector('#page-forward-link');
  }

  get _pageBackListItem() {
    return this.shadowRoot.querySelector("#page-back-list-item");
  }

  get _pageForwardListItem() {
    return this.shadowRoot.querySelector("#page-forward-list-item");
  }

  get _totalItemsElement() {
    return this.shadowRoot.querySelector('#totalItems');
  }

  get _itemsPerPageElementen() {
    const previous = this.shadowRoot.querySelector('#previous-items-per-page');
    const next = this.shadowRoot.querySelector('#next-items-per-page');
    return [previous, next];
  }

  _getBoundsTemplate() {
    return `
      <span class="vl-u-visually-hidden">Rij</span>
      <strong>${this._firstItemNumberOfPage}-${this._lastItemNumberOfPage}</strong> van ${this.totalItems}
    `;
  }

  _getPageTemplate(number) {
    if (this._isPagination) {
      if (number === this.currentPage) {
        return this.__getActivePageTemplate(number);
      } else if (number === 'skipped') {
        return this.__getSkippedPageTemplate();
      } else {
        return this.__getPageTemplate(number);
      }
    } else {
      return ``;
    }
  }

  __getActivePageTemplate(number) {
    return this._template(`
      <li name="pageLink" data-vl-pager-page=${number} class="vl-pager__element"> 
        <label>${number}</label>
      </li>
    `);
  }

  __getSkippedPageTemplate() {
    return this._template(`
      <li class="vl-pager__element">
        <div class="vl-pager__element__cta">...</div>
      </li>
    `);
  }

  __getPagesTemplate() {
    return this._template(`
      <li id="pages" class="vl-pager__element"></li>
    `);
  }

  __getPageTemplate(number) {
    const template = this._template(`
      <li name="pageLink" data-vl-pager-page=${number} class="vl-pager__element"> 
        <a class="vl-pager__element__cta vl-link vl-link--bold">${number}</a>
      </li>
    `);
    template.firstElementChild.addEventListener('click', () => this.setAttribute('current-page', number));
    return template;
  }

  _getItemsPerPageContentTemplate() {
    return `${this.itemsPerPage} rijen`;
  }

  _items_per_pageChangedCallback(oldValue, newValue) {
    this._update();
  };

  _total_itemsChangedCallback(oldValue, newValue) {
    if (this.totalItems === 0) {
      this._hide(this._element);
    } else {
      this._show(this._element);
      this._update();
    }
  }

  _current_pageChangedCallback(oldValue, newValue) {
    this._update();
  }

  _pagination_disabledChangedCallback(oldValue, newValue) {
    if (newValue !== undefined && this._pagesElement) {
      this._pagesElement.remove();
    } else {
      this._pagesListElement.insertBefore(this.__getPagesTemplate(), this._pageForwardListItem);
    }
  }

  _hide(element) {
    element.hidden = true;
  }

  _show(element) {
    element.hidden = false;
  }

  _update() {
    this._updateInfoElement();
    this._updatePagination();
    this._updateListItems();
  }

  _updateInfoElement() {
    this._boundsElement.innerHTML = this._getBoundsTemplate();
    this._itemsPerPageElementen.forEach((span) => {
      span.innerHTML = this._getItemsPerPageContentTemplate();
    });
  }

  _updatePagination() {
    if (this._isPagination) {
      if (!this._pagesElement) {
        this._pagesListElement.insertBefore(this.__getPagesTemplate(), this._pageForwardListItem);
      }

      this._pagesElement.innerHTML = '';
      if (this.totalPages > 1) {
        const pages = this.__generatePagination(this.currentPage, this.totalPages);
        const content = pages.map((number) => this._getPageTemplate(number));
        this._pagesElement.append(...content);
      }
    }
  }

  _updateListItems() {
    this.currentPage <= 1 ? this._hide(this._pageBackListItem) : this._show(this._pageBackListItem);
    this.currentPage >= this.totalPages ? this._hide(this._pageForwardListItem) : this._show(this._pageForwardListItem);
  }

  __generatePagination(currentPage, pageCount) {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) {
      range.unshift("skipped");
    }
    if (currentPage + delta < pageCount - 1) {
      range.push("skipped");
    }
    range.unshift(1);
    range.push(pageCount);
    return range;
  }

  __addPageBackLinkListener() {
    this._pageBackLink.addEventListener("click", () => {
      if (!(this.currentPage - 1 <= 0)) {
        this.setAttribute("current-page", this.currentPage - 1);
      }
    });
  }

  __addPageForwardLinkListener() {
    this._pageForwardLink.addEventListener("click", () => {
      if (!(this.currentPage + 1 > this.totalPages)) {
        this.setAttribute("current-page", this.currentPage + 1);
      }
    });
  }
}

define('vl-pager', VlPager);
