var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.ObjectId
;

module.exports = {
  dependencies: [
    'objects.Toys'
  ],
  schema: function(modeler){
    
    var Toys = modeler.find('Toys', 'objects');
    
    var schema = new mongoose.Schema({
      name: String,
      owner: {
        type: ObjectId,
        ref: 'Toys'
      },
      age: Number
    });
    
    return schema;
  },
  name: 'Dogs',
  database: 'animals'
};
