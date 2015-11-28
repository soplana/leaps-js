import LeapsDatabase from  './leaps-database'

// 検索周りの処理をまとめたい
function LeapsCriteriaMixin(base = null){
  class LeapsCriteria extends base {
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
  return LeapsCriteria;
};
export default { mixin: LeapsCriteriaMixin }
