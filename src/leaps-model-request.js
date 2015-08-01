"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// 直接親子関係には無いが、es6は多重継承をサポートしてないようなので
// 処理の切り分けのためにクラスを分けて記述する

var LeapsModelRequest = (function (_LeapsModelEventInterface) {
  function LeapsModelRequest() {
    _classCallCheck(this, LeapsModelRequest);

    _get(Object.getPrototypeOf(LeapsModelRequest.prototype), "constructor", this).call(this);
  }

  _inherits(LeapsModelRequest, _LeapsModelEventInterface);

  _createClass(LeapsModelRequest, {
    routing: {

      //***************** instanceMethods *****************//

      value: function routing() {
        return new LeapsRoute(this, this.constructor.resourcePath());
      }
    },
    show: {
      value: function show(options) {
        return LeapsHttpRequest.show(this, options);
      }
    },
    update: {
      value: function update(options) {
        return LeapsHttpRequest.update(this, options);
      }
    },
    create: {
      value: function create(options) {
        return LeapsHttpRequest.create(this, options);
      }
    },
    "delete": {
      value: function _delete(options) {
        return LeapsHttpRequest["delete"](this, options);
      }
    },
    toPostParams: {
      value: function toPostParams() {
        var params = [];

        for (var key in this.toObject()) {
          var value = this.toObject()[key],
              param = "" + this.constructor.name + "[" + encodeURIComponent(key) + "]=" + encodeURIComponent(value);
          params.push(param);
        };

        return params.join("&").replace(/%20/g, "+");
      }
    },
    toParams: {
      value: function toParams() {
        var params = [];

        for (var key in this.toObject()) {
          var value = this.toObject()[key],
              param = "" + encodeURIComponent(key) + "=" + encodeURIComponent(value);
          params.push(param);
        };

        return params.join("&").replace(/%20/g, "+");
      }
    }
  }, {
    routing: {

      //***************** classMethods *****************//

      value: function routing() {
        return new LeapsRoute(null, this.resourcePath());
      }
    },
    index: {
      value: function index(options) {
        return LeapsHttpRequest.index(this, options);
      }
    }
  });

  return LeapsModelRequest;
})(LeapsModelEventInterface);