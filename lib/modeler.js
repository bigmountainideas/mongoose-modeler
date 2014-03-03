/*!
 * Module dependencies.
 */
var Definition = require('./definition')
  , Schema = require('mongoose').Schema
;


/**
 * Modeler constructor
 *
 * @param {Array} dbs
 * @api public
 */
function Modeler( dbs){
  this.dbs = {};
  for( var i in dbs){
    this.dbs[ dbs[ i].name] = dbs[ i];
  }
  this.definitions = {};
};


/**
 * Populate list of Mongoose Models from Schemas and
 * register them with the defined database connections.
 *
 * @param {Array} defs
 * @param {Boolean} [autoload]
 * @api public
 * @method populate
 * @memberOf Modeler
 */
Modeler.prototype.populate = function(defs, autoload){
  var def, d, i;
  for( i in defs){
    def = defs[ i];
    if( !this.definitions[ def.path]){
      d = new Definition(
                  def.name, 
                  def.schema, 
                  def.database, 
                  def.dependencies 
                );
      this.definitions[ d.path] = d;
    }
  }
  if( autoload){
    for( i in this.definitions){
      this._load( this.definitions[ i]);
    }
  }
};

/**
 * Retrieve a specific Model instance from a database connection.
 *
 * @param {String} name Model name
 * @param {String} db database anme
 * @param {Boolean} [autoload]
 * @return {Boolean|mongoose.Model}
 * @api public
 * @method find
 * @memberOf Modeler
 */
Modeler.prototype.find = function(name, db, autoload){
  if( !name||!db) throw new Error('Missing parameter(s).');
  var dbo = this.dbs[ db], path = db+'.'+name, def;
  if( dbo){
    if( dbo.models[ name]){
      return dbo.models[ name];
    }else if( this.definitions[ path]&&autoload) {
      return this._load( this.definitions[ path]);
    }
  }else if( autoload){
    throw new Error('Database ['+db+'] is not connected or defined. Requested by Model ['+name+']');
  }
  return false;
};


/**
 * Retrieve a specific Model instance from a database connection.
 *
 * @param {String} name Model name
 * @param {String} db database anme
 * @param {Boolean} [autoload]
 * @return {Boolean|mongoose.Model}
 * @api public
 * @method find
 * @memberOf Modeler
 */
Modeler.prototype.require = function(name, db){
  if( !name||!db) throw new Error('Missing parameter(s).');
  return this.find(name, db, true);
};


/**
 * Retrieve a specific Model instance from a database connection.
 *
 * @param {Definition} def Schema Definition
 * @api private
 * @method _load
 * @memberOf Modeler
 */
Modeler.prototype._load = function(def){
  if( !def) return false;
  var db = this.dbs[ def.database];
  if( !db) throw new Error('Database ['+def.database+'] is not connected or defined. Requested by Model ['+def.name+']');
  if( !this.find( def.name, def.database)){
    if( def.hasDependencies()){
      this._resolve( def);
    }
    if( !def.schema){
      def.create( this);
    }
    if( def.schema instanceof Schema){
      db.model( def.name, def.schema);
    }else {
      throw new Error('Undefined or Invalid Schema object for ['+def.name+']');
    }
  }
  return db.models[ def.name];
};


/**
 * Resolve Model dependencies.
 *
 * @param {Definition} def Schema Definition
 * @api private
 * @method _resolve
 * @memberOf Modeler
 */
Modeler.prototype._resolve = function( def){
  for( var i in def.dependencies){
    var dep = def.dependencies[i]
      , p = dep.split('.')
      , db = p[0] , name = p[1]
    ;
    if( !this.find( name, db)){
      if( !this._load( this.definitions[ dep])){
        throw new Error('Unable to resolve dependency ['+dep+'] for ['+def.path+']. Most libekly the dependency was not registered with mongoose-modeler.');
      }
    }
  }
};




/*!
 * Module exports.
 */


/**
 * Factory method for creating Modeler instances.
 *
 * @param {Array} dbs Mongoose Database connections
 * @param {Array} degs Schema Definitions
 * @param {Boolean} [autoload]
 * @api public
 */
module.exports = function(dbs, defs, autoload){
  
  var modeler = new Modeler( dbs);
  if( defs){
    modeler.populate( defs, autoload);
  }
  return modeler;
};



/**
 * Modeler export
 */
module.exports.Modeler = Modeler;


/**
 * Definition export
 */
module.exports.Definition = Definition;