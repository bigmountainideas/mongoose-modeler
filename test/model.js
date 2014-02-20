var modeler = require('../')
  , mongoose = require('mongoose')
;

describe('Modeler', function(){
  
  var animals_db, objects_db;
  
  beforeEach(function(done){
    
    var db1 = mongoose.createConnection('mongodb://localhost/animals')
      , db2 = mongoose.createConnection('mongodb://localhost/objects')
    ;
    
    db1.once('open', function(){
      animals_db = this;
      if( objects_db) done()
    });
    
    db2.once('open', function(){
      objects_db = this;
      if( animals_db) done()
    });
    
  })
  afterEach(function(done){
    animals_db = objects_db = null; done();
  })
  
  it('should create istance of Modeler', function(done){
    
    var models = modeler( [
      animals_db,
      objects_db
    ])
    
    
    done()
  })
  
  it('should load models', function(done){
    
    var models = modeler( [
      animals_db,
      objects_db
    ],[
        require('./schemas/cats'),
        require('./schemas/dogs'),
        require('./schemas/toys')
      ], true)
    
      models.definitions
      .should.have.keys(
        'animals.Cats', 
        'animals.Dogs',
        'objects.Toys'
      )
    
    done()
    
  })
  
  it('should return Cats model', function(done){
    
    var models = modeler( [
      animals_db],[
        require('./schemas/cats')
      ], true);
    
      models.find('Cats', 'animals').should.be.ok;
      done()
  })
  
  
  it('should load Dogs and Toys model on demand', function(done){
    
    var models = modeler( [
      animals_db,
      objects_db
    ],[
        require('./schemas/dogs'),
        require('./schemas/toys')
      ]);
      
      models.find('Dogs',  'animals', true).should.be.ok;
      models.find('Toys',  'objects').should.be.ok;
      
      done()
  })
  
  it('should throw error when database for Schema not defined', function(done){
    
    var models = modeler( [
      animals_db
    ],[
        require('./schemas/toys')
      ]);
      
      (function(){
        models.require('Toys',  'objects');
      }).should.throw(/Database connection \[objects\] has not been defined./i);
      
      done()
  })
  
  it('should autoload Models with require', function(done){
    
    var models = modeler( [
      animals_db,
      objects_db
    ],[
        require('./schemas/dogs'),
        require('./schemas/toys')
      ]);
      
      models.require('Dogs',  'animals').should.be.ok;
      models.find('Toys',  'objects').should.be.ok;
      
      done()
  })
  
})
