var AWSS3 = require('./AWSS3');
var providers  = require('./providers'); 
var installer  = require('./installer');

var container = function() 
{              
          var bucket = new Object();
           
          bucket[providers.S3STORAGE] = AWSS3(installer.S3);
          //similarly we can add like dropbox , onedrive etc
          return bucket;
}

module.exports = container();