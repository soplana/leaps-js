(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _leapsDatabase = require('./leaps-database');

// 検索周りの処理をまとめたい

var _leapsDatabase2 = _interopRequireDefault(_leapsDatabase);

function LeapsCriteriaMixin() {
  var base = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  var LeapsCriteria = (function (_base) {
    _inherits(LeapsCriteria, _base);

    function LeapsCriteria() {
      _classCallCheck(this, LeapsCriteria);

      _get(Object.getPrototypeOf(LeapsCriteria.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(LeapsCriteria, null, [{
      key: 'all',
      value: function all() {
        var _this = this;

        var dataList = _leapsDatabase2['default'].selectAll(this.name);
        return _.map(dataList, function (data) {
          return _this.castModel(data);
        });
      }
    }, {
      key: 'find',
      value: function find(__id) {
        var record = this.db().findById(__id);
        return record ? this.castModel(record) : null;
      }
    }, {
      key: 'where',
      value: function where(conditions) {
        var _this2 = this;

        return _.map(this.db().where(conditions), function (data) {
          return _this2.castModel(data);
        });
      }
    }]);

    return LeapsCriteria;
  })(base);

  ;
  return LeapsCriteria;
};
exports['default'] = { mixin: LeapsCriteriaMixin };
module.exports = exports['default'];

},{"./leaps-database":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _leapsStorage = require('./leaps-storage');

// DB
// そのうちlocalStrageとか使えるようにしたほうが便利かも

var _leapsStorage2 = _interopRequireDefault(_leapsStorage);

var LeapsDatabase = (function () {
  _createClass(LeapsDatabase, [{
    key: "sequenceNo",
    get: function get() {
      return LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)][0].sequenceNo;
    }
  }, {
    key: "table",
    get: function get() {
      return LeapsDatabase.tables[this.tableName];
    }
  }, {
    key: "defaultSequenceNoData",
    get: function get() {
      return { sequenceNo: 1 };
    }
  }]);

  function LeapsDatabase(tableName) {
    _classCallCheck(this, LeapsDatabase);

    this.tableName = tableName;
    this.__createTables__();
  }

  _createClass(LeapsDatabase, [{
    key: "insert",

    //***************** instanceMethods *****************//
    value: function insert(record) {
      var returnFlag = false;
      try {
        if (this.__isNewRecord__(record)) {
          returnFlag = this.__insert__(record);
          if (returnFlag) record.__eventFire__("onSave");
        } else {
          returnFlag = this.__update__(record);
          if (returnFlag) record.__eventFire__("onChange");
        };

        return returnFlag;
      } catch (e) {
        console.log("insert error!");
        console.log(e);
        return false;
      }
    }
  }, {
    key: "destroy",
    value: function destroy(record) {
      try {
        var deleteTargetRecord = this.findById(record.__id);

        if (!_.isEmpty(deleteTargetRecord)) {
          var returnFlag = this.__delete__(deleteTargetRecord);
          if (returnFlag) record.__eventFire__("onDestroy");

          return returnFlag;
        } else {
          return false;
        }
      } catch (e) {
        console.log("delete error!");
        console.log(e);
        return false;
      }
    }
  }, {
    key: "destroyAll",
    value: function destroyAll() {
      try {
        var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
            initData = this.defaultSequenceNoData;

        _leapsStorage2["default"].createTable(this.tableName);
        LeapsDatabase.tables[this.tableName] = [];

        _leapsStorage2["default"].persistence(sqTableName, [initData]);
        LeapsDatabase.tables[sqTableName] = [initData];
        return true;
      } catch (e) {
        console.log("delete error!");
        console.log(e);
        return false;
      }
    }
  }, {
    key: "findById",
    value: function findById(__id) {
      return _.findWhere(this.table, { __id: __id });
    }
  }, {
    key: "where",
    value: function where(conditions) {
      return _.where(this.table, conditions);
    }
  }, {
    key: "__createTables__",

    //***************** __privateMethods__ *****************//

    // tableの作成
    value: function __createTables__() {
      if (_.isEmpty(this.table)) {
        var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
            initData = this.defaultSequenceNoData;

        if (this.constructor.options.persist) {
          if (!_leapsStorage2["default"].hasTable(this.tableName)) {
            _leapsStorage2["default"].createTable(this.tableName);
          };

          if (!_leapsStorage2["default"].hasTable(sqTableName)) {
            _leapsStorage2["default"].createTable(sqTableName);
            _leapsStorage2["default"].persistence(sqTableName, [initData]);
          };

          // localStrageに存在すればそれをロードする
          LeapsDatabase.tables[this.tableName] = _leapsStorage2["default"].load()[this.tableName];
          LeapsDatabase.tables[sqTableName] = _leapsStorage2["default"].load()[sqTableName];
        } else {
          LeapsDatabase.tables[this.tableName] = [];
          LeapsDatabase.tables[sqTableName] = [initData];
        }
      };
    }
  }, {
    key: "__isNewRecord__",

    // 既に存在するレコードかどうかを調べる
    value: function __isNewRecord__(newRecord) {
      return _.isEmpty(this.findById(newRecord.__id));
    }
  }, {
    key: "__insert__",
    value: function __insert__(record) {
      record.__id = this.sequenceNo;
      this.table.push(record.toObject());
      this.__incrementSequence__(record);
      if (this.constructor.options.persist) this.__persistenceTable__();
      return true;
    }
  }, {
    key: "__update__",
    value: function __update__(record) {
      var updateTargetRecord = this.findById(record.__id);

      var index = _.findIndex(this.table, function (data) {
        if (data.__id === updateTargetRecord.__id) return true;
      });
      if (index === -1) return false;
      this.table[index] = record.toObject();

      if (this.constructor.options.persist) this.__persistenceTable__();
      return true;
    }
  }, {
    key: "__delete__",
    value: function __delete__(record) {
      var index = _.findIndex(this.table, { __id: record.__id });
      this.table.splice(index, 1);
      if (this.constructor.options.persist) this.__persistenceTable__();
      return true;
    }
  }, {
    key: "__persistenceTable__",
    value: function __persistenceTable__() {
      _leapsStorage2["default"].persistence(this.tableName, this.table);
    }
  }, {
    key: "__incrementSequence__",

    // シーケンス番号
    value: function __incrementSequence__(record) {
      var sqc = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
      sqc[0].sequenceNo = record.__id + 1;

      if (this.constructor.options.persist) {
        _leapsStorage2["default"].persistence(LeapsDatabase.sequenceTableName(this.tableName), sqc);
      }
    }
  }], [{
    key: "selectAll",

    //***************** classMethods *****************//
    value: function selectAll(tableName) {
      return LeapsDatabase.tables[tableName];
    }
  }, {
    key: "createDatabase",
    value: function createDatabase(options) {
      this.options = _.extend(this.defaultOptions(), options);

      // 初期化
      if (this.options.drop) _leapsStorage2["default"].clear(options.database);

      // 永続化するかどうか
      var storage = null;
      if (this.options.persist) {
        _leapsStorage2["default"].setUp(this.options.database);
        storage = _leapsStorage2["default"].load();
      } else {
        storage = {};
      };

      this.tables = storage;
    }
  }, {
    key: "sequenceTableName",
    value: function sequenceTableName(tableName) {
      return tableName + "Sequence";
    }
  }, {
    key: "defaultOptions",
    value: function defaultOptions() {
      return {
        drop: false,
        persist: true
      };
    }
  }]);

  return LeapsDatabase;
})();

exports["default"] = LeapsDatabase;
;
module.exports = exports["default"];

},{"./leaps-storage":10}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LeapsDeferred = (function () {
  function LeapsDeferred() {
    var _this = this;

    _classCallCheck(this, LeapsDeferred);

    this.promise = new Promise(function (resolve, reject) {
      _this._resolve = resolve;
      _this._reject = reject;
    });
  }

  _createClass(LeapsDeferred, [{
    key: "resolve",
    value: function resolve(value) {
      this._resolve(value);
    }
  }, {
    key: "reject",
    value: function reject(reason) {
      this._reject(reason);
    }
  }]);

  return LeapsDeferred;
})();

exports["default"] = LeapsDeferred;
;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeapsEventList = (function (_Array) {
  _inherits(LeapsEventList, _Array);

  function LeapsEventList() {
    _classCallCheck(this, LeapsEventList);

    _get(Object.getPrototypeOf(LeapsEventList.prototype), "constructor", this).call(this);
  }

  _createClass(LeapsEventList, [{
    key: "fire",
    value: function fire(eventName) {
      _.each(_.where(this, { eventName: eventName }), function (eventObject) {
        if (!eventObject) return null;

        if (!!eventObject.context) {
          eventObject.eventFunction.call(eventObject.context);
        } else {
          eventObject.eventFunction.call();
        };
      });
    }
  }]);

  return LeapsEventList;
})(Array);

exports["default"] = LeapsEventList;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _leapsDeferred = require('./leaps-deferred');

// リクエスト周りの処理

var _leapsDeferred2 = _interopRequireDefault(_leapsDeferred);

var LeapsHttpRequest = (function () {
  function LeapsHttpRequest() {
    _classCallCheck(this, LeapsHttpRequest);
  }

  _createClass(LeapsHttpRequest, null, [{
    key: "setUp",
    value: function setUp(options) {
      this.options = _.extend(this.defaultOptions(), options || {});
    }
  }, {
    key: "defaultOptions",
    value: function defaultOptions() {
      return {};
    }
  }, {
    key: "setDefaultHeader",
    value: function setDefaultHeader(xhr) {
      _.each(this.options.defaultHeader, function (value, key) {
        xhr.setRequestHeader(key, value);
      });
      return xhr;
    }
  }, {
    key: "index",
    value: function index(modelClass) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.__getRequest__("GET", modelClass, modelClass.routing().indexPath, options);
    }
  }, {
    key: "show",
    value: function show(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.request("GET", model, model.routing().showPath, options);
    }
  }, {
    key: "update",
    value: function update(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.request("PUT", model, model.routing().updatePath, options);
    }
  }, {
    key: "create",
    value: function create(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.request("POST", model, model.routing().createPath, options);
    }
  }, {
    key: "delete",
    value: function _delete(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.request("DELETE", model, model.routing().deletePath, options);
    }
  }, {
    key: "request",
    value: function request(httpMethod, model, path) {
      var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      if (httpMethod === "GET" || httpMethod === "DELETE") {
        return this.__getRequest__(httpMethod, model, path, options);
      } else if (httpMethod === "PUT" || httpMethod === "POST") {
        return this.__sendRequest__(httpMethod, model, path, options);
      } else {
        return null;
      };
    }
  }, {
    key: "xhrRequest",
    value: function xhrRequest(dataCast, callback) {
      var xhr = this.getXHRObject();
      var deferred = new _leapsDeferred2["default"]();

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
  }, {
    key: "getXHRObject",
    value: function getXHRObject() {
      try {
        return new XMLHttpRequest();
      } catch (e) {};
      try {
        return new ActiveXObject('MSXML2.XMLHTTP.6.0');
      } catch (e) {};
      try {
        return new ActiveXObject('MSXML2.XMLHTTP.3.0');
      } catch (e) {};
      try {
        return new ActiveXObject('MSXML2.XMLHTTP');
      } catch (e) {};
      return null;
    }
  }, {
    key: "__sendRequest__",

    //***************** __privateMethods__ *****************//

    value: function __sendRequest__(httpMethod, model, path, options) {
      var _this = this;

      var deferred = this.xhrRequest(function (data) {
        var resultModel = model.constructor.castModel(data);
        if (!!model.__id) resultModel.__id = model.__id;
        if (!!options.save) resultModel.save();

        if (httpMethod === "POST") model.__eventFire__("onCreate");else if (httpMethod === "PUT") model.__eventFire__("onUpdate");

        return resultModel;
      }, function (xhr) {
        xhr.open(httpMethod, path, true);
        xhr = _this.setDefaultHeader(xhr);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(model.toPostParams());
      });

      return deferred.promise;
    }
  }, {
    key: "__getRequest__",
    value: function __getRequest__(httpMethod, model, path, options) {
      var _this2 = this;

      var deferred = this.xhrRequest(function (data) {
        if (_.isArray(data)) {
          var resultModels = _.map(data, function (d) {
            return model.castModel(d);
          });
          if (options.save) model.insert(resultModels);
          model.__classEventFire__("onIndex");
          return resultModels;
        } else {
          var resultModel = model.constructor.castModel(data);
          if (options.save) resultModel.save();

          if (httpMethod === "GET") model.__eventFire__("onShow");else if (httpMethod === "DELETE") model.__eventFire__("onDelete");

          return resultModel;
        };
      }, function (xhr) {
        xhr.open(httpMethod, path);
        xhr = _this2.setDefaultHeader(xhr);
        xhr.send();
      });

      return deferred.promise;
    }
  }]);

  return LeapsHttpRequest;
})();

exports["default"] = LeapsHttpRequest;
;
module.exports = exports["default"];

},{"./leaps-deferred":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _leapsEventList = require('./leaps-event-list');

var _leapsEventList2 = _interopRequireDefault(_leapsEventList);

var LeapsModelEventInterface = (function () {
  function LeapsModelEventInterface() {
    _classCallCheck(this, LeapsModelEventInterface);
  }

  _createClass(LeapsModelEventInterface, [{
    key: "onSave",

    // クエリEvent
    value: function onSave(event, context) {
      this.__addEvent__("onSave", event, context);
    }
  }, {
    key: "onChange",
    value: function onChange(event, context) {
      this.__addEvent__("onChange", event, context);
    }
  }, {
    key: "onDestroy",
    value: function onDestroy(event, context) {
      this.__addEvent__("onDestroy", event, context);
    }
  }, {
    key: "onShow",

    // 通信Event
    value: function onShow(event, context) {
      this.__addEvent__("onShow", event, context);
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(event, context) {
      this.__addEvent__("onUpdate", event, context);
    }
  }, {
    key: "onCreate",
    value: function onCreate(event, context) {
      this.__addEvent__("onCreate", event, context);
    }
  }, {
    key: "onDelete",
    value: function onDelete(event, context) {
      this.__addEvent__("onDelete", event, context);
    }
  }, {
    key: "__addEvent__",

    // class変数としてのeventListは区別する
    value: function __addEvent__(eventName, eventFunction, context) {
      this.eventList.push({ eventName: eventName, eventFunction: eventFunction, context: context });
    }
  }, {
    key: "__eventFire__",
    value: function __eventFire__(eventName) {
      var afterEvent = this[eventName.replace(/^on/, "after")];
      if (!!afterEvent) afterEvent.call(this);

      this.eventList.fire(eventName);
    }
  }], [{
    key: "onDestroyAll",

    //***************** classMethods *****************//
    // クエリEvent
    value: function onDestroyAll(event, context) {
      this.__addClassEvent__("onDestroyAll", event, context);
    }
  }, {
    key: "onInsert",
    value: function onInsert(event, context) {
      this.__addClassEvent__("onInsert", event, context);
    }
  }, {
    key: "onIndex",

    // 通信Event
    value: function onIndex(event, context) {
      this.__addClassEvent__("onIndex", event, context);
    }
  }, {
    key: "__addClassEvent__",

    //***************** __privateMethods__ *****************//
    // class変数としてのeventListは区別する
    value: function __addClassEvent__(eventName, eventFunction, context) {
      if (!this.classEventList) {
        this.classEventList = new _leapsEventList2["default"]();
      };
      this.classEventList.push({ eventName: eventName, eventFunction: eventFunction, context: context });
    }
  }, {
    key: "__classEventFire__",
    value: function __classEventFire__(eventName) {
      if (!!this.classEventList) {
        this.classEventList.fire(eventName);
      }
    }
  }]);

  return LeapsModelEventInterface;
})();

exports["default"] = LeapsModelEventInterface;
module.exports = exports["default"];

},{"./leaps-event-list":4}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _leapsHttpRequest = require('./leaps-http-request');

var _leapsHttpRequest2 = _interopRequireDefault(_leapsHttpRequest);

var _leapsRoute = require('./leaps-route');

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

function LeapsModelRequestMixin() {
  var base = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  var LeapsModelRequest = (function (_base) {
    _inherits(LeapsModelRequest, _base);

    function LeapsModelRequest() {
      _classCallCheck(this, LeapsModelRequest);

      _get(Object.getPrototypeOf(LeapsModelRequest.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(LeapsModelRequest, [{
      key: 'routing',

      //***************** instanceMethods *****************//
      value: function routing() {
        return this.constructor.routing(this);
      }
    }, {
      key: 'show',
      value: function show(options) {
        return _leapsHttpRequest2['default'].show(this, options);
      }
    }, {
      key: 'update',
      value: function update(options) {
        return _leapsHttpRequest2['default'].update(this, options);
      }
    }, {
      key: 'create',
      value: function create(options) {
        return _leapsHttpRequest2['default'].create(this, options);
      }
    }, {
      key: 'delete',
      value: function _delete(options) {
        return _leapsHttpRequest2['default']['delete'](this, options);
      }
    }, {
      key: 'toPostParams',
      value: function toPostParams() {
        var params = [];

        for (var key in this.toObject()) {
          var value = this.toObject()[key],
              param = this.constructor.name + '[' + encodeURIComponent(key) + ']=' + encodeURIComponent(value);
          params.push(param);
        };

        return params.join('&').replace(/%20/g, '+');
      }
    }, {
      key: 'toParams',
      value: function toParams() {
        var params = [];

        for (var key in this.toObject()) {
          var value = this.toObject()[key],
              param = encodeURIComponent(key) + '=' + encodeURIComponent(value);
          params.push(param);
        };

        return params.join('&').replace(/%20/g, '+');
      }
    }, {
      key: '__createResoucesFunction__',

      //***************** __privateMethods__ *****************//

      // optionでカスタムPathが渡された場合、リクエスト送信用のfunctionの定義
      value: function __createResoucesFunction__() {
        var _this = this;

        _.each(this.constructor.customResource(), function (obj, functionName) {
          _this[functionName] = function (options) {
            return _leapsHttpRequest2['default'].request(obj.method, this, this.routing()[functionName + 'Path'], options);
          };
        });
      }
    }], [{
      key: 'routing',

      //***************** classMethods *****************//
      value: function routing() {
        var model = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        var resource = {},
            customResource = {};

        if (!!this.resource) resource = this.resource();
        if (!!this.customResource) customResource = this.customResource();

        return new _leapsRoute2['default'](model, resource, customResource);
      }
    }, {
      key: 'index',
      value: function index(options) {
        return _leapsHttpRequest2['default'].index(this, options);
      }
    }]);

    return LeapsModelRequest;
  })(base);

  return LeapsModelRequest;
};
exports['default'] = { mixin: LeapsModelRequestMixin };
module.exports = exports['default'];

},{"./leaps-http-request":5,"./leaps-route":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _leapsHttpRequest = require('./leaps-http-request');

var _leapsHttpRequest2 = _interopRequireDefault(_leapsHttpRequest);

var _leapsDatabase = require('./leaps-database');

var _leapsDatabase2 = _interopRequireDefault(_leapsDatabase);

var _leapsModelRequest = require('./leaps-model-request');

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var _leapsCriteria = require('./leaps-criteria');

var _leapsCriteria2 = _interopRequireDefault(_leapsCriteria);

var _leapsModelEventInterface = require('./leaps-model-event-interface');

var _leapsModelEventInterface2 = _interopRequireDefault(_leapsModelEventInterface);

var _leapsEventList = require('./leaps-event-list');

var _leapsEventList2 = _interopRequireDefault(_leapsEventList);

var LeapsModel = (function (_LeapsCriteria$mixin) {
  _inherits(LeapsModel, _LeapsCriteria$mixin);

  function LeapsModel(data) {
    _classCallCheck(this, LeapsModel);

    _get(Object.getPrototypeOf(LeapsModel.prototype), 'constructor', this).call(this);
    this.modelClass = this.constructor;

    // propertyとしてオブジェクトに生えるものと
    // recordとして保存されるオブジェクトを切り離したい
    this.__createProperties__(data);

    if (!!this.constructor.customResource) this.__createResoucesFunction__();

    // instanceイベントを保持
    this.eventList = new _leapsEventList2['default']();
  }

  _createClass(LeapsModel, [{
    key: 'save',

    //***************** instanceMethods *****************//
    value: function save() {
      return this.modelClass.db().insert(this);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this.modelClass.db().destroy(this);
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      return this.__mergeProperties__({}, this);
    }
  }, {
    key: '__createProperties__',

    //***************** __privateMethods__ *****************//
    value: function __createProperties__(data) {
      this.__mergeProperties__(this, data);
    }
  }, {
    key: '__mergeProperties__',

    // propertyとして存在するものだけをコピーする
    value: function __mergeProperties__(newData, originData) {
      var _this = this;

      _.each(originData, function (value, key) {
        if (_.indexOf(_.keys(_this.__getProperties__()), key) != -1) {
          newData[key] = value;
        };
      });
      return newData;
    }
  }, {
    key: '__getProperties__',

    // 内部的にpropertiesを参照するときはこれを使う
    value: function __getProperties__() {
      return _.extend({
        __id: null
      }, this.modelClass.properties());
    }
  }], [{
    key: 'insert',

    //***************** classMethods *****************//

    // 失敗時にロールバックする処理ほしい気がする
    value: function insert(modelList) {
      _.each(modelList, function (d) {
        d.save();
      });
      this.__classEventFire__("onInsert");
      return modelList;
    }
  }, {
    key: 'destroyAll',
    value: function destroyAll() {
      var result = this.db().destroyAll();
      this.__classEventFire__("onDestroyAll");
      return result;
    }
  }, {
    key: 'setUp',
    value: function setUp(options) {
      _leapsDatabase2['default'].createDatabase(options);
      _leapsHttpRequest2['default'].setUp(options.request);
    }
  }, {
    key: 'db',
    value: function db() {
      if (_.isEmpty(this.table)) {
        this.table = new _leapsDatabase2['default'](this.name);
      };
      return this.table;
    }
  }, {
    key: 'castModel',
    value: function castModel(data) {
      return new this(data);
    }
  }, {
    key: 'properties',

    // overrideして使う
    value: function properties() {
      return {};
    }
  }]);

  return LeapsModel;
})(_leapsCriteria2['default'].mixin(_leapsModelRequest2['default'].mixin(_leapsModelEventInterface2['default'])));

exports['default'] = LeapsModel;
;
module.exports = exports['default'];

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-event-list":4,"./leaps-http-request":5,"./leaps-model-event-interface":6,"./leaps-model-request":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LeapsRoute = (function () {
  function LeapsRoute(model, pathString, pathObject) {
    _classCallCheck(this, LeapsRoute);

    this.model = model;
    this.pathString = pathString;
    this.pathObject = pathObject;

    if (!!this.pathObject) this.__createPathFunction__();
  }

  _createClass(LeapsRoute, [{
    key: "__staticPath__",

    //***************** __privateMethods__ *****************//
    value: function __staticPath__(path) {
      return path.replace(/\{.+\}|\/\{.+\}/, "");
    }
  }, {
    key: "__dynamicPath__",
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
  }, {
    key: "__createPathFunction__",
    value: function __createPathFunction__() {
      var _this2 = this;

      _.each(this.pathObject, function (obj, functionName) {
        _this2.__defineGetter__(functionName + "Path", function () {
          return _this2.__dynamicPath__(obj.resource);
        });
      });
    }
  }, {
    key: "indexPath",
    get: function get() {
      return this.__staticPath__(this.pathString);
    }
  }, {
    key: "showPath",
    get: function get() {
      return this.__dynamicPath__(this.pathString);
    }
  }, {
    key: "updatePath",
    get: function get() {
      return this.__dynamicPath__(this.pathString);
    }
  }, {
    key: "createPath",
    get: function get() {
      return this.__staticPath__(this.pathString);
    }
  }, {
    key: "deletePath",
    get: function get() {
      return this.__dynamicPath__(this.pathString);
    }
  }]);

  return LeapsRoute;
})();

exports["default"] = LeapsRoute;
;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LeapsStorage = (function () {
  function LeapsStorage() {
    _classCallCheck(this, LeapsStorage);
  }

  _createClass(LeapsStorage, null, [{
    key: "clear",
    value: function clear(databaseName) {
      if (!_.isEmpty(localStorage[this.__storageName__(databaseName)])) {
        localStorage.removeItem(this.__storageName__(databaseName));
      };
    }
  }, {
    key: "setUp",
    value: function setUp(databaseName) {
      this.storage = localStorage;
      this.appStorageName = this.__storageName__(databaseName);

      if (_.isEmpty(this.storage[this.appStorageName])) {
        // 初期化
        this.storage[this.appStorageName] = JSON.stringify({});
      };
    }
  }, {
    key: "load",
    value: function load() {
      return JSON.parse(this.appStorage());
    }
  }, {
    key: "hasTable",
    value: function hasTable(tableName) {
      return _.has(this.load(), tableName);
    }
  }, {
    key: "createTable",
    value: function createTable(tableName) {
      this.persistence(tableName, []);
    }
  }, {
    key: "appStorage",
    value: function appStorage() {
      return this.storage[this.appStorageName];
    }
  }, {
    key: "persistence",
    value: function persistence(tableName, data) {
      var newStorage = this.load();
      newStorage[tableName] = data;

      this.storage[this.appStorageName] = JSON.stringify(newStorage);
    }
  }, {
    key: "__storageName__",

    //***************** __privateMethods__ *****************//
    value: function __storageName__(name) {
      return "leapsStorage_" + name;
    }
  }]);

  return LeapsStorage;
})();

exports["default"] = LeapsStorage;
module.exports = exports["default"];

},{}],11:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leapsModel = require('./leaps-model');

var _leapsModel2 = _interopRequireDefault(_leapsModel);

var _leapsDeferred = require('./leaps-deferred');

var _leapsDeferred2 = _interopRequireDefault(_leapsDeferred);

var _leapsHttpRequest = require('./leaps-http-request');

var _leapsHttpRequest2 = _interopRequireDefault(_leapsHttpRequest);

var _leapsStorage = require('./leaps-storage');

var _leapsStorage2 = _interopRequireDefault(_leapsStorage);

var _leapsDatabase = require('./leaps-database');

var _leapsDatabase2 = _interopRequireDefault(_leapsDatabase);

var _leapsCriteria = require('./leaps-criteria');

var _leapsCriteria2 = _interopRequireDefault(_leapsCriteria);

var _leapsRoute = require('./leaps-route');

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

var _leapsModelRequest = require('./leaps-model-request');

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var _leapsEventList = require('./leaps-event-list');

var _leapsEventList2 = _interopRequireDefault(_leapsEventList);

var _leapsModelEventInterface = require('./leaps-model-event-interface');

var _leapsModelEventInterface2 = _interopRequireDefault(_leapsModelEventInterface);

window.LeapsModel = _leapsModel2['default'];

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-event-list":4,"./leaps-http-request":5,"./leaps-model":8,"./leaps-model-event-interface":6,"./leaps-model-request":7,"./leaps-route":9,"./leaps-storage":10}]},{},[11]);
