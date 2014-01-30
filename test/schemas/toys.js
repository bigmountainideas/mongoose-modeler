var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.ObjectId
;

module.exports = {
  schema: function(modeler, Schema){
    var schema = new Schema({
      name: String, 
      description: String
    });
    
    return schema;
  },
  name: 'Toys',
  database: 'objects'
};