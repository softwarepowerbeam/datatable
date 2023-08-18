/**
 * Simple wrapper for jquery datatable
 *
 * @class DataTable
 * @typedef {DataTable}
 */
class DataTable {

    /**
     * Creates an instance of DataTable.
     *
     * @constructor
     * @param {Object} config
     */
    constructor(config) {

        //mandatory parameters initialization
        this.dataTableInstance = undefined;
        this.selector = config.selector;
        this.validateData(config.data);
        this.data = config.data;

        //optional parameters initialization
        this.html = '';
        this.columnsToShowInOrder = [];
        this.tableName = config.tableName === undefined ? this.generateRandomName() : config.tableName;
        this.errMode = 'none'; //show invasive alerts(error)
        this.pageLength = 25;
        this.hashTable = new Map();
        this.editor = undefined;
        this.showJsonInEditor = true;

        if (config.hasOwnProperty('errMode')) {
            this.errMode = config.errMode;
        }

        if (config.hasOwnProperty('showJsonInEditor')) {
            this.showJsonInEditor = config.showJsonInEditor;
        }

        if (config.hasOwnProperty('pageLength') && this.isIntegerInRange(config.pageLength, 1, 200)) {
            this.pageLength = config.pageLength;
        }

        this.columnsToShowInOrder = Object.keys(this.data[0]);
        if (config.hasOwnProperty('columnsToShowInOrder')) {
            this.columnsToShowInOrder = config.columnsToShowInOrder;        
        }

        this.generateDataTable();
    }

    /**
     * Validate if a value is in range
     *
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @returns {boolean}
     */
    isIntegerInRange(value, min, max) {
        return Number.isInteger(value) && value >= min && value <= max;
    }

    /**
     * Draw HTML datatable in DOM
     *
     * @param {String} htmlContent - generatedHTML
     */
    drawInDOM(htmlContent) {
        $(`#${this.selector}`).append(htmlContent);
        this.dataTableInstance = $(`#${this.tableName}`).DataTable({
            pageLength: this.pageLength
        });

        this.editor = new JSONEditor(document.getElementById("json-editor"), {});
        const self = this;

        $(`#${this.selector}`).on('click', '.btn-view-json', function () {
            const dataHashIndex = $(this).attr('data-hashIndex');
            let jsonData = self.hashTable.get(Number(dataHashIndex));
            self.editor.set(JSON.parse(jsonData));
            $('#myModal').modal('show');
        });
    }

    /**
     * Generate datatable html code
     */
    generateDataTable() {
        let table = `<table id="${this.tableName}" class="datatable table table-striped">`
        let thead = this.generateThead();
        let body = this.generateTableBody();
        let jsonModal = this.generateHtmlModal();
        this.html = `${table}${thead}${body}</table>${jsonModal}`;
        this.drawInDOM(this.html);
    }

    /**
     * Generate a random string name
     *
     * @returns {string}
     */
    generateRandomName() {
        const randomNumber = Math.floor(Math.random() * 10000);
        const formatedNumber = randomNumber.toString().padStart(4, '0');
        return `data-table-${formatedNumber}`;
    }

    /**
     * Validate if data is an array of objects
     *
     * @param {Array} data - array of objects to print in table
     */
    validateData(data) {
        if (!Array.isArray(data)) {
            throw ("the data need to be a array of objects");
        }

        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] !== 'object' || data[i] === null || Array.isArray(data[i])) {
                throw ("one of the elements is not a valid object");
            }
        }
    }

    /**
     * generate html code for tbody
     *
     * @returns {String}
     */
    generateTableBody() {
        let htmlBody = '<tbody>';
        for (let i = 0; i < this.data.length; i++) {

            htmlBody += '<tr>';
            const objectProperties = Object.keys(this.data[i]);
            for (let j = 0; j < objectProperties.length; j++) {
                if (this.columnsToShowInOrder.includes(objectProperties[j])) {
                    htmlBody += this.generateTdByDataType(this.data[i][objectProperties[j]]);
                }
            }
            htmlBody += '</tr>';
        }
        return htmlBody += '</tbody>';
    }

    /**
     * extract columns to show in the defined order
     *
     * @param {Array} columnsExtractedFromObject
     * @param {Array} columnsToShowInOrder
     * @returns {Array}
     */
    getFilteredColumnNames(columnsExtractedFromObject, columnsToShowInOrder) {

        const set1 = new Set(columnsExtractedFromObject);
        const set2 = new Set(columnsToShowInOrder);
        let filteredColumnNames = [];

        for (const element of set1) {
            if (set2.has(element)) {
                filteredColumnNames.push(element);
            }
        }

        filteredColumnNames = this.reorderArrayToMatchOrder(filteredColumnNames, columnsToShowInOrder);
        return filteredColumnNames;
    }

    /**
     * Order columns to defined
     *
     * @param {Array} arrayToReorder
     * @param {Array} referenceArray
     * @returns {Array}
     */
    reorderArrayToMatchOrder(arrayToReorder, referenceArray) {
        const reorderedArray = [];

        for (const element of referenceArray) {
            if (arrayToReorder.includes(element)) {
                reorderedArray.push(element);
            }
        }

        return reorderedArray;
    }

    /**
     * generate html code to thead
     *
     * @returns {String}
     */
    generateThead() {
        if (!Array.isArray(this.data) || this.data.length === 0) {
            throw new Error('Invalid data or empty data.');
        }

        let columns = this.getFilteredColumnNames(Object.keys(this.data[0]), this.columnsToShowInOrder);
        const htmlFormatedColumns = `<thead><tr>${columns.map(column => `<th>${column}</th>`).join('')}</tr></thead>`;
        return htmlFormatedColumns;
    }

    /**
     * Verify is data is an json-object
     *
     * @param {*} data
     * @returns {boolean}
     */
    isJSONObject(data) {
        if (typeof data !== 'object' || data === null) {
            return false;
        }

        if (data.constructor !== Object) {
            return false;
        }

        try {
            JSON.stringify(data);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verify if value is an image
     *
     * @param {String} data
     * @returns {boolean}
     */
    isImage(data) {
        const imageFormat = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
        return imageFormat.test(data);
    }

    /**
     * generate td html code
     *
     * @param {*} data
     * @returns {string}
     */
    generateTdByDataType(data) {
        let generatedHtml = '';
        if (this.isJSONObject(data)) {

            generatedHtml = `<td>${data ? JSON.stringify(data) : ''}</td>`;

            if (this.showJsonInEditor) {
                let index = (Number(this.hashTable.size) + 1);
                this.hashTable.set(index, JSON.stringify(data));
                generatedHtml = `<td><button class="btn btn-secondary btn-sm btn-view-json" data-hashindex='${index}'><i class="fas fa-eye"></i></button><td>`;
            }
        }
        else if (this.isImage(data)) {
            generatedHtml = `<td>${data ? `<img class="img-mini" src="${data}" alt="Image">` : ''}</td>`;
        }
        else {
            generatedHtml = `<td>${data || ''}</td>`;
        }
        if (generatedHtml === '') {
            throw ("data value is not valid");
        }
        return generatedHtml;
    }

    /**
     * generate default modal html code
     *
     * @returns {string}
     */
    generateHtmlModal() {
        return `<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Data viewer</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="json-editor"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

export default DataTable;