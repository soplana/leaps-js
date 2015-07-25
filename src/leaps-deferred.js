"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapsDeferred = (function () {
  function LeapsDeferred() {
    var _this = this;

    _classCallCheck(this, LeapsDeferred);

    this.promise = new Promise(function (resolve, reject) {
      _this._resolve = resolve;
      _this._reject = reject;
    });
  }

  _createClass(LeapsDeferred, {
    resolve: {
      value: function resolve(value) {
        this._resolve(value);
      }
    },
    reject: {
      value: function reject(reason) {
        this._reject(reason);
      }
    }
  });

  return LeapsDeferred;
})();

;