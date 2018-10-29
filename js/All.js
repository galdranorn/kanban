// API urls
const baseUrl = 'https://kodilla.com/pl/bootcamp-api';
const myHeaders = {
  'X-Client-Id': 3575,
  'X-Auth-Token': '16403045ea8cfafe532e2b1d7dbc399d'
};

//-----------------------------------------------------------------
// APP
// ----------------------------------------------------------------

// ASK SERVER ABOUT ARRAY CONTENT
fetch(baseUrl + '/board', { headers: myHeaders })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(resp) {
    setupColumns(resp.columns);
  });

// FUNCTION FOR CREATING COLUMN
function setupColumns(columns) {
	columns.forEach(function(column) {
		var col = new Column(column.id, column.name);
		board.addColumn(col);
		setupCards(col, column.cards);
	});
  }

//  FUNCTION FOR CREATING CARDS
function setupCards(col, cards) {
	cards.forEach(function (card) {
    var cardObj = new Card(card.id, card.name);
    col.addCard(cardObj);
	});
}

// GENERATING OBJECTS WITH MUSTACHE TEMPLATES

function generateTemplate(name, data, basicElement) {
  	var template = document.getElementById(name).innerHTML;
  	var element = document.createElement(basicElement || 'div');
  
  	Mustache.parse(template);
  	element.innerHTML = Mustache.render(template, data);
  
  	return element;
}

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

//-----------------------------------------------------------------
// CARD
// ----------------------------------------------------------------

// KLASA KANBAN CARD
function Card(id, name) {
  var self = this;

  this.id = id;
  this.name = name || 'No name given';
  this.element = generateTemplate('card-template', { description: this.name }, 'li');

  this.element.querySelector('.card').addEventListener('click', function (event) {
    event.stopPropagation();

    if (event.target.classList.contains('btn-delete')) {
        self.removeCard();
    }
  });
}


Card.prototype = {
  removeCard: function() {
    var self = this;
  
    fetch(baseUrl + '/card/' + self.id, { method: 'DELETE', headers: myHeaders })
      .then(function(resp) {
        return resp.json();
      })
      .then(function(resp) {
        self.element.parentNode.removeChild(this.element);
      })
  }
}

//-----------------------------------------------------------------
// COLUMN
// ----------------------------------------------------------------

function Column(id, name) {
  var self = this;

  this.id = id;
  this.name = name || 'No name given';
  this.element = generateTemplate('column-template', { name: this.name, id: this.id });

  this.element.querySelector('.column').addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-delete')) {
        self.removeColumn();
    }

    if (event.target.classList.contains('add-card')) {
      var cardName = prompt("Enter the name of the card");
      var data = new FormData();
      event.preventDefault();

      var data = new FormData();
      data.append('name', cardName);
      data.append('bootcamp_kanban_column_id', self.id);

      fetch(baseUrl + '/card', {
        method: 'POST',
        headers: myHeaders,
        body: data
      })
      .then(function(res) {
        return res.json();
      })
      .then(function() {
       //
      });

      self.addCard(new Card(id, cardName));
    }
});
}

Column.prototype = {
addCard: function(card) {
  this.element.querySelector('ul').appendChild(card.element);
},
removeColumn: function() {
  var self = this;
  fetch(baseUrl + '/column/' + self.id, { method: 'DELETE', headers: myHeaders })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(self.element);
    });
}
};