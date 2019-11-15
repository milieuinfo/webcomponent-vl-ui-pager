import {VlElement, define} from '/node_modules/vl-ui-core/vl-core.js';
import {html, render} from '/node_modules/lite-html/lite-html.js';

/**
 * VlPager
 * @class
 * @classdesc Gebruik de pager component om het aantal beschikbare pagina's weer te geven,
 * markeer de huidige pagina en voeg navigatie knoppen toe.
 *
 * @extends VlElement
 *
 * @property {number} total-items - Attribuut wordt gebruikt om totaal rijen te bepalen.
 * @property {number} current-page - Attribuut wordt gebruikt om huidige pagina te bepalen.
 * @property {number} items-per-page - Attribuut wordt gebruikt omm het aantal rijen per pagina te bepalen.
 *
 * @property {boolean} align-center
 * @property {boolean} align-right
 *
 * @event changed
 *
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-pager/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-pager/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-pager.html|Demo}
 *
 */
export class VlPager extends VlElement(HTMLElement) {
  static get _observedAttributes() {
    return ['total-items', 'current-page', 'items-per-page']
  }

  static get _observedChildClassAttributes() {
    return ['align-center','align-right'];
  }

  get _classPrefix() {
    return 'vl-pager--';
  }

  static get properties() {
    return {
      totalItems: {attribute: true},
    }
  }

  constructor() {
    super(`<style>
            @import "../style.css";
           </style>
           <div class="vl-pager">
            <ul class="vl-pager__list">
              <li class="vl-pager__element">
                <span class="vl-u-visually-hidden">Rij</span>
                <strong id="itemsOfCurrentPageInfo"></strong> van <span id="totalItems"></span>
              </li>
              <li class="vl-pager__element">
                <a id="pageBackLink" href="javascript:void(null);" class="vl-pager__element__cta vl-link vl-link--bold">
                <i class="vl-link__icon vl-link__icon--before vl-vi vl-vi-arrow-left-fat" aria-hidden="true"></i>
                  Vorige<span name="itemsPerPage" class="vl-u-visually-hidden"></span>
                </a>
              </li>
              <pages-links></pages-links>
              <li class="vl-pager__element">
                <a id="pageForwardLink" href="javascript:void(null);" class="vl-pager__element__cta vl-link vl-link--bold">Volgende
                <span name="itemsPerPage" class="vl-u-visually-hidden"></span>
                <i class="vl-link__icon vl-link__icon--after vl-vi vl-vi-arrow-right-fat" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
           </div>`);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#pageBackLink").addEventListener("click",
        () => {
          if (!(this.currentPage - 1 <= 0)) {
            this.setAttribute("current-page", this.currentPage - 1);
          }
        });
    this.shadowRoot.querySelector("#pageForwardLink").addEventListener("click",
        () => {
          if (!(this.currentPage + 1 > this.lastPage)) {
            this.setAttribute("current-page", this.currentPage + 1);
          }
        });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this._updateItemsInfo();
    this._updatePagination();
  }

  _current_pageChangedCallback(oldValue, newValue) {
    this.dispatchEvent(new CustomEvent('changed',
        {detail: {oldValue: oldValue, newValue: newValue}}));
  }

  _updateItemsInfo() {
    this.shadowRoot.querySelector(
        '#itemsOfCurrentPageInfo').innerHTML = `${this.firstItemNrOfPage}-${this.lastItemNrOfPage}`;
    this.shadowRoot.querySelector('#totalItems').innerHTML = this.totalItems;
    this.shadowRoot.querySelectorAll('[name="itemsPerPage"]').forEach(
        (span) => {
          span.innerHTML = `${this.itemsPerPage} rijen`
        });
  }

  _updatePagination() {
    render(this._renderPageLinks(),
        this.shadowRoot.querySelector("pages-links"));
  }

  _renderPageLinks() {
    let pages = this._calculatePagination(this.currentPage, this.lastPage);
    return html`${pages.map((pageNr) => this._renderPageLink(pageNr))}`;
  }

  _renderPageLink(number) {
    if (number === this.currentPage) {
      return html`<li name="pageLink" data-vl-pager-page=${number} class="vl-pager__element"> 
                  <a>${number}</a>
                </li>`;
    } else if (number === "cta") {
      return html`<li class="vl-pager__element"> 
                    <div class="vl-pager__element__cta">
                      ...
                    </div>
                  </li>`;
    } else {
      return html`<li @click=${() => {this.setAttribute('current-page',number)}} name="pageLink" data-vl-pager-page=${number} class="vl-pager__element"> 
                  <a href="javascript:void(null);" class="vl-pager__element__cta vl-link vl-link--bold">${number}</a>
                </li>`;
    }
  }

  /**
   *
   * @return {number}
   */
  get totalPages() {
    return this.totalItems / this.itemsPerPage + ((this.totalItems
        % this.itemsPerPage) > 0 ? 1 : 0);
  }

  /**
   *
   * @return {number}
   */

  get totalItems() {
    return parseInt(this.getAttribute('total-items'));
  }

  /**
   *
   * @return {number}
   */
  get currentPage() {
    return parseInt(this.getAttribute('current-page'));
  }

  /**
   *
   * @return {number}
   */
  get itemsPerPage() {
    return parseInt(this.getAttribute('items-per-page'));
  }

  /**
   *
   * @return {number}
   */
  get firstItemNrOfPage() {
    return (this.currentPage - 1) * this.itemsPerPage + 1
  }

  /**
   *
   * @return {number}
   */
  get lastItemNrOfPage() {
    let lastItemNr = this.firstItemNrOfPage + this.itemsPerPage - 1;
    return lastItemNr > this.totalItems ? this.totalItems : lastItemNr;
  }

  /**
   *
   * @return {number}
   */
  get lastPage() {
    return this.totalItems / this.itemsPerPage + (this.totalItems
    % this.itemsPerPage > 1 ? 1 : 0);
  }

  //https://gist.github.com/kottenator/9d936eb3e4e3c3e02598 TODO:vervangen door een dependency?
  _calculatePagination(c, m) {
    var current = c,
        last = m,
        delta = 1,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || i >= left && i < right) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('cta');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }
}

define('vl-pager', VlPager);
