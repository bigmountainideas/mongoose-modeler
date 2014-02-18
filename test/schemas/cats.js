var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.ObjectId
;

module.exports = {
  schema: function(modeler){
    var schema = new mongoose.Schema({
      name : String,
      color: String,
      age: Number
    });

    schema
    .method({
  
      toJSON: function(){
        var obj = this.toObject();
        obj.id = obj._id;
        delete obj.__v;
        delete obj._id;
        return obj;
      }
    });
    
    return schema;
  },
  name: 'Cats',
  database: 'animals'
};