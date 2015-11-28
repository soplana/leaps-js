export default class LeapsStorage {
  static clear(databaseName) {
    if(!_.isEmpty(localStorage[this.__storageName__(databaseName)])) {
      localStorage.removeItem(this.__storageName__(databaseName));
    };
  };

  static setUp(databaseName) {
    this.storage        = localStorage;
    this.appStorageName = this.__storageName__(databaseName);

    if(_.isEmpty(this.storage[this.appStorageName])) {
      // 初期化
      this.storage[this.appStorageName] = JSON.stringify({});
    };
  };

  static load() {
    return JSON.parse(this.appStorage())
  };

  static hasTable(tableName) {
    return _.has(this.load(), tableName)
  };

  static createTable(tableName) {
    this.persistence(tableName, []);
  };

  static appStorage() {
    return this.storage[this.appStorageName]
  };

  static persistence(tableName, data) {
    var newStorage        = this.load();
    newStorage[tableName] = data;

    this.storage[this.appStorageName] = JSON.stringify(newStorage);
  };

//***************** __privateMethods__ *****************//
  static __storageName__(name){ return `leapsStorage_${name}`}
}
