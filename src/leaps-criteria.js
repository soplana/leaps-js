"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// 検索周りの処理をまとめたい

var LeapsCriteria = (function () {
  function LeapsCriteria() {
    _classCallCheck(this, LeapsCriteria);
  }

  _createClass(LeapsCriteria, null, {
    all: {
      value: function all() {
        var _this = this;

        var dataList = LeapsDatabase.selectAll(this.name);
        return _.map(dataList, function (data) {
          return _this.castModel(data);
        });
      }
    },
    find: {
      value: function find(__id) {
        var record = this.db().findById(__id);
        return record ? this.castModel(record) : null;
      }
    },
    where: {
      value: function where(conditions) {
        var _this = this;

        return _.map(this.db().where(conditions), function (data) {
          return _this.castModel(data);
        });
      }
    }
  });

  return LeapsCriteria;
})();

;