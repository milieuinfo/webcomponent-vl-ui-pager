const { VlElement } = require('vl-ui-core');
const { By } = require('selenium-webdriver');

class VlPager extends VlElement {  

    async _getPagerList() {
        return this.shadowRoot.findElement(By.css('#pager-list'));
    }

    async _getBounds() {
        const pagerList = await this._getPagerList();
        return pagerList.findElement(By.css('#bounds'));
    }

    async _getPages() {
        const pagerList = await this._getPagerList();
        return pagerList.findElement(By.css('#pages'));
    }

    async _pageNumberIsDisplayed(number) {
        const pages = await this._getPages();
        const pageNumberElements = await pages.findElements(By.css('li'));
        const displayedNumbers = await Promise.all(pageNumberElements.map(e => e.getText()))
        return displayedNumbers.includes(number);
    }

    async _navigateUntilPagenumberIsClickable(pageNumber) {
        if(await this._pageNumberIsDisplayed(pageNumber)) {
            return Promise.resolve();
        } else {
            await this.volgende()
            return this._navigateUntilPagenumberIsClickable(pageNumber);
        }
    }

    async _getTagName(element) {
        return this.driver.executeScript('return arguments[0].children[0].tagName', element);
    }
  
    async _boundsText() {
        const bounds = await this._getBounds();
        return bounds.getText();
    }

    async _pageForwardLink() {
        const pagerList = await this._getPagerList();
        return pagerList.findElement(By.css('#page-forward-list-item'));
    }

    async _pageBackLink() {
        const pagerList = await this._getPagerList();
        return pagerList.findElement(By.css('#page-back-list-item'));
    }

    // State resetten voor testen, puur voor leesbaarheid
    async reset() {
        return this.goToFirstPage();
    }

    async getTotalResults() {
        const text = await this._boundsText();
        return text.split(" ")[2];
    }

    async getTotalOfDisplayedResults() {
        const text = await this._boundsText();
        const bounds = text.split(" ")[0];
        return bounds.split("-")[1];
    }

    async volgende() {
        const volgendeLink = await this._pageForwardLink();
        return volgendeLink.click();
    }

    async vorige() {
        const vorigeLink = await this._pageBackLink();
        return vorigeLink.click();
    }

    async getCurrentPageNumber() {
        const pages = await this._getPages();
        const label = await pages.findElement(By.css('label'));
        return label.getText();
    }

    async goToFirstPage() {
        const pages = await this._getPages();
        const firstPage = await pages.findElement(By.css('li[data-vl-pager-page="1"]'))
        const tagName = await this._getTagName(firstPage);
        if(tagName == "LABEL") {
            console.log("Already on first page, doing nothing.");
            return Promise.resolve();
        } else {
            return firstPage.click();
        }
    }

    async goToLastPage() {
        const pages = await this._getPages();
        const allPages = await pages.findElements(By.css('li'));
        const lastPage = allPages[allPages.length - 1];
        const tagName = await this._getTagName(lastPage);
        if(tagName == "LABEL") {
            console.log("Already on last page, doing nothing.");
            return Promise.resolve();
        } else {
            return lastPage.click();
        }
    }

    async goToPage(pageNumber) {
        await this._navigateUntilPagenumberIsClickable(pageNumber);
        const pages = await this._getPages();
        const page = await pages.findElement(By.css('li[data-vl-pager-page="' + pageNumber + '"]'));
        return page.click();
    }
}

module.exports = VlPager;
