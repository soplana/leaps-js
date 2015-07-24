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

  getData() {
    return this.__mergeProperties__({}, this)
  };

//***************** classMethods *****************//
  static all() {
    var dataList = LeapsDatabase.selectAll(this.name);
    return _.map( dataList, (data)=>{return this.castModel(data)} )
  };

  static find(id) {
    return this.castModel( this.db().findById(id) )
  };

  static setUp() {
    LeapsDatabase.createDatabase();
  };

  static where() {
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

  findById(id) {
    var table  = LeapsDatabase.tables[this.tableName];
    return _.findWhere(table, {id: id})
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
    if( _.isEmpty(LeapsDatabase.tables[this.tableName]) ){
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
    var table = LeapsDatabase.tables[this.tableName];

    record.id            = this.sequenceNo;
    table[record.id - 1] = record.getData();
    this.__incrementSequence__(record);
  };

  __update__(record) {
    var table = LeapsDatabase.tables[this.tableName];
    table[record.id - 1] = record.getData();
  };

  // シーケンス番号
  __incrementSequence__(record) {
    var sqc        = LeapsDatabase.tables[LeapsDatabase.sequenceTableName(this.tableName)];
    sqc.sequenceNo = record.id + 1;
  };
};

LeapsModel.setUp();
