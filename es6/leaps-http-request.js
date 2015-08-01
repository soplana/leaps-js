// リクエスト周りの処理
class LeapsHttpRequest {
  static setUp(options) {
    this.options = _.extend(this.defaultOptions(), (options || {}));
  };

  static defaultOptions() {
    return {}
  };

  static setDefaultHeader(xhr) {
    _.each(this.options.defaultHeader, (value, key)=>{
      xhr.setRequestHeader(key, value);
    });
    return xhr
  };

  static index(modelClass, options={}) {
    return this.__getRequest__(
      "GET",
      modelClass,
      modelClass.routing().indexPath,
      options
    );
  };

  static show(model, options={}) {
    return this.__getRequest__("GET", model, model.routing().showPath, options);
  };

  static update(model, options={}) {
    return this.__sendRequest__("PUT", model, model.routing().updatePath, options);
  };

  static create(model, options={}) {
    return this.__sendRequest__("POST", model, model.routing().createPath, options);
  };

  static delete(model, options={}) {
    return this.__getRequest__("DELETE", model, model.routing().deletePath, options);
  };

  static xhrRequest(dataCast, callback) {
    var xhr      = this.getXHRObject();
    var deferred = new LeapsDeferred();

    xhr.onreadystatechange = function (){
      if (xhr.readyState === 4) {
        if(xhr.status === 200){
          deferred.resolve(dataCast(JSON.parse(xhr.responseText)));
        } else {
          deferred.reject(xhr.responseText);
        }
      }
    };
    callback(xhr);

    return deferred
  };

  static getXHRObject(){
    try{ return new XMLHttpRequest() }catch(e){};
    try{ return new ActiveXObject('MSXML2.XMLHTTP.6.0') }catch(e){};
    try{ return new ActiveXObject('MSXML2.XMLHTTP.3.0') }catch(e){};
    try{ return new ActiveXObject('MSXML2.XMLHTTP')     }catch(e){};
    return null;
  };

//***************** __privateMethods__ *****************//

  static __sendRequest__(httpMethod, model, path, options){
    var deferred = this.xhrRequest((data)=>{
      var resultModel  = model.constructor.castModel(data);
      if(!!model.__id) resultModel.__id = model.__id;
      if(!!options.save) resultModel.save();

      if     (httpMethod === "POST"  ) model.__eventFire__("onCreate");
      else if(httpMethod === "PUT"   ) model.__eventFire__("onUpdate");

      return resultModel;

    }, (xhr)=>{
      xhr.open(httpMethod, path, true);
      xhr = this.setDefaultHeader(xhr);
      xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      xhr.send(model.toPostParams());
    });

    return deferred.promise
  };

  static __getRequest__(httpMethod, model, path, options){
    var deferred = this.xhrRequest((data)=>{
      if(_.isArray(data)) {
        var resultModels = _.map(data, d => model.castModel(d));
        if(options.save) model.insert( resultModels );
        model.__classEventFire__("onIndex");
        return resultModels;

      } else {
        var resultModel = model.constructor.castModel(data);
        if(options.save) resultModel.save();

        if     (httpMethod === "GET"   ) model.__eventFire__("onShow");
        else if(httpMethod === "DELETE") model.__eventFire__("onDelete");

        return resultModel;
      };

    }, (xhr)=>{
      xhr.open(httpMethod, path);
      xhr = this.setDefaultHeader(xhr);
      xhr.send();
    });

    return deferred.promise
  };
};
