var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.ObjectId
;

module.exports = {
  schema: function(modeler){
    var schema = new mongoose.Schema({
      name: String, 
      description: String
    });
    
    return schema;
  },
  name: 'Toys',
  database: 'objects'
};