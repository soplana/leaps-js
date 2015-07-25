class LeapsModel {
  constructor(data) {
    this.modelClass = this.constructor;

    // propertyとしてオブジェクトに生えるものと
    // recordとして保存されるオブジェクトを切り離したい
    this.__createProperties__(data);
  };

//***************** instanceMethods *****************//
  save() {
    return this.modelClass.db().insert(this)
  };

  destroy() {
    return this.modelClass.db().destroy(this)
  };

  getData() {
    return this.__mergeProperties__({}, this)
  };

//***************** classMethods *****************//
  static all() {
    var dataList = LeapsDatabase.selectAll(this.name);
    return _.map( dataList, (data)=>{return this.castModel(data)} )
  };

  static find(id) {
    var record = this.db().findById(id);
    return record ? this.castModel(record) : null
  };

  static setUp() {
    LeapsDatabase.createDatabase();
  };

  static where(conditions) {
    return _.map( this.db().where(conditions), (data)=>{return this.castModel(data)} )
  };

  static db() {
    if(_.isEmpty(this.table)) {
      this.table = new LeapsDatabase(this.name);
    };
    return this.table
  };

  static castModel(data) {
    return new this(data)
  };

  // overrideして使う
  static properties() {
    return {}
  };

//***************** __privateMethods__ *****************//
  __createProperties__(data) {
    this.__mergeProperties__(this, data);
  };

  // propertyとして存在するものだけをコピーする
  __mergeProperties__(newData, originData) {
    _.each(originData, (value, key)=>{
      if( _.indexOf(_.keys(this.__getProperties__()), key) != -1 ) {
        newData[key] = value;
      };
    });
    return newData;
  };

  // 内部的にpropertiesを参照するときはこれを使う
  __getProperties__() {
    return _.extend(
      {
        id: null
      },
      this.modelClass.properties()
    )
  };
};

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
      return true;
    } catch(e) {
      console.log("insert error!");
      console.log(e);
      return false;
    }
  };

  destroy(record) {
    try {
      var deleteTargetRecord = this.findById(record.id)

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

  findById(id) {
    return _.findWhere(this.table, {id: id})
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
    return _.isEmpty(this.findById(newRecord.id))
  };

  __insert__(record) {
    record.id                 = this.sequenceNo;
    this.table[record.id - 1] = record.getData();
    this.__incrementSequence__(record);
  };

  __update__(record) {
    this.table[record.id - 1] = record.getData();
  };

  __delete__(record) {
    var table = this.table;
    var index = _.findIndex( table, {id: record.id} );
    table.splice(index, 1);
  };

  // シーケンス番号
  __incrementSequence__(record) {
    var sqc        = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
    sqc.sequenceNo = record.id + 1;
  };
};

LeapsModel.setUp();
