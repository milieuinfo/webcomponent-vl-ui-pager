const { VlElement } = require('vl-ui-core');

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

    async _getPageForwardLink() {
        const pagerList = await this._getPagerList();
        return pagerList.findElement(By.css('#page-forward-list-item'));
    }

    async _getPageBackLink() {
        const pagerList = await this._getPagerList();
        return pagerList.findElement(By.css('#page-back-list-item'));
    }

    async _getTagName(element) {
        return this.driver.executeScript('return arguments[0].children[0].tagName', firstPage);
    }

    async getNumberOfPages() {
        const bounds = await this._getBounds();
        const text = await bounds.getText();
        return text.split(" ")[2];
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
        
    }
}

module.exports = VlPager;
