var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;


function Definition(name, schema, database, deps){
  
  this.dependencies = deps || [];
  
  this.database   = database || mongoose;
  
  this.name  = name;
  
  this.path = this.database+'.'+this.name;
  
  this.loaded = false;
  
  if( schema instanceof Schema ){
    this.schema = schema;
  }else if( typeof schema == 'function') {
    this.schemaConstructor = schema;
  }else {
    this.schema = new Schema(schema);
  }
};


Definition.prototype.hasDependencies = function(){
  return this.dependencies.length>0;
};

Definition.prototype.create = function(modeler){
  if( this.schemaConstructor){
    this.schema = this.schemaConstructor( modeler, Schema);
    return this.schema;
  }
};



module.exports = Definition;

