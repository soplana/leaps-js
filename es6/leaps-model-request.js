// 直接親子関係には無いが、es6は多重継承をサポートしてないようなので
// 処理の切り分けのためにクラスを分けて記述する
class LeapsModelRequest extends LeapsCriteria {

//***************** instanceMethods *****************//
  routing() {
    return new LeapsRoute(this, this.constructor.resourcePath())
  };

  show() {
    return LeapsHttpRequest.show(this)
  };

  update() {
    return LeapsHttpRequest.update(this)
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

//***************** classMethods *****************//
  static routing() {
    return new LeapsRoute(null, this.resourcePath())
  };

  static index() {
    return LeapsHttpRequest.index(this)
  };
}
