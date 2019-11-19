import{VlElement,define}from"/node_modules/vl-ui-core/vl-core.js";import{html,render}from"/node_modules/lite-html/lite-html.js";export class VlPager extends VlElement(HTMLElement){static get _observedAttributes(){return["total-items","current-page","items-per-page"]}static get _observedChildClassAttributes(){return["align-center","align-right"]}get _classPrefix(){return"vl-pager--"}constructor(){super(`<style>
            @import "/node_modules/vl-ui-pager/style.css";
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
           </div>`)}connectedCallback(){if(!this._dressed){this.shadowRoot.querySelector("#pageBackLink").addEventListener("click",()=>{if(!(this.currentPage-1<=0)){this.setAttribute("current-page",this.currentPage-1)}});this.shadowRoot.querySelector("#pageForwardLink").addEventListener("click",()=>{if(!(this.currentPage+1>this.totalPages)){this.setAttribute("current-page",this.currentPage+1)}});this._dressed=true}}attributeChangedCallback(name,oldValue,newValue){super.attributeChangedCallback(name,oldValue,newValue);this._updateItemsInfo();this._updatePagination()}_items_per_pageChangedCallback(oldValue,newValue){}_total_itemsChangedCallback(oldValue,newValue){}_items_per_pageChangeCallback(oldValue,newValue){}_current_pageChangedCallback(oldValue,newValue){this.dispatchEvent(new CustomEvent("pagechanged",{detail:{oldPage:oldValue,newPage:newValue}}))}_updateItemsInfo(){this.shadowRoot.querySelector("#itemsOfCurrentPageInfo").innerHTML=`${this.firstItemNrOfPage}-${this.lastItemNrOfPage}`;this.shadowRoot.querySelector("#totalItems").innerHTML=this.totalItems;this.shadowRoot.querySelectorAll('[name="itemsPerPage"]').forEach(span=>{span.innerHTML=`${this.itemsPerPage} rijen`})}_updatePagination(){render(this._renderPageLinks(),this.shadowRoot.querySelector("pages-links"))}_renderPageLinks(){const pages=this._calculatePagination(this.currentPage,this.totalPages);return html`${pages.map(pageNr=>this._renderPageLink(pageNr))}`}_renderPageLink(number){if(number===this.currentPage){return html`<li name="pageLink" data-vl-pager-page=${number} class="vl-pager__element"> 
                  <label>${number}</label>
                </li>`}else if(number==="skipped"){return html`<li class="vl-pager__element"> 
                    <div class="vl-pager__element__cta">
                      ...
                    </div>
                  </li>`}else{return html`<li @click=${()=>{this.setAttribute("current-page",number)}} name="pageLink" data-vl-pager-page=${number} class="vl-pager__element"> 
                  <a href="javascript:void(null);" class="vl-pager__element__cta vl-link vl-link--bold">${number}</a>
                </li>`}}get totalPages(){return Math.ceil(this.totalItems/this.itemsPerPage)}get totalItems(){return parseInt(this.getAttribute("total-items"))}get currentPage(){return parseInt(this.getAttribute("current-page"))}get itemsPerPage(){return parseInt(this.getAttribute("items-per-page"))}get firstItemNrOfPage(){return(this.currentPage-1)*this.itemsPerPage+1}get lastItemNrOfPage(){const lastItemNr=this.firstItemNrOfPage+this.itemsPerPage-1;return lastItemNr>this.totalItems?this.totalItems:lastItemNr}_calculatePagination(c,m){var current=c,last=m,delta=1,left=current-delta,right=current+delta+1,range=[],rangeWithDots=[],l;for(let i=1;i<=last;i++){if(i==1||i==last||i>=left&&i<right){range.push(i)}}for(let i of range){if(l){if(i-l===2){rangeWithDots.push(l+1)}else if(i-l!==1){rangeWithDots.push("skipped")}}rangeWithDots.push(i);l=i}return rangeWithDots}};define("vl-pager",VlPager);