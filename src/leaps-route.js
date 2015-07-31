import { default as LeapsModel        }  from  './leaps-model'
import { default as LeapsDeferred     }  from  './leaps-deferred'
import { default as LeapsHttpRequest  }  from  './leaps-http-request'
import { default as LeapsStorage      }  from  './leaps-storage'
import { default as LeapsDatabase     }  from  './leaps-database'
import { default as LeapsCriteria     }  from  './leaps-criteria'
import { default as LeapsModelRequest }  from  './leaps-model-request'

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

  get updatePath() {
    return this.__dynamicPath__()
  };

  get createPath() {
    return this.__staticPath__()
  };

  get deletePath() {
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
module.exports = LeapsRoute;
