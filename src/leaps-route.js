export default class LeapsRoute {
  constructor(model, pathString, pathObject) {
    this.model       = model;
    this.pathString  = pathString;
    this.pathObject  = pathObject;

    if(!!this.pathObject) this.__createPathFunction__();
  };

  get indexPath() {
    return this.__staticPath__(this.pathString)
  };

  get showPath() {
    return this.__dynamicPath__(this.pathString)
  };

  get updatePath() {
    return this.__dynamicPath__(this.pathString)
  };

  get createPath() {
    return this.__staticPath__(this.pathString)
  };

  get deletePath() {
    return this.__dynamicPath__(this.pathString)
  };

//***************** __privateMethods__ *****************//
  __staticPath__(path) {
    return path.replace(/\{.+\}|\/\{.+\}/, "")
  };

  __dynamicPath__(path) {
    return path.replace(/\{.+?\}/g, (match)=>{
      var keyName = match.replace(/\{|\}/g, "");
      if(_.has(this.model.toObject(), keyName)) {
        return this.model[keyName]
      } else {
        return null
      }
    })
  };

  __createPathFunction__() {
    _.each(this.pathObject, (obj, functionName)=>{
      this.__defineGetter__(`${functionName}Path`, ()=>{
        return this.__dynamicPath__(obj.resource);
      })
    });
  };
};
