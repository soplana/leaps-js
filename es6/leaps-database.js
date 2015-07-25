// DB
// そのうちlocalStrageとか使えるようにしたほうが便利かも
class LeapsDatabase {
  get sequenceNo() {
    return LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)].sequenceNo
  };

  get table() {
    return LeapsDatabase.tables[this.tableName]
  };

  constructor(tableName) {
    this.tableName = tableName;
    this.__createTables__();
  };

//***************** instanceMethods *****************//
  insert(record) {
    try {
      if( this.__isNewRecord__(record) ){
        this.__insert__(record);
      } else {
        this.__update__(record);
      };
      return true
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
        this.__delete__(deleteTargetRecord);
        return true
      } else {
        return false
      }
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

  static createDatabase(){
    this.tables = {};
  };

  static sequenceTableName(tableName) {
    return `${tableName}Sequence`
  };

//***************** __privateMethods__ *****************//
  // tableの作成
  __createTables__() {
    if( _.isEmpty(this.table) ){
      LeapsDatabase.tables[this.tableName] = [];
      LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)] =
        {sequenceNo: 1};
    };
  };

  // 既に存在するレコードかどうかを調べる
  __isNewRecord__(newRecord) {
    return _.isEmpty(this.findById(newRecord.__id))
  };

  __insert__(record) {
    record.__id                 = this.sequenceNo;
    this.table[record.__id - 1] = record.toObject();
    this.__incrementSequence__(record);
  };

  __update__(record) {
    this.table[record.__id - 1] = record.toObject();
  };

  __delete__(record) {
    var table = this.table;
    var index = _.findIndex( table, {__id: record.__id} );
    table.splice(index, 1);
  };

  // シーケンス番号
  __incrementSequence__(record) {
    var sqc        = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
    sqc.sequenceNo = record.__id + 1;
  };
};
