"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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