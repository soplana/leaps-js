import { default as LeapsDeferred     }  from  './leaps-deferred'
import { default as LeapsHttpRequest  }  from  './leaps-http-request'
import { default as LeapsStorage      }  from  './leaps-storage'
import { default as LeapsDatabase     }  from  './leaps-database'
import { default as LeapsCriteria     }  from  './leaps-criteria'
import { default as LeapsRoute        }  from  './leaps-route'
import { default as LeapsModelRequest }  from  './leaps-model-request'

class LeapsModel extends LeapsModelRequest {
  constructor(data) {
    super();
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

  static destroyAll() {
    return this.db().destroyAll()
  };

  static setUp(options) {
    console.log(LeapsStorage)
    console.log(LeapsStorage)
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
module.exports = LeapsModel;
