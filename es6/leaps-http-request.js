// リクエスト周りの処理
class LeapsHttpRequest {
  static index(modelClass) {

    var deferred = this.xhrRequest(function(data){
      return _.map(data, (d)=>{return modelClass.castModel(d)});

    }, function(xhr){
      xhr.open("GET", modelClass.routing().indexPath);
      xhr.send()
    });

    return deferred.promise
  };

  static show(model, conditions) {

    var deferred = this.xhrRequest(function(data){
      return model.constructor.castModel(data);

    }, function(xhr){
      xhr.open("GET", model.routing().showPath);
      xhr.send()
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
