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
