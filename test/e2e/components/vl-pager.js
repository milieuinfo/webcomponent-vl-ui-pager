const {VlElement} = require('vl-ui-core').Test;
const {By} = require('vl-ui-core').Test.Setup;

class VlPager extends VlElement {
  async isAlignedCenter() {
    return this.hasAttribute('align-center');
  }

  async isAlignedRight() {
    return this.hasAttribute('align-right');
  }

  async isAlignedLeft() {
    const isAlignedCenter = await this.isAlignedCenter();
    const isAlignedRight = await this.isAlignedRight();
    return ! isAlignedCenter && ! isAlignedRight;
  }

  async isPaginationDisabled() {
    return this.hasAttribute('pagination-disabled');
  }

  async getTotalItems() {
    const bounds = await this._getBounds();
    return bounds.totalItems;
  }

  async _getBounds() {
    const bounds = await this.shadowRoot.findElement(By.css('#bounds'));
    const text = await bounds.getText();
    const regExp = /(\d+)-(\d+) van (\d+)/;
    const result = regExp.exec(text);
    return {
      minimum: result[1],
      maximum: result[2],
      totalItems: result[3],
    };
  }

  async getCurrentPage() {
    const label = await this.shadowRoot.findElement(By.css('#pages li label'));
    return label.getText();
  }

  async getItemsPerPage() {
    const range = await this.getRange();
    return range.maximum - range.minimum + 1;
  }

  async getRange() {
    const bounds = await this._getBounds();
    return {
      minimum: bounds.minimum,
      maximum: bounds.maximum,
    };
  }

  async goToNextPage() {
    const volgendeLink = await this._pageForwardLink();
    return volgendeLink.click();
  }

  async goToPreviousPage() {
    const vorigeLink = await this._pageBackLink();
    return vorigeLink.click();
  }

  async goToFirstPage() {
    if (await this.getCurrentPage() != 1) {
      const allVisiblePages = await this._getAllVisiblePageLinks();
      return allVisiblePages[0].click();
    }
  }

  async goToLastPage() {
    const numberOfPages = Math.ceil(await this.getItemsPerPage() / await this.getTotalItems());
    if (await this.getCurrentPage != numberOfPages) {
      const allVisiblePages = await this._getAllVisiblePageNumbers();
      const lastPage = allVisiblePages[allVisiblePages.length - 1];
      return lastPage.click();
    }
  }

  async goToPage(pageNumber) {
    await this._navigateUntilPagenumberIsVisible(pageNumber);
    const page = await this.shadowRoot.findElement(By.css('li[data-vl-pager-page="' + pageNumber + '"] a'));
    return page.click();
  }

  async isPageBackDisplayed() {
    return (await this._pageBackLink()).isDisplayed();
  }

  async isPageNextDisplayed() {
    return (await this._pageForwardLink()).isDisplayed();
  }

  async _navigateUntilPagenumberIsVisible(pageNumber) {
    if (! await this._isPageNumberVisible(pageNumber)) {
      await this.goToNextPage();
      return this._navigateUntilPagenumberIsVisible(pageNumber);
    }
  }

  async _isPageNumberVisible(pageNumber) {
    const visiblePageLinks = await this._getAllVisiblePageLinks();
    for (const visiblePageLink of visiblePageLinks) {
      const visiblePageNumber = await visiblePageLink.getText();
      if (visiblePageNumber == pageNumber) {
        return true;
      }
    }
    return false;
  }

  async _getAllVisiblePageLinks() {
    return this.shadowRoot.findElements(By.css('#pages li a'));
  }

  async _getAllVisiblePageNumbers() {
    return this.shadowRoot.findElements(By.css('#pages li'));
  }

  async _pageForwardLink() {
    return this.shadowRoot.findElement(By.css('#page-forward-link'));
  }

  async _pageBackLink() {
    return this.shadowRoot.findElement(By.css('#page-back-link'));
  }

  // State resetten voor testen, puur voor leesbaarheid
  async reset() {
    return this.goToFirstPage();
  }
}

module.exports = VlPager;
