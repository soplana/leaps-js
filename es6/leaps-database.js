// DB
// そのうちlocalStrageとか使えるようにしたほうが便利かも
class LeapsDatabase {
  get sequenceNo() {
    return LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)][0].sequenceNo
  };

  get table() {
    return LeapsDatabase.tables[this.tableName]
  };

  get defaultSequenceNoData() {
    return {sequenceNo: 1}
  };

  constructor(tableName) {
    this.tableName = tableName;
    this.__createTables__();
  };

//***************** instanceMethods *****************//
  insert(record) {
    var returnFlag = false;
    try {
      if(this.__isNewRecord__(record)) {
        returnFlag = this.__insert__(record);
        if(returnFlag) record.__eventFire__("onSave");

      } else {
        returnFlag = this.__update__(record);
        if(returnFlag) record.__eventFire__("onChange");
      };

      return returnFlag;
    } catch(e) {
      console.log("insert error!");
      console.log(e);
      return false
    }
  };

  destroy(record) {
    try {
      var deleteTargetRecord = this.findById(record.__id);

      if(!_.isEmpty(deleteTargetRecord)) {
        var returnFlag = this.__delete__(deleteTargetRecord);
        if(returnFlag) record.__eventFire__("onDestroy");

        return returnFlag
      } else {
        return false
      }
    } catch(e) {
      console.log("delete error!");
      console.log(e);
      return false
    }
  };

  destroyAll() {
    try {
      var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
          initData    = this.defaultSequenceNoData;

      LeapsStorage.createTable(this.tableName);
      LeapsDatabase.tables[this.tableName] = [];

      LeapsStorage.persistence(sqTableName, [initData]);
      LeapsDatabase.tables[sqTableName]    = [initData];
      return true
    } catch(e) {
      console.log("delete error!");
      console.log(e);
      return false
    }
  };

  findById(__id) {
    return _.findWhere(this.table, {__id: __id})
  };

  where(conditions) {
    return _.where(this.table, conditions)
  };

//***************** classMethods *****************//
  static selectAll(tableName) {
    return LeapsDatabase.tables[tableName]
  };

  static createDatabase(options){
    this.options = _.extend(this.defaultOptions(), options);

    // 初期化
    if( this.options.drop ) LeapsStorage.clear(options.database);

    // 永続化するかどうか
    var storage = null;
    if(this.options.persist) {
      LeapsStorage.setUp(this.options.database);
      storage = LeapsStorage.load();
    } else {
      storage = {};
    };

    this.tables = storage;
  };

  static sequenceTableName(tableName) {
    return `${tableName}Sequence`
  };

  static defaultOptions() {
    return {
      drop:    false,
      persist: true
    }
  };

//***************** __privateMethods__ *****************//

  // tableの作成
  __createTables__() {
    if( _.isEmpty(this.table) ){
      var sqTableName = LeapsDatabase.sequenceTableName(this.tableName),
          initData    = this.defaultSequenceNoData;

      if(this.constructor.options.persist) {
        if( !LeapsStorage.hasTable(this.tableName) ){
          LeapsStorage.createTable(this.tableName);
        };

        if( !LeapsStorage.hasTable(sqTableName) ){
          LeapsStorage.createTable(sqTableName);
          LeapsStorage.persistence(sqTableName, [initData]);
        };

        // localStrageに存在すればそれをロードする
        LeapsDatabase.tables[this.tableName] = LeapsStorage.load()[this.tableName];
        LeapsDatabase.tables[sqTableName]    = LeapsStorage.load()[sqTableName];

      } else {
        LeapsDatabase.tables[this.tableName] = [];
        LeapsDatabase.tables[sqTableName]    = [initData];
      }
    };
  };

  // 既に存在するレコードかどうかを調べる
  __isNewRecord__(newRecord) {
    return _.isEmpty(this.findById(newRecord.__id))
  };

  __insert__(record) {
    record.__id                 = this.sequenceNo;
    this.table.push(record.toObject());
    this.__incrementSequence__(record);
    if(this.constructor.options.persist) this.__persistenceTable__();
    return true
  };

  __update__(record) {
    var updateTargetRecord = this.findById(record.__id);

    var index = _.findIndex(this.table, (data)=>{
      if(data.__id === updateTargetRecord.__id ) return true;
    })
    if(index === -1) return false;
    this.table[index] = record.toObject();

    if(this.constructor.options.persist) this.__persistenceTable__();
    return true
  };

  __delete__(record) {
    var index = _.findIndex( this.table, {__id: record.__id} );
    this.table.splice(index, 1);
    if(this.constructor.options.persist) this.__persistenceTable__();
    return true
  };

  __persistenceTable__() {
    LeapsStorage.persistence(this.tableName, this.table);
  };

  // シーケンス番号
  __incrementSequence__(record) {
    var sqc        = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
    sqc[0].sequenceNo = record.__id + 1;

    if(this.constructor.options.persist) {
      LeapsStorage.persistence(LeapsDatabase.sequenceTableName(this.tableName), sqc);
    }
  };
};
