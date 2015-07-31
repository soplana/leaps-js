(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

var _leapsRoute = require('./leaps-route');

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

var _leapsModelRequest = require('./leaps-model-request');

// 検索周りの処理をまとめたい

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var LeapsCriteria = (function () {
  function LeapsCriteria() {
    _classCallCheck(this, LeapsCriteria);
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
})();

;
module.exports = LeapsCriteria;

},{"./leaps-database":2,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model":6,"./leaps-model-request":5,"./leaps-route":7,"./leaps-storage":8}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _leapsModel = require('./leaps-model');

var _leapsModel2 = _interopRequireDefault(_leapsModel);

var _leapsDeferred = require('./leaps-deferred');

var _leapsDeferred2 = _interopRequireDefault(_leapsDeferred);

var _leapsHttpRequest = require('./leaps-http-request');

var _leapsHttpRequest2 = _interopRequireDefault(_leapsHttpRequest);

var _leapsStorage = require('./leaps-storage');

var _leapsStorage2 = _interopRequireDefault(_leapsStorage);

var _leapsCriteria = require('./leaps-criteria');

var _leapsCriteria2 = _interopRequireDefault(_leapsCriteria);

var _leapsRoute = require('./leaps-route');

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

var _leapsModelRequest = require('./leaps-model-request');

// DB
// そのうちlocalStrageとか使えるようにしたほうが便利かも

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var LeapsDatabase = (function () {
  _createClass(LeapsDatabase, [{
    key: 'sequenceNo',
    get: function get() {
      return LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)][0].sequenceNo;
    }
  }, {
    key: 'table',
    get: function get() {
      return LeapsDatabase.tables[this.tableName];
    }
  }, {
    key: 'defaultSequenceNoData',
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
    key: 'insert',

    //***************** instanceMethods *****************//
    value: function insert(record) {
      try {
        if (this.__isNewRecord__(record)) {
          return this.__insert__(record);
        } else {
          return this.__update__(record);
        };
      } catch (e) {
        console.log("insert error!");
        console.log(e);
        return false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy(record) {
      try {
        var deleteTargetRecord = this.findById(record.__id);

        if (!_.isEmpty(deleteTargetRecord)) {
          return this.__delete__(deleteTargetRecord);
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
    key: 'destroyAll',
    value: function destroyAll() {
      try {
        var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
            initData = this.defaultSequenceNoData;

        _leapsStorage2['default'].createTable(this.tableName);
        LeapsDatabase.tables[this.tableName] = [];

        _leapsStorage2['default'].persistence(sqTableName, [initData]);
        LeapsDatabase.tables[sqTableName] = [initData];
        return true;
      } catch (e) {
        console.log("delete error!");
        console.log(e);
        return false;
      }
    }
  }, {
    key: 'findById',
    value: function findById(__id) {
      return _.findWhere(this.table, { __id: __id });
    }
  }, {
    key: 'where',
    value: function where(conditions) {
      return _.where(this.table, conditions);
    }
  }, {
    key: '__createTables__',

    //***************** __privateMethods__ *****************//

    // tableの作成
    value: function __createTables__() {
      if (_.isEmpty(this.table)) {
        var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
            initData = this.defaultSequenceNoData;

        if (this.constructor.options.persist) {
          if (!_leapsStorage2['default'].hasTable(this.tableName)) {
            _leapsStorage2['default'].createTable(this.tableName);
          };

          if (!_leapsStorage2['default'].hasTable(sqTableName)) {
            _leapsStorage2['default'].createTable(sqTableName);
            _leapsStorage2['default'].persistence(sqTableName, [initData]);
          };

          // localStrageに存在すればそれをロードする
          LeapsDatabase.tables[this.tableName] = _leapsStorage2['default'].load()[this.tableName];
          LeapsDatabase.tables[sqTableName] = _leapsStorage2['default'].load()[sqTableName];
        } else {
          LeapsDatabase.tables[this.tableName] = [];
          LeapsDatabase.tables[sqTableName] = [initData];
        }
      };
    }
  }, {
    key: '__isNewRecord__',

    // 既に存在するレコードかどうかを調べる
    value: function __isNewRecord__(newRecord) {
      return _.isEmpty(this.findById(newRecord.__id));
    }
  }, {
    key: '__insert__',
    value: function __insert__(record) {
      record.__id = this.sequenceNo;
      this.table.push(record.toObject());
      this.__incrementSequence__(record);
      if (this.constructor.options.persist) this.__persistenceTable__();
      return true;
    }
  }, {
    key: '__update__',
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
    key: '__delete__',
    value: function __delete__(record) {
      var index = _.findIndex(this.table, { __id: record.__id });
      this.table.splice(index, 1);
      if (this.constructor.options.persist) this.__persistenceTable__();
      return true;
    }
  }, {
    key: '__persistenceTable__',
    value: function __persistenceTable__() {
      _leapsStorage2['default'].persistence(this.tableName, this.table);
    }
  }, {
    key: '__incrementSequence__',

    // シーケンス番号
    value: function __incrementSequence__(record) {
      var sqc = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
      sqc[0].sequenceNo = record.__id + 1;

      if (this.constructor.options.persist) {
        _leapsStorage2['default'].persistence(LeapsDatabase.sequenceTableName(this.tableName), sqc);
      }
    }
  }], [{
    key: 'selectAll',

    //***************** classMethods *****************//
    value: function selectAll(tableName) {
      return LeapsDatabase.tables[tableName];
    }
  }, {
    key: 'createDatabase',
    value: function createDatabase(options) {
      this.options = _.extend(this.defaultOptions(), options);

      console.log(_leapsStorage2['default']);
      // 初期化
      if (this.options.drop) _leapsStorage2['default'].clear(options.database);

      // 永続化するかどうか
      var storage = null;
      if (this.options.persist) {
        _leapsStorage2['default'].setUp(this.options.database);
        storage = _leapsStorage2['default'].load();
      } else {
        storage = {};
      };

      this.tables = storage;
    }
  }, {
    key: 'sequenceTableName',
    value: function sequenceTableName(tableName) {
      return tableName + 'Sequence';
    }
  }, {
    key: 'defaultOptions',
    value: function defaultOptions() {
      return {
        drop: false,
        persist: true
      };
    }
  }]);

  return LeapsDatabase;
})();

;
module.exports = LeapsDatabase;

},{"./leaps-criteria":1,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model":6,"./leaps-model-request":5,"./leaps-route":7,"./leaps-storage":8}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _leapsModel = require('./leaps-model');

var _leapsModel2 = _interopRequireDefault(_leapsModel);

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
    key: 'resolve',
    value: function resolve(value) {
      this._resolve(value);
    }
  }, {
    key: 'reject',
    value: function reject(reason) {
      this._reject(reason);
    }
  }]);

  return LeapsDeferred;
})();

;
module.exports = LeapsDeferred;

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-http-request":4,"./leaps-model":6,"./leaps-model-request":5,"./leaps-route":7,"./leaps-storage":8}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _leapsModel = require('./leaps-model');

var _leapsModel2 = _interopRequireDefault(_leapsModel);

var _leapsDeferred = require('./leaps-deferred');

var _leapsDeferred2 = _interopRequireDefault(_leapsDeferred);

var _leapsStorage = require('./leaps-storage');

var _leapsStorage2 = _interopRequireDefault(_leapsStorage);

var _leapsDatabase = require('./leaps-database');

var _leapsDatabase2 = _interopRequireDefault(_leapsDatabase);

var _leapsCriteria = require('./leaps-criteria');

var _leapsCriteria2 = _interopRequireDefault(_leapsCriteria);

var _leapsRoute = require('./leaps-route');

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

var _leapsModelRequest = require('./leaps-model-request');

// リクエスト周りの処理

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var LeapsHttpRequest = (function () {
  function LeapsHttpRequest() {
    _classCallCheck(this, LeapsHttpRequest);
  }

  _createClass(LeapsHttpRequest, null, [{
    key: 'setUp',
    value: function setUp(options) {
      this.options = _.extend(this.defaultOptions(), options || {});
    }
  }, {
    key: 'defaultOptions',
    value: function defaultOptions() {
      return {};
    }
  }, {
    key: 'setDefaultHeader',
    value: function setDefaultHeader(xhr) {
      _.each(this.options.defaultHeader, function (value, key) {
        xhr.setRequestHeader(key, value);
      });
      return xhr;
    }
  }, {
    key: 'index',
    value: function index(modelClass) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.__getRequest__("GET", modelClass, modelClass.routing().indexPath, options);
    }
  }, {
    key: 'show',
    value: function show(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.__getRequest__("GET", model, model.routing().showPath, options);
    }
  }, {
    key: 'update',
    value: function update(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.__sendRequest__("PUT", model, model.routing().updatePath, options);
    }
  }, {
    key: 'create',
    value: function create(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.__sendRequest__("POST", model, model.routing().createPath, options);
    }
  }, {
    key: 'delete',
    value: function _delete(model) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.__getRequest__("DELETE", model, model.routing().deletePath, options);
    }
  }, {
    key: 'xhrRequest',
    value: function xhrRequest(dataCast, callback) {
      var xhr = this.getXHRObject();
      var deferred = new _leapsDeferred2['default']();

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
    key: 'getXHRObject',
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
    key: '__sendRequest__',

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
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(model.toPostParams());
      });

      return deferred.promise;
    }
  }, {
    key: '__getRequest__',
    value: function __getRequest__(httpMethod, model, path, options) {
      var _this2 = this;

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
        xhr = _this2.setDefaultHeader(xhr);
        xhr.send();
      });

      return deferred.promise;
    }
  }]);

  return LeapsHttpRequest;
})();

;
module.exports = LeapsHttpRequest;

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-model":6,"./leaps-model-request":5,"./leaps-route":7,"./leaps-storage":8}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

// 直接親子関係には無いが、es6は多重継承をサポートしてないようなので
// 処理の切り分けのためにクラスを分けて記述する

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

var LeapsModelRequest = (function () {
  function LeapsModelRequest() {
    _classCallCheck(this, LeapsModelRequest);
  }

  _createClass(LeapsModelRequest, [{
    key: 'routing',

    //***************** instanceMethods *****************//
    value: function routing() {
      return new _leapsRoute2['default'](this, this.constructor.resourcePath());
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
  }], [{
    key: 'routing',

    //***************** classMethods *****************//
    value: function routing() {
      return new _leapsRoute2['default'](null, this.resourcePath());
    }
  }, {
    key: 'index',
    value: function index(options) {
      return _leapsHttpRequest2['default'].index(this, options);
    }
  }]);

  return LeapsModelRequest;
})();

module.exports = LeapsModelRequest;

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model":6,"./leaps-route":7,"./leaps-storage":8}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var LeapsModel = (function (_LeapsModelRequest) {
  _inherits(LeapsModel, _LeapsModelRequest);

  function LeapsModel(data) {
    _classCallCheck(this, LeapsModel);

    _get(Object.getPrototypeOf(LeapsModel.prototype), 'constructor', this).call(this);
    this.modelClass = this.constructor;

    // propertyとしてオブジェクトに生えるものと
    // recordとして保存されるオブジェクトを切り離したい
    this.__createProperties__(data);
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
      return modelList;
    }
  }, {
    key: 'destroyAll',
    value: function destroyAll() {
      return this.db().destroyAll();
    }
  }, {
    key: 'setUp',
    value: function setUp(options) {
      console.log(_leapsStorage2['default']);
      console.log(_leapsStorage2['default']);
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
})(_leapsModelRequest2['default']);

;
module.exports = LeapsModel;

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model-request":5,"./leaps-route":7,"./leaps-storage":8}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

var _leapsModelRequest = require('./leaps-model-request');

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var LeapsRoute = (function () {
  function LeapsRoute(model, pathString) {
    _classCallCheck(this, LeapsRoute);

    this.model = model;
    this.path = pathString;
  }

  _createClass(LeapsRoute, [{
    key: '__staticPath__',

    //***************** __privateMethods__ *****************//
    value: function __staticPath__() {
      return this.path.replace(/\{.+\}|\/\{.+\}/, "");
    }
  }, {
    key: '__dynamicPath__',
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
  }, {
    key: 'indexPath',
    get: function get() {
      return this.__staticPath__();
    }
  }, {
    key: 'showPath',
    get: function get() {
      return this.__dynamicPath__();
    }
  }, {
    key: 'updatePath',
    get: function get() {
      return this.__dynamicPath__();
    }
  }, {
    key: 'createPath',
    get: function get() {
      return this.__staticPath__();
    }
  }, {
    key: 'deletePath',
    get: function get() {
      return this.__dynamicPath__();
    }
  }]);

  return LeapsRoute;
})();

;
module.exports = LeapsRoute;

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model":6,"./leaps-model-request":5,"./leaps-storage":8}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _leapsModel = require('./leaps-model');

var _leapsModel2 = _interopRequireDefault(_leapsModel);

var _leapsDeferred = require('./leaps-deferred');

var _leapsDeferred2 = _interopRequireDefault(_leapsDeferred);

var _leapsHttpRequest = require('./leaps-http-request');

var _leapsHttpRequest2 = _interopRequireDefault(_leapsHttpRequest);

var _leapsDatabase = require('./leaps-database');

var _leapsDatabase2 = _interopRequireDefault(_leapsDatabase);

var _leapsCriteria = require('./leaps-criteria');

var _leapsCriteria2 = _interopRequireDefault(_leapsCriteria);

var _leapsRoute = require('./leaps-route');

var _leapsRoute2 = _interopRequireDefault(_leapsRoute);

var _leapsModelRequest = require('./leaps-model-request');

var _leapsModelRequest2 = _interopRequireDefault(_leapsModelRequest);

var LeapsStorage = (function () {
  function LeapsStorage() {
    _classCallCheck(this, LeapsStorage);
  }

  _createClass(LeapsStorage, null, [{
    key: 'clear',
    value: function clear(databaseName) {
      if (!_.isEmpty(localStorage[this.__storageName__(databaseName)])) {
        localStorage.removeItem(this.__storageName__(databaseName));
      };
    }
  }, {
    key: 'setUp',
    value: function setUp(databaseName) {
      this.storage = localStorage;
      this.appStorageName = this.__storageName__(databaseName);

      if (_.isEmpty(this.storage[this.appStorageName])) {
        // 初期化
        this.storage[this.appStorageName] = JSON.stringify({});
      };
    }
  }, {
    key: 'load',
    value: function load() {
      return JSON.parse(this.appStorage());
    }
  }, {
    key: 'hasTable',
    value: function hasTable(tableName) {
      return _.has(this.load(), tableName);
    }
  }, {
    key: 'createTable',
    value: function createTable(tableName) {
      this.persistence(tableName, []);
    }
  }, {
    key: 'appStorage',
    value: function appStorage() {
      return this.storage[this.appStorageName];
    }
  }, {
    key: 'persistence',
    value: function persistence(tableName, data) {
      var newStorage = this.load();
      newStorage[tableName] = data;

      this.storage[this.appStorageName] = JSON.stringify(newStorage);
    }
  }, {
    key: '__storageName__',

    //***************** __privateMethods__ *****************//
    value: function __storageName__(name) {
      return 'leapsStorage_' + name;
    }
  }]);

  return LeapsStorage;
})();

module.exports = LeapsStorage;

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model":6,"./leaps-model-request":5,"./leaps-route":7}],9:[function(require,module,exports){
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

window.LeapsModel = _leapsModel2['default'];

},{"./leaps-criteria":1,"./leaps-database":2,"./leaps-deferred":3,"./leaps-http-request":4,"./leaps-model":6,"./leaps-model-request":5,"./leaps-route":7,"./leaps-storage":8}]},{},[9]);
