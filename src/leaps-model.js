"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

// リクエスト周りの処理

var LeapsHttpRequest = (function () {
  function LeapsHttpRequest() {
    _classCallCheck(this, LeapsHttpRequest);
  }

  _createClass(LeapsHttpRequest, null, {
    index: {
      value: function index(modelClass) {

        var deferred = this.xhrRequest(function (data) {
          return _.map(data, function (d) {
            return modelClass.castModel(d);
          });
        }, function (xhr) {
          xhr.open("GET", modelClass.routing().indexPath);
          xhr.send();
        });

        return deferred.promise;
      }
    },
    show: {
      value: function show(model, conditions) {

        var deferred = this.xhrRequest(function (data) {
          return model.constructor.castModel(data);
        }, function (xhr) {
          xhr.open("GET", model.routing().showPath);
          xhr.send();
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

var LeapsStorage = (function () {
  function LeapsStorage() {
    _classCallCheck(this, LeapsStorage);
  }

  _createClass(LeapsStorage, null, {
    clear: {
      value: function clear(databaseName) {
        if (!_.isEmpty(localStorage[this.__storageName__(databaseName)])) {
          localStorage.removeItem(this.__storageName__(databaseName));
        };
      }
    },
    setUp: {
      value: function setUp(databaseName) {
        this.storage = localStorage;
        this.appStorageName = this.__storageName__(databaseName);

        if (_.isEmpty(this.storage[this.appStorageName])) {
          // 初期化
          this.storage[this.appStorageName] = JSON.stringify({});
        };
      }
    },
    load: {
      value: function load() {
        return JSON.parse(this.appStorage());
      }
    },
    hasTable: {
      value: function hasTable(tableName) {
        return _.has(this.load(), tableName);
      }
    },
    createTable: {
      value: function createTable(tableName) {
        this.persistence(tableName, []);
      }
    },
    appStorage: {
      value: function appStorage() {
        return this.storage[this.appStorageName];
      }
    },
    persistence: {
      value: function persistence(tableName, data) {
        var newStorage = this.load();
        newStorage[tableName] = data;

        this.storage[this.appStorageName] = JSON.stringify(newStorage);
      }
    },
    __storageName__: {

      //***************** __privateMethods__ *****************//

      value: function __storageName__(name) {
        return "leapsStorage_" + name;
      }
    }
  });

  return LeapsStorage;
})();

// DB
// そのうちlocalStrageとか使えるようにしたほうが便利かも

var LeapsDatabase = (function () {
  function LeapsDatabase(tableName) {
    _classCallCheck(this, LeapsDatabase);

    this.tableName = tableName;
    this.__createTables__();
  }

  _createClass(LeapsDatabase, {
    sequenceNo: {
      get: function () {
        return LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)][0].sequenceNo;
      }
    },
    table: {
      get: function () {
        return LeapsDatabase.tables[this.tableName];
      }
    },
    insert: {

      //***************** instanceMethods *****************//

      value: function insert(record) {
        try {
          if (this.__isNewRecord__(record)) {
            this.__insert__(record);
          } else {
            this.__update__(record);
          };
          return true;
        } catch (e) {
          console.log("insert error!");
          console.log(e);
          return false;
        }
      }
    },
    destroy: {
      value: function destroy(record) {
        try {
          var deleteTargetRecord = this.findById(record.__id);

          if (!_.isEmpty(deleteTargetRecord)) {
            this.__delete__(deleteTargetRecord);
            return true;
          } else {
            return false;
          }
        } catch (e) {
          console.log("delete error!");
          console.log(e);
          return false;
        }
      }
    },
    findById: {
      value: function findById(__id) {
        return _.findWhere(this.table, { __id: __id });
      }
    },
    where: {
      value: function where(conditions) {
        return _.where(this.table, conditions);
      }
    },
    __createTables__: {

      //***************** __privateMethods__ *****************//
      // tableの作成

      value: function __createTables__() {
        if (_.isEmpty(this.table)) {
          var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
              initData = { sequenceNo: 1 };

          if (this.constructor.options.persist) {
            if (!LeapsStorage.hasTable(this.tableName)) {
              LeapsStorage.createTable(this.tableName);
            };

            if (!LeapsStorage.hasTable(sqTableName)) {
              LeapsStorage.createTable(sqTableName);
              LeapsStorage.persistence(sqTableName, [initData]);
            };

            // localStrageに存在すればそれをロードする
            LeapsDatabase.tables[this.tableName] = LeapsStorage.load()[this.tableName];
            LeapsDatabase.tables[sqTableName] = LeapsStorage.load()[sqTableName];
          } else {
            LeapsDatabase.tables[this.tableName] = [];
            LeapsDatabase.tables[sqTableName] = [initData];
          }
        };
      }
    },
    __isNewRecord__: {

      // 既に存在するレコードかどうかを調べる

      value: function __isNewRecord__(newRecord) {
        return _.isEmpty(this.findById(newRecord.__id));
      }
    },
    __insert__: {
      value: function __insert__(record) {
        record.__id = this.sequenceNo;
        this.table.push(record.toObject());
        this.__incrementSequence__(record);
        if (this.constructor.options.persist) this.__persistenceTable__();
      }
    },
    __update__: {
      value: function __update__(record) {
        this.table[record.__id - 1] = record.toObject();
        if (this.constructor.options.persist) this.__persistenceTable__();
      }
    },
    __delete__: {
      value: function __delete__(record) {
        var index = _.findIndex(this.table, { __id: record.__id });
        this.table.splice(index, 1);
        if (this.constructor.options.persist) this.__persistenceTable__();
      }
    },
    __persistenceTable__: {
      value: function __persistenceTable__() {
        LeapsStorage.persistence(this.tableName, this.table);
      }
    },
    __incrementSequence__: {

      // シーケンス番号

      value: function __incrementSequence__(record) {
        var sqc = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
        sqc[0].sequenceNo = record.__id + 1;

        if (this.constructor.options.persist) {
          LeapsStorage.persistence(LeapsDatabase.sequenceTableName(this.tableName), sqc);
        }
      }
    }
  }, {
    selectAll: {

      //***************** classMethods *****************//

      value: function selectAll(tableName) {
        return LeapsDatabase.tables[tableName];
      }
    },
    createDatabase: {
      value: function createDatabase(options) {
        this.options = _.extend(this.defaultOptions(), options);

        // 初期化
        if (this.options.drop) LeapsStorage.clear(options.database);

        // 永続化するかどうか
        var storage = null;
        if (this.options.persist) {
          LeapsStorage.setUp(this.options.database);
          storage = LeapsStorage.load();
        } else {
          storage = {};
        };

        this.tables = storage;
      }
    },
    sequenceTableName: {
      value: function sequenceTableName(tableName) {
        return "" + tableName + "Sequence";
      }
    },
    defaultOptions: {
      value: function defaultOptions() {
        return {
          drop: false,
          persist: true
        };
      }
    }
  });

  return LeapsDatabase;
})();

;

// 検索周りの処理をまとめたい

var LeapsCriteria = (function () {
  function LeapsCriteria() {
    _classCallCheck(this, LeapsCriteria);
  }

  _createClass(LeapsCriteria, null, {
    all: {
      value: function all() {
        var _this = this;

        var dataList = LeapsDatabase.selectAll(this.name);
        return _.map(dataList, function (data) {
          return _this.castModel(data);
        });
      }
    },
    find: {
      value: function find(__id) {
        var record = this.db().findById(__id);
        return record ? this.castModel(record) : null;
      }
    },
    where: {
      value: function where(conditions) {
        var _this = this;

        return _.map(this.db().where(conditions), function (data) {
          return _this.castModel(data);
        });
      }
    }
  });

  return LeapsCriteria;
})();

;

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

// 直接親子関係には無いが、es6は多重継承をサポートしてないようなので
// 処理の切り分けのためにクラスを分けて記述する

var LeapsModelRequest = (function (_LeapsCriteria) {
  function LeapsModelRequest() {
    _classCallCheck(this, LeapsModelRequest);

    if (_LeapsCriteria != null) {
      _LeapsCriteria.apply(this, arguments);
    }
  }

  _inherits(LeapsModelRequest, _LeapsCriteria);

  _createClass(LeapsModelRequest, {
    routing: {

      //***************** instanceMethods *****************//

      value: function routing() {
        return new LeapsRoute(this, this.constructor.resourcePath());
      }
    },
    show: {
      value: function show() {
        return LeapsHttpRequest.show(this);
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
      value: function index() {
        return LeapsHttpRequest.index(this);
      }
    }
  });

  return LeapsModelRequest;
})(LeapsCriteria);

var LeapsModel = (function (_LeapsModelRequest) {
  function LeapsModel(data) {
    _classCallCheck(this, LeapsModel);

    this.modelClass = this.constructor;

    // propertyとしてオブジェクトに生えるものと
    // recordとして保存されるオブジェクトを切り離したい
    this.__createProperties__(data);
  }

  _inherits(LeapsModel, _LeapsModelRequest);

  _createClass(LeapsModel, {
    save: {

      //***************** instanceMethods *****************//

      value: function save() {
        return this.modelClass.db().insert(this);
      }
    },
    destroy: {
      value: function destroy() {
        return this.modelClass.db().destroy(this);
      }
    },
    toObject: {
      value: function toObject() {
        return this.__mergeProperties__({}, this);
      }
    },
    __createProperties__: {

      //***************** __privateMethods__ *****************//

      value: function __createProperties__(data) {
        this.__mergeProperties__(this, data);
      }
    },
    __mergeProperties__: {

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
    },
    __getProperties__: {

      // 内部的にpropertiesを参照するときはこれを使う

      value: function __getProperties__() {
        return _.extend({
          __id: null
        }, this.modelClass.properties());
      }
    }
  }, {
    insert: {

      //***************** classMethods *****************//

      // 失敗時にロールバックする処理ほしい気がする

      value: function insert(modelList) {
        _.each(modelList, function (d) {
          d.save();
        });
        return modelList;
      }
    },
    setUp: {
      value: function setUp(options) {
        LeapsDatabase.createDatabase(options);
      }
    },
    db: {
      value: function db() {
        if (_.isEmpty(this.table)) {
          this.table = new LeapsDatabase(this.name);
        };
        return this.table;
      }
    },
    castModel: {
      value: function castModel(data) {
        return new this(data);
      }
    },
    properties: {

      // overrideして使う

      value: function properties() {
        return {};
      }
    }
  });

  return LeapsModel;
})(LeapsModelRequest);

;