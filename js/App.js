// API urls
const baseUrl = 'https://kodilla.com/pl/bootcamp-api';
const myHeaders = {
  'X-Client-Id': 3575,
  'X-Auth-Token': '16403045ea8cfafe532e2b1d7dbc399d'
};

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

// OGÓLNA FUNKCJA

function generateTemplate(name, data, basicElement) {
  	var template = document.getElementById(name).innerHTML;
  	var element = document.createElement(basicElement || 'div');
  
  	Mustache.parse(template);
  	element.innerHTML = Mustache.render(template, data);
  
  	return element;
}
