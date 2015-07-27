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
        var _this = this;

        var deferred = this.xhrRequest(function (data) {
          return _.map(data, function (d) {
            return modelClass.castModel(d);
          });
        }, function (xhr) {
          xhr.open("GET", modelClass.routing().indexPath);
          xhr = _this.setDefaultHeader(xhr);
          xhr.send();
        });

        return deferred.promise;
      }
    },
    show: {
      value: function show(model, conditions) {
        var _this = this;

        var deferred = this.xhrRequest(function (data) {
          return model.constructor.castModel(data);
        }, function (xhr) {
          xhr.open("GET", model.routing().showPath);
          xhr = _this.setDefaultHeader(xhr);
          xhr.send();
        });

        return deferred.promise;
      }
    },
    update: {
      value: function update(model, conditions) {
        var _this = this;

        var deferred = this.xhrRequest(function (data) {
          return model.constructor.castModel(data);
        }, function (xhr) {
          xhr.open("PUT", model.routing().updatePath, true);
          xhr = _this.setDefaultHeader(xhr);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.send(model.toPostParams());
        });

        return deferred.promise;
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
    }
  });

  return LeapsHttpRequest;
})();

;