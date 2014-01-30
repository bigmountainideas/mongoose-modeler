var Definition = require('./definition')
  , Schema = require('mongoose').Schema
;


function Modeler( dbs){
  this.dbs = {};
  for( var i in dbs){
    this.dbs[ dbs[ i].name] = dbs[ i];
  }
  this.definitions = {};
};

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


Modeler.prototype.find = function(name, db, autoload){
  var dbo = this.dbs[ db], path = db+'.'+name, def;
  if( dbo.models[ name]){
    return dbo.models[ name];
  }else if( this.definitions[ path]&&autoload) {
    return this._load( this.definitions[ path]);
  }
};

Modeler.prototype._load = function(def){
  if( !def) return false;
  var db = this.dbs[ def.database];
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


Modeler.prototype._resolve = function( def, dbs){
  for( var i in def.dependencies){
    var dep = def.dependencies[i]
      , p = dep.split('.')
      , db = p[0] , name = p[1]
    ;
    if( !this.find( name, db)){
      this._load( this.definitions[ dep]);
    }
  }
};



module.exports = function(dbs, defs, autoload){
  
  var modeler = new Modeler( dbs);
  if( defs){
    modeler.populate( defs, autoload);
  }
  return modeler;
};

