"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// リクエスト周りの処理

var LeapsHttpRequest = (function () {
  function LeapsHttpRequest() {
    _classCallCheck(this, LeapsHttpRequest);
  }

  _createClass(LeapsHttpRequest, null, {
    setUp: {
      value: function setUp(options) {
        this.options = _.extend(this.defaultOptions(), options || {});
      }
    },
    defaultOptions: {
      value: function defaultOptions() {
        return {};
      }
    },
    setDefaultHeader: {
      value: function setDefaultHeader(xhr) {
        _.each(this.options.defaultHeader, function (value, key) {
          xhr.setRequestHeader(key, value);
        });
        return xhr;
      }
    },
    index: {
      value: function index(modelClass) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        return this.__getRequest__("GET", modelClass, modelClass.routing().indexPath, options);
      }
    },
    show: {
      value: function show(model) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        return this.__getRequest__("GET", model, model.routing().showPath, options);
      }
    },
    update: {
      value: function update(model) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        return this.__sendRequest__("PUT", model, model.routing().updatePath, options);
      }
    },
    create: {
      value: function create(model) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        return this.__sendRequest__("POST", model, model.routing().createPath, options);
      }
    },
    "delete": {
      value: function _delete(model) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        return this.__getRequest__("DELETE", model, model.routing().deletePath, options);
      }
    },
    xhrRequest: {
      value: function xhrRequest(dataCast, callback) {
        var xhr = this.getXHRObject();
        var deferred = new LeapsDeferred();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              deferred.resolve(dataCast(JSON.parse(xhr.responseText)));
            } else {
              deferred.reject(xhr.responseText);
            }
          }
        };
        callback(xhr);

        return deferred;
      }
    },
    getXHRObject: {
      value: function getXHRObject() {
        try {
          return new XMLHttpRequest();
        } catch (e) {};
        try {
          return new ActiveXObject("MSXML2.XMLHTTP.6.0");
        } catch (e) {};
        try {
          return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        } catch (e) {};
        try {
          return new ActiveXObject("MSXML2.XMLHTTP");
        } catch (e) {};
        return null;
      }
    },
    __sendRequest__: {

      //***************** __privateMethods__ *****************//

      value: function __sendRequest__(httpMethod, model, path, options) {
        var _this = this;

        var deferred = this.xhrRequest(function (data) {
          var resultModel = model.constructor.castModel(data);
          if (!!model.__id) resultModel.__id = model.__id;
          if (!!options.save) resultModel.save();

          return resultModel;
        }, function (xhr) {
          xhr.open(httpMethod, path, true);
          xhr = _this.setDefaultHeader(xhr);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.send(model.toPostParams());
        });

        return deferred.promise;
      }
    },
    __getRequest__: {
      value: function __getRequest__(httpMethod, model, path, options) {
        var _this = this;

        var deferred = this.xhrRequest(function (data) {
          if (_.isArray(data)) {
            var resultModels = _.map(data, function (d) {
              return model.castModel(d);
            });
            if (options.save) model.insert(resultModels);
            return resultModels;
          } else {
            var resultModel = model.constructor.castModel(data);
            if (options.save) resultModel.save();
            return resultModel;
          };
        }, function (xhr) {
          xhr.open(httpMethod, path);
          xhr = _this.setDefaultHeader(xhr);
          xhr.send();
        });

        return deferred.promise;
      }
    }
  });

  return LeapsHttpRequest;
})();

;