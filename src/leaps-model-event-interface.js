"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapsModelEventInterface = (function (_LeapsCriteria) {
  function LeapsModelEventInterface() {
    _classCallCheck(this, LeapsModelEventInterface);

    this.eventList = new LeapsEventList();
  }

  _inherits(LeapsModelEventInterface, _LeapsCriteria);

  _createClass(LeapsModelEventInterface, {
    onSave: {

      // クエリEvent

      value: function onSave(event, context) {
        this.__addEvent__("onSave", event, context);
      }
    },
    onChange: {
      value: function onChange(event, context) {
        this.__addEvent__("onChange", event, context);
      }
    },
    onDestroy: {
      value: function onDestroy(event, context) {
        this.__addEvent__("onDestroy", event, context);
      }
    },
    onShow: {

      // 通信Event

      value: function onShow(event, context) {
        this.__addEvent__("onShow", event, context);
      }
    },
    onUpdate: {
      value: function onUpdate(event, context) {
        this.__addEvent__("onUpdate", event, context);
      }
    },
    onCreate: {
      value: function onCreate(event, context) {
        this.__addEvent__("onCreate", event, context);
      }
    },
    onDelete: {
      value: function onDelete(event, context) {
        this.__addEvent__("onDelete", event, context);
      }
    },
    __addEvent__: {

      // class変数としてのeventListは区別する

      value: function __addEvent__(eventName, eventFunction, context) {
        this.eventList.push({ eventName: eventName, eventFunction: eventFunction, context: context });
      }
    },
    __eventFire__: {
      value: function __eventFire__(eventName) {
        var afterEvent = this[eventName.replace(/^on/, "after")];
        if (!!afterEvent) afterEvent.call(this);

        this.eventList.fire(eventName);
      }
    }
  }, {
    onDestroyAll: {

      //***************** classMethods *****************//
      // クエリEvent

      value: function onDestroyAll(event, context) {
        this.__addClassEvent__("onDestroyAll", event, context);
      }
    },
    onInsert: {
      value: function onInsert(event, context) {
        this.__addClassEvent__("onInsert", event, context);
      }
    },
    onIndex: {

      // 通信Event

      value: function onIndex(event, context) {
        this.__addClassEvent__("onIndex", event, context);
      }
    },
    __addClassEvent__: {

      //***************** __privateMethods__ *****************//
      // class変数としてのeventListは区別する

      value: function __addClassEvent__(eventName, eventFunction, context) {
        if (!this.classEventList) {
          this.classEventList = new LeapsEventList();
        };
        this.classEventList.push({ eventName: eventName, eventFunction: eventFunction, context: context });
      }
    },
    __classEventFire__: {
      value: function __classEventFire__(eventName) {
        if (!!this.classEventList) {
          this.classEventList.fire(eventName);
        }
      }
    }
  });

  return LeapsModelEventInterface;
})(LeapsCriteria);