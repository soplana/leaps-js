//=require leaps-deferred.js
//=require leaps-http-request.js
//=require leaps-storage.js
//=require leaps-database.js
//=require leaps-criteria.js
//=require leaps-route.js
//=require leaps-model-request.js

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

  static setUp(options) {
    LeapsDatabase.createDatabase(options);
    LeapsHttpRequest.setUp(options.request);
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
