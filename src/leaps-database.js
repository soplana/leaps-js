"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
    defaultSequenceNoData: {
      get: function () {
        return { sequenceNo: 1 };
      }
    },
    insert: {

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
    },
    destroy: {
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
    },
    destroyAll: {
      value: function destroyAll() {
        try {
          var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
              initData = this.defaultSequenceNoData;

          LeapsStorage.createTable(this.tableName);
          LeapsDatabase.tables[this.tableName] = [];

          LeapsStorage.persistence(sqTableName, [initData]);
          LeapsDatabase.tables[sqTableName] = [initData];
          return true;
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
              initData = this.defaultSequenceNoData;

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
        return true;
      }
    },
    __update__: {
      value: function __update__(record) {
        var updateTargetRecord = this.findById(record.__id);

        var index = _.findIndex(this.table, function (data) {
          if (data.__id === updateTargetRecord.__id) return true;
        });
        if (index === -1) {
          return false;
        }this.table[index] = record.toObject();

        if (this.constructor.options.persist) this.__persistenceTable__();
        return true;
      }
    },
    __delete__: {
      value: function __delete__(record) {
        var index = _.findIndex(this.table, { __id: record.__id });
        this.table.splice(index, 1);
        if (this.constructor.options.persist) this.__persistenceTable__();
        return true;
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