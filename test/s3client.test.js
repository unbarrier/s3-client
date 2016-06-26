var AWS   = require('aws-sdk');
var sinon = require('sinon');
var expect    = require('chai').expect;
var providers = require('../lib/providers');
var installer = require('../lib/installer');
var store = require('../lib/Store'); 

describe("Integration tests for Docstore", function() {
  
  var options = {};
  
  before(function() {
       
      var S3 = installer.S3;
      
      sinon.stub(S3.config,'update', function() {
          return true;
      });

      sinon.stub(S3,'getObject', function() {
          return true;
      });

      sinon.stub(S3,'getSignedUrl', function() {
          return true;
      });
      
      // runs before all tests in this block
      options =  {
                      S3:{ 
                          accessKeyId: 'keyid',
                          secretAccessKey: 'secretaccesskey'
                      },
                      Bucket:'numdemo'
      };

      store.Setup({
                     Name:store.Providers.S3STORAGE,
                     options:options
                  }, 
                  function(err, store){
                           if(err) throw err; 
      }); 
  });

  after(function() {
    // runs after all tests in this block
    // console.log('after runs');
  });

  beforeEach(function() {
    // runs before each test in this block
    // console.log('beforeEach runs');
  });

  afterEach(function() {
    // runs after each test in this block
    // console.log('AfterEach runs');
  });

    describe("docstore enpoint test", function() {
        
        it('update config OK', function() {

                                store.Store().updateConfig(options, function(err) {
                                                if(err)
                                                {
                                                    console.log('error');
                                                }
                                                else
                                                {
                                                    expect(err).to.be.null;
                                                }
                                    });        
        });

        it('getUrl Failure Key Missing', function() {

                var params = {
                                Bucket: 'getFiscalBucket', /* required */
                                Expires: 60
                };

                store.Store().getUrl(params, function(err, result){

                      expect(err).to.not.be.null; 
                });       
        });

        it('getStream Failure Key Missing', function() {

                var params = {
                                Bucket: 'getFiscalBucket', /* required */
                                Expires: 60
                };

                store.Store().getStream(params, function(err, result){

                      expect(err).to.not.be.null; 
                });       
        });

        it('putFile Failure file Missing', function() {

                var params = {
                                Bucket: 'getFiscalBucket', /* required */
                                Expires: 60
                };
                var file;

                store.Store().putFile(params,file, function(err, result){

                      expect(err).to.not.be.null; 
                });       
        });
         
    });

});