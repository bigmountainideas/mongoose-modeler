/*!
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;


/**
 * Definition constructor
 *
 * @param {String} name
 * @param {Object|mongoose.Schema|Function} schema
 * @param {String} database
 * @param {Array} deps dependencies
 * @api public
 */
function Definition(name, schema, database, deps){
  
  this.dependencies = deps || [];
  this.database     = database || mongoose;
  this.name         = name;
  this.path         = this.database+'.'+this.name;
  this.loaded       = false;
  
  if( schema instanceof Schema ){
    this.schema = schema;
  }else if( typeof schema == 'function') {
    this.schemaConstructor = schema;
  }else {
    this.schema = new Schema(schema);
  }
};



/**
 * List of dependencies for the Schema.
 *
 * @api public
 * @property dependencies
 */
Definition.prototype.dependencies;


/**
 * Name of the database to create the Model on.
 *
 * @api public
 * @property database
 */
Definition.prototype.database;


/**
 * Model name.
 *
 * @api public
 * @property name
 */
Definition.prototype.name;


/**
 * Unique path to find Model definition.
 *
 * @api public
 * @property path
 */
Definition.prototype.path;


/**
 * Flag to determine if the Model has already been created from the Schema.
 *
 * @api public
 * @property loaded
 */
Definition.prototype.loaded;


/**
 * Reference to the Schema or callback used to create the Model.
 *
 * @api public
 * @property schema
 */
Definition.prototype.schema;


/**
 * Checks if Schema defines any dependencies.
 *
 * @return {Boolean}
 * @api public
 * @method hasDependencies
 * @memberOf Definition
 */
Definition.prototype.hasDependencies = function(){
  return this.dependencies.length>0;
};

/**
 * Executes the callback passed into the constructor as the schema param.
 *
 * When a `Function` is passed instead of an `Object` or `Schema`, and 
 * internal callback gets set to execute the callback which is expected
 * to return a mongoose.Schema instance.
 *
 * @return {mongoose.Schema}
 * @api public
 * @method create
 * @memberOf Definition
 */
Definition.prototype.create = function(modeler){
  if( this.schemaConstructor){
    this.schema = this.schemaConstructor( modeler);
    return this.schema;
  }
};



/*!
 * Module exports.
 */
module.exports = Definition;

