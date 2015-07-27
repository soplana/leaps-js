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

  static index(modelClass) {
    var deferred = this.xhrRequest((data)=>{
      return _.map(data, (d)=>{return modelClass.castModel(d)});

    }, (xhr)=>{
      xhr.open("GET", modelClass.routing().indexPath);
      xhr = this.setDefaultHeader(xhr);
      xhr.send();
    });

    return deferred.promise
  };

  static show(model, conditions) {
    var deferred = this.xhrRequest((data)=>{
      return model.constructor.castModel(data);

    }, (xhr)=>{
      xhr.open("GET", model.routing().showPath);
      xhr = this.setDefaultHeader(xhr);
      xhr.send();
    });

    return deferred.promise
  };

  static update(model, conditions) {
    var deferred = this.xhrRequest((data)=>{
      return model.constructor.castModel(data);

    }, (xhr)=>{
      xhr.open("PUT", model.routing().updatePath, true);
      xhr = this.setDefaultHeader(xhr);
      xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      xhr.send(model.toPostParams());
    });

    return deferred.promise
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
};
