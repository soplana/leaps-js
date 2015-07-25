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

//***************** classMethods *****************//
  static routing() {
    return new LeapsRoute(null, this.resourcePath())
  };

  static index() {
    return LeapsHttpRequest.index(this)
  };
}
