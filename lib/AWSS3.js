var multer  = require('multer');
var Promise = require('bluebird');
var       _ = require('lodash');

function AWSS3(store) {       
    this._store = store;      
}

AWSS3.prototype.middleware = function () {

    var upload  = multer({ storage: this });

    return {
             putDoc:upload 
    }
}

AWSS3.prototype.updateConfig = function(options,cb)
{   
    try
    {
        this.options = options || {};

        if (_.has(options, 'S3'))
        this._store.config.update(options.S3);
        if (_.has(options, 'Bucket'))     
        this._bucket = options.Bucket;
        
        cb(null);
    }
    catch(e) 
    {
       cb(e);
    }        
}

AWSS3.prototype._handleFile = function _handleFile (req, file, cb) 
{
    if(!file || !file.stream)
    {
       cb({error:'expecting file and file stream'},null);
       return;
    } 

    var stream = file.stream;
    var params = {
                   Bucket: this._bucket
                  ,Key:file.originalname
                  ,Body: stream
                  ,ContentType:file.mimetype
    };
    
    this._store.upload(params, function(err, data) {
         
         if(err)
         {
            cb(err,null);
         }
         else
         {
            cb(null, {
                    path: data.Location,
                    size: ''
            });
         }
         
     });
};

AWSS3.prototype._removeFile = function _removeFile (req, file, cb) 
{
  
};

AWSS3.prototype.putFiles = function(param,files,cb)
{
    if(!files || !Array.isArray(files))
    {
        cb({error:'expecting array of files'},null);
        return;
    }

    var promises = [];
    files.forEach(function(file) {
    
        promises.push( new Promise(function(resolve, reject){
           
                                    this.putFile(param,file,function(err,data){
                                        if(!err)reject(err);
                                        resolve(data); 
                                    });    
                       })
       );
    
    }, this);

    Promise.all(promises).then(function(value){
        cb(null,value);
    },
    function(reason){
        cb(reason,null);
    });
};

AWSS3.prototype.putFile  = function(param,file,cb)
{
    if(!file || !file.stream)
    {
        cb({error:'expecting file and file stream'},null);
        return; 
    }
    
    var stream = file.stream;
     
    var params = {
                   Bucket: _.has(param, 'bucket')?param.Bucket:this._bucket
                  ,Key:file.originalname
                  ,Body: stream
                  ,ContentType:file.mimetype
    };
  
    this._store.upload(params, function(err, data) {
         if(!err)
         {
            cb(null, {
            path: data.Location,
            size: ''
            });
         }
         else
         {
            cb(err,null); 
         }
    });
};

AWSS3.prototype.getStream = function(param,cb){
 
   if (!_.has(param, 'key') || param.key == null || param.key == '')
   {
       cb({error:'Key is missing, please provide...'},null);
       return;
   }

   var params = {
                Bucket: _.has(param, 'bucket')?param.bucket:this._bucket,
                Key:param.key
   };
  
   this._store.getObject(params, function(err, data) {
        if (err) 
        {
          cb(err,null);
        }
        else
        { 
          cb(null,{data:data});
        }
   });   
};

AWSS3.prototype.getUrl = function(param,cb)
{
   if (!_.has(param, 'key') || param.key == null || param.key == '')
   {
       cb({error:'Key is missing, please provide...'},null);
       return;
   }
   
   var params = {
                 Bucket: _.has(param, 'bucket')?param.bucket:this._bucket,
                 Key: param.key, 
                 Expires: _.has(param, 'expires')?param.expires:60
   };
 
   this._store.getSignedUrl('getObject', params, function(err, url){
       if(err)
       {
          cb(err,null);
       }
       else
       {
         cb(null,{url:url});
       }       
   });   
};

module.exports = function(store)
{
    return new AWSS3(store);
}