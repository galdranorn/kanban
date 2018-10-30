//-----------------------------------------------------------------
// COLUMN CLASS
// ----------------------------------------------------------------

function Column(id, name) {
  var self = this; // for not losing context

// define column parameters
  this.id = id;
  this.name = name || 'No name given';
  this.element = generateTemplate('column-template', { name: this.name, id: this.id });
  this.element.classList.add('columnBox');

// add listener to the whole column
  this.element.querySelector('.column').addEventListener('click', function (event) {
    
    // if target is delete button - remove column
    if (event.target.classList.contains('btn-delete')) {
        // use method removeColumn
        self.removeColumn();
    }

    // if target is add card button
    if (event.target.classList.contains('add-card')) {

      // show the prompt - define cardName
      var cardName = prompt("Enter the name of the card");
      event.preventDefault();

      // create FormData with key/value pairs to send
      var data = new FormData();
      data.append('name', cardName);
      data.append('bootcamp_kanban_column_id', self.id);

      // fetch to API url
      fetch(baseUrl + '/card', {
        method: 'POST',
        headers: myHeaders,
        body: data
      })
      // then what?
      .then(function(res) {
        return res.json();
      })
      .then(function() {
       //
      });

      // use method addCard
      self.addCard(new Card(id, cardName));
    }
});
}

//-----------------------------------------------------------------
// COLUMN METHOD
// ----------------------------------------------------------------

Column.prototype = {

// method for adding card
addCard: function(card) {
  this.element.querySelector('ul').appendChild(card.element);
},
// method for removing column
removeColumn: function() {
  var self = this;  // for not losing context
  fetch(baseUrl + '/column/' + self.id, { method: 'DELETE', headers: myHeaders })
    // then what?
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(self.element);
    });
}
};