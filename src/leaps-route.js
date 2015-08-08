"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapsRoute = (function () {
  function LeapsRoute(model, pathString, pathObject) {
    _classCallCheck(this, LeapsRoute);

    this.model = model;
    this.pathString = pathString;
    this.pathObject = pathObject;

    if (!!this.pathObject) this.__createPathFunction__();
  }

  _createClass(LeapsRoute, {
    indexPath: {
      get: function () {
        return this.__staticPath__(this.pathString);
      }
    },
    showPath: {
      get: function () {
        return this.__dynamicPath__(this.pathString);
      }
    },
    updatePath: {
      get: function () {
        return this.__dynamicPath__(this.pathString);
      }
    },
    createPath: {
      get: function () {
        return this.__staticPath__(this.pathString);
      }
    },
    deletePath: {
      get: function () {
        return this.__dynamicPath__(this.pathString);
      }
    },
    __staticPath__: {

      //***************** __privateMethods__ *****************//

      value: function __staticPath__(path) {
        return path.replace(/\{.+\}|\/\{.+\}/, "");
      }
    },
    __dynamicPath__: {
      value: function __dynamicPath__(path) {
        var _this = this;

        return path.replace(/\{.+?\}/g, function (match) {
          var keyName = match.replace(/\{|\}/g, "");
          if (_.has(_this.model.toObject(), keyName)) {
            return _this.model[keyName];
          } else {
            return null;
          }
        });
      }
    },
    __createPathFunction__: {
      value: function __createPathFunction__() {
        var _this = this;

        _.each(this.pathObject, function (obj, functionName) {
          _this.__defineGetter__("" + functionName + "Path", function () {
            return _this.__dynamicPath__(obj.resource);
          });
        });
      }
    }
  });

  return LeapsRoute;
})();

;