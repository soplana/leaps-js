"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapsModel = (function () {
  function LeapsModel(data) {
    _classCallCheck(this, LeapsModel);

    this.modelClass = this.constructor;

    // propertyとしてオブジェクトに生えるものと
    // recordとして保存されるオブジェクトを切り離したい
    this.__createProperties__(data);
  }

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
    getData: {
      value: function getData() {
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
          id: null
        }, this.modelClass.properties());
      }
    }
  }, {
    all: {

      //***************** classMethods *****************//

      value: function all() {
        var _this = this;

        var dataList = LeapsDatabase.selectAll(this.name);
        return _.map(dataList, function (data) {
          return _this.castModel(data);
        });
      }
    },
    find: {
      value: function find(id) {
        var record = this.db().findById(id);
        return record ? this.castModel(record) : null;
      }
    },
    setUp: {
      value: function setUp() {
        LeapsDatabase.createDatabase();
      }
    },
    where: {
      value: function where(conditions) {
        var _this = this;

        return _.map(this.db().where(conditions), function (data) {
          return _this.castModel(data);
        });
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
})();

;

var LeapsDatabase = (function () {
  function LeapsDatabase(tableName) {
    _classCallCheck(this, LeapsDatabase);

    this.tableName = tableName;
    this.__createTables__();
  }

  _createClass(LeapsDatabase, {
    sequenceNo: {
      get: function () {
        return LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)].sequenceNo;
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
          var deleteTargetRecord = this.findById(record.id);

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
      value: function findById(id) {
        return _.findWhere(this.table, { id: id });
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
          LeapsDatabase.tables[this.tableName] = [];
          LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)] = { sequenceNo: 1 };
        };
      }
    },
    __isNewRecord__: {

      // 既に存在するレコードかどうかを調べる

      value: function __isNewRecord__(newRecord) {
        return _.isEmpty(this.findById(newRecord.id));
      }
    },
    __insert__: {
      value: function __insert__(record) {
        record.id = this.sequenceNo;
        this.table[record.id - 1] = record.getData();
        this.__incrementSequence__(record);
      }
    },
    __update__: {
      value: function __update__(record) {
        this.table[record.id - 1] = record.getData();
      }
    },
    __delete__: {
      value: function __delete__(record) {
        var table = this.table;
        var index = _.findIndex(table, { id: record.id });
        table.splice(index, 1);
      }
    },
    __incrementSequence__: {

      // シーケンス番号

      value: function __incrementSequence__(record) {
        var sqc = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
        sqc.sequenceNo = record.id + 1;
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
      value: function createDatabase() {
        this.tables = {};
      }
    },
    sequenceTableName: {
      value: function sequenceTableName(tableName) {
        return "" + tableName + "Sequence";
      }
    }
  });

  return LeapsDatabase;
})();

;

LeapsModel.setUp();