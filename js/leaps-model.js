class LeapsDeferred {
  constructor() {
    this.promise = new Promise((resolve, reject)=>{
        this._resolve = resolve;
        this._reject  = reject;
    })
  };

  resolve(value) { this._resolve(value) };
  reject(reason) { this._reject(reason) };
};

// リクエスト周りの処理
class LeapsHttpRequest {
  static index(modelClass) {

    var deferred = this.xhrRequest(function(data){
      return _.map(data, (d)=>{return modelClass.castModel(d)});

    }, function(xhr){
      xhr.open("GET", modelClass.routing().indexPath);
      xhr.send()
    });

    return deferred.promise
  };

  static show(model, conditions) {

    var deferred = this.xhrRequest(function(data){
      return model.constructor.castModel(data);

    }, function(xhr){
      xhr.open("GET", model.routing().showPath);
      xhr.send()
    });

    return deferred.promise
  };

  static xhrRequest(dataCast, callback) {
    var xhr      = this.getXHRObject();
    var deferred = new LeapsDeferred();

    xhr.onreadystatechange = function (){
      if (xhr.readyState === 4) {
        if(xhr.status === 200){
          deferred.resolve(dataCast(JSON.parse(xhr.responseText)));
        } else {
          deferred.reject(xhr.responseText);
        }
      }
    };
    callback(xhr);

    return deferred
  };

  static getXHRObject(){
    try{ return new XMLHttpRequest() }catch(e){};
    try{ return new ActiveXObject('MSXML2.XMLHTTP.6.0') }catch(e){};
    try{ return new ActiveXObject('MSXML2.XMLHTTP.3.0') }catch(e){};
    try{ return new ActiveXObject('MSXML2.XMLHTTP')     }catch(e){};
    return null;
  };
};





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





// 検索周りの処理をまとめたい
class LeapsModelCriteria {
  static all() {
    var dataList = LeapsDatabase.selectAll(this.name);
    return _.map( dataList, (data)=>{return this.castModel(data)} )
  };

  static find(__id) {
    var record = this.db().findById(__id);
    return record ? this.castModel(record) : null
  };

  static where(conditions) {
    return _.map( this.db().where(conditions), (data)=>{return this.castModel(data)} )
  };
};




class LeapsRoute {
  constructor(model, pathString) {
    this.model = model;
    this.path  = pathString;
  };

  get indexPath() {
    return this.__staticPath__()
  };

  get showPath() {
    return this.__dynamicPath__()
  };

//***************** __privateMethods__ *****************//
  __staticPath__() {
    return this.path.replace(/\{.+\}|\/\{.+\}/, "")
  };

  __dynamicPath__() {
    return this.path.replace(/\{.+?\}/g, (match)=>{
      var keyName = match.replace(/\{|\}/g, "");
      if(_.has(this.model.toObject(), keyName)) {
        return this.model[keyName]
      } else {
        return null
      }
    })
  };
};



// 直接親子関係には無いが、es6は多重継承をサポートしてないようなので
// 処理の切り分けのためにクラスを分けて記述する
class LeapsModelRequest extends LeapsModelCriteria {

//***************** instanceMethods *****************//
  routing() {
    return new LeapsRoute(this, this.constructor.resourcePath())
  };

  show() {
    return LeapsHttpRequest.show(this)
  };

//***************** classMethods *****************//
  static routing() {
    return new LeapsRoute(null, this.resourcePath())
  };

  static index() {
    return LeapsHttpRequest.index(this)
  };
}





class LeapsModel extends LeapsModelRequest {
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

  toObject() {
    return this.__mergeProperties__({}, this)
  };

//***************** classMethods *****************//

  // 失敗時にロールバックする処理ほしい気がする
  static insert(modelList) {
    _.each(modelList, (d)=>{ d.save() });
    return modelList
  };

  static setUp() {
    LeapsDatabase.createDatabase();
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
        __id: null
      },
      this.modelClass.properties()
    )
  };
};

LeapsModel.setUp();
