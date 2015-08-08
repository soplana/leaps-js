// 直接親子関係には無いが、es6は多重継承をサポートしてないようなので
// 処理の切り分けのためにクラスを分けて記述する
class LeapsModelRequest extends LeapsModelEventInterface {
  constructor() {
    super();

    if(!!this.constructor.customResource) this.__createResoucesFunction__();
  };

//***************** instanceMethods *****************//
  routing() {
    return this.constructor.routing(this)
  };

  show(options) {
    return LeapsHttpRequest.show(this, options)
  };

  update(options) {
    return LeapsHttpRequest.update(this, options)
  };

  create(options) {
    return LeapsHttpRequest.create(this, options)
  };

  delete(options) {
    return LeapsHttpRequest.delete(this, options)
  };

  toPostParams() {
    var params = [];

    for(var key in this.toObject()){
      var value = this.toObject()[key],
          param = `${this.constructor.name}[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`;
      params.push(param);
    };

    return params.join('&').replace(/%20/g, '+');
  };

  toParams() {
    var params = [];

    for(var key in this.toObject()){
      var value = this.toObject()[key],
          param = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      params.push(param);
    };

    return params.join('&').replace(/%20/g, '+');
  };

//***************** __privateMethods__ *****************//

  // optionでカスタムPathが渡された場合、リクエスト送信用のfunctionの定義
  __createResoucesFunction__() {
    _.each(this.constructor.customResource(), (obj, functionName)=>{
      this[functionName] = function(options) {
        return LeapsHttpRequest.request(
          obj.method,
          this,
          this.routing()[`${functionName}Path`],
          options
        )
      }
    });
  };

//***************** classMethods *****************//
  static routing(model=null) {
    var resource       = {},
        customResource = {};

    if(!!this.resource)       resource = this.resource();
    if(!!this.customResource) customResource = this.customResource();

    return new LeapsRoute(model, resource, customResource);
  };

  static index(options) {
    return LeapsHttpRequest.index(this, options)
  };
}
