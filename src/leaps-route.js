"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapsRoute = (function () {
  function LeapsRoute(model, pathString) {
    _classCallCheck(this, LeapsRoute);

    this.model = model;
    this.path = pathString;
  }

  _createClass(LeapsRoute, {
    indexPath: {
      get: function () {
        return this.__staticPath__();
      }
    },
    showPath: {
      get: function () {
        return this.__dynamicPath__();
      }
    },
    __staticPath__: {

      //***************** __privateMethods__ *****************//

      value: function __staticPath__() {
        return this.path.replace(/\{.+\}|\/\{.+\}/, "");
      }
    },
    __dynamicPath__: {
      value: function __dynamicPath__() {
        var _this = this;

        return this.path.replace(/\{.+?\}/g, function (match) {
          var keyName = match.replace(/\{|\}/g, "");
          if (_.has(_this.model.toObject(), keyName)) {
            return _this.model[keyName];
          } else {
            return null;
          }
        });
      }
    }
  });

  return LeapsRoute;
})();

;