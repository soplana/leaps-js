"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapsModelEventInterface = (function () {
  function LeapsModelEventInterface() {
    _classCallCheck(this, LeapsModelEventInterface);
  }

  _createClass(LeapsModelEventInterface, {
    onSave: {
      // クエリEvent

      value: function onSave() {}
    },
    onChange: {
      value: function onChange(event, context) {}
    },
    onDestroy: {
      value: function onDestroy() {}
    },
    onDestroyAll: {
      value: function onDestroyAll() {}
    },
    onSelect: {
      value: function onSelect() {}
    },
    onShow: {

      // 通信Event

      value: function onShow() {}
    },
    onUpdate: {
      value: function onUpdate() {}
    },
    onCreate: {
      value: function onCreate() {}
    },
    onDelete: {
      value: function onDelete() {}
    }
  });

  return LeapsModelEventInterface;
})();