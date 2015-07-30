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
