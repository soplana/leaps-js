import { default as LeapsModel        }  from  './leaps-model'
import { default as LeapsHttpRequest  }  from  './leaps-http-request'
import { default as LeapsStorage      }  from  './leaps-storage'
import { default as LeapsDatabase     }  from  './leaps-database'
import { default as LeapsCriteria     }  from  './leaps-criteria'
import { default as LeapsRoute        }  from  './leaps-route'
import { default as LeapsModelRequest }  from  './leaps-model-request'

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
module.exports = LeapsDeferred;
