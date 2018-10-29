//-----------------------------------------------------------------
// BOARD
// ----------------------------------------------------------------

// DEFINE THE BOARD PLACE

const columnContainer = document.querySelector('#board .column-container');
const createColumnBtn = document.querySelector('#board .create-column');

var board = {
  name: 'Tablica Kanban',
  addColumn: function(column) {
    this.element.appendChild(column.element);
    initSortable(column.id); //About this feature we will tell later
  },
  element: columnContainer
};

// ADD LISTENER TO CREATE COLUMN BTN

createColumnBtn.addEventListener('click', function() {
  var name = prompt('Enter a column name');
  var data = new FormData();

  data.append('name', name);

  fetch(baseUrl + '/column', {
      method: 'POST',
      headers: myHeaders,
      body: data,
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      var column = new Column(resp.id, name);
      board.addColumn(column);
    });
});

// INIT SORTABLE

function initSortable(id) {
  var el = document.getElementById(id);
  var sortable = Sortable.create(el, {
    group: 'kanban',
    sort: true
  });
}