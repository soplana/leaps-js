import { default as LeapsModel        }  from  './leaps-model'
import { default as LeapsDeferred     }  from  './leaps-deferred'
import { default as LeapsHttpRequest  }  from  './leaps-http-request'
import { default as LeapsStorage      }  from  './leaps-storage'
import { default as LeapsDatabase     }  from  './leaps-database'
import { default as LeapsRoute        }  from  './leaps-route'
import { default as LeapsModelRequest }  from  './leaps-model-request'

// 検索周りの処理をまとめたい
class LeapsCriteria {

  static all() {
    var dataList = LeapsDatabase.selectAll(this.name);
    return _.map(dataList, data => this.castModel(data))
  };

  static find(__id) {
    var record = this.db().findById(__id);
    return record ? this.castModel(record) : null
  };

  static where(conditions) {
    return _.map(this.db().where(conditions), data => this.castModel(data))
  };
};
module.exports = LeapsCriteria;
