# Datatable

powerbeam/datatable is a jquery datatable wrapper that includes json-viewer and image-viewer functionalities.

## Dependencies
**powerbeam/datatable needs this libraries to work correctly:**

1. jquery.
2. json-editor.
3. jquery-datatable.
4. bootstrap.


***libraries resources***
- https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
- https://cdn.jsdelivr.net/npm/datatables@1.10.18/media/js/jquery.dataTables.min.js
- https://cdn.jsdelivr.net/npm/datatables@1.10.18/media/css/jquery.dataTables.min.css
- https://cdn.jsdelivr.net/npm/json-editor@0.7.28/dist/jsoneditor.min.js
- https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css
- https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js


## How to use Datatable.

Add the css styles to you html file
1. https://cdn.jsdelivr.net/gh/softwarepowerbeam/datatable/style.css

```js
import DataTable from 'https://cdn.jsdelivr.net/gh/softwarepowerbeam/datatable/datatable.js'

document.addEventListener('DOMContentLoaded', function () {
    console.log("ready!");
    const dataTableConfig = {
        data: //data to print in the table
        [
            { id: 1, name: 'John', age: 30, lastname: 'Doe', email: "zaha@rac.al" },
            { id: 2, name: 'Jane', age: 25, lastname: 'Smith', email: "asofme@vakror.ru" }
        ],
        selector: "dataTableContainer", //selector where the table will be printed
        tableName: "mydatatable", //html table id
        columnsToShowInOrder: ['id', 'name', 'lastname', 'age'], //columns to show in order
        pageLength: 100, //number of results show per page
        showJsonInEditor: false //show json values in json-editor modal
    };

    const dataTable = new DataTable(dataTableConfig);
});
```
## List of parameters.

| Parameter         | Description                              | Type             | Required |
| :---------------- | :------:                                 | :------:         | ----: |
| data              | data to print in table                   | array of objects | true |
| selector          | selector where the table will be printed | string           | true |
| tableName         | html id assigned to generated table      | string           | false |
| columnsToShowInOrder | columns to print in table in an specific order | array   | false |
| pageLength        | number of results show per page          | number           | false |
| showJsonInEditor  | use json-editor viewer functionalities   | boolean          | false |

