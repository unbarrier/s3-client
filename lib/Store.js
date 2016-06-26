var container = require('./container');
var providers = require('./providers');
var       _ = require('lodash');
 
var Store = function(service)
{
    try
    {
        this._service  = service;
        
        if (!_.has(this._service, 'Name'))
            throw {error:"Service Name required to find in container."};

        if(!container[this._service.Name])
            throw {error:this._service.Name + " Not found in container.Please use Providers in docStore to set one"};   
        
        if (!_.has(this._service, 'options'))
           throw {error:"options are missing, required!"};
        
        this._provider = container[this._service.Name]; 

        if (_.has(this._service, 'options'))
            this._provider.updateConfig(this._service.options, function(err) {});
    }
    catch(e)
    {
        throw e;
    }
}

Store.prototype.middleware = function() 
{
   return this._provider.middleware();        
}

Store.prototype.updateConfig = function(options,cb)
{    
    return this._provider.updateConfig(options,cb);
}

Store.prototype.putFiles = function(param,files,cb)
{
    return this._provider.putFiles(param,files,cb);
}

Store.prototype.putFile  = function(param,file,cb)
{
    return this._provider.putFile(param,file,cb);
}

Store.prototype.getStream = function(param,cb)
{
    return this._provider.getStream(param,cb);
}

Store.prototype.getUrl = function(param,cb)
{
    return this._provider.getUrl(param,cb);
}

module.exports = (function () {
    var instance;
 
    function createInstance(service,cb) 
    {
        try
        {
           var object = new Store(service);
           cb(null , object);
        }
        catch(e)
        {
           cb(e,null);
        }
    }
 
    return {
             Store: function () {
                return instance;
             },
             Setup:function(service,cb) {
                 if (!instance) 
                 {
                    createInstance(service,function(err,store) {
                            if(err)
                            {
                            cb(err,null);
                            }
                            else
                            {
                            instance = store;
                            cb(null,store);
                            }
                    });
                }
             },
             Providers:providers   
   };
})();