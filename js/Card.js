//-----------------------------------------------------------------
// CARD CLASS
// ----------------------------------------------------------------

function Card(id, name) {
  var self = this; // for not losing context

// define card parameters  
  this.id = id;
  this.name = name || 'No name given';
  this.element = generateTemplate('card-template', { description: this.name }, 'li');

// add listener to the whole card
  this.element.querySelector('.card').addEventListener('click', function (event) {
    event.stopPropagation();

// only target is delete button - remove card
    if (event.target.classList.contains('btn-delete')) {
        // use method removeCard
        self.removeCard();
    }
  });
}

//-----------------------------------------------------------------
// CARD METHOD
// ----------------------------------------------------------------

Card.prototype = {

// method for removing card
  removeCard: function() {
    var self = this;  // for not losing context

    fetch(baseUrl + '/card/' + self.id, { method: 'DELETE', headers: myHeaders })
      
      // then what?
      .then(function(resp) {
        return resp.json();
      })
      
      .then(function(resp) {
        self.element.parentNode.removeChild(this.element);
      })
  }
}