"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var SampleUserModel = (function (_LeapsModel) {
  function SampleUserModel() {
    _classCallCheck(this, SampleUserModel);

    if (_LeapsModel != null) {
      _LeapsModel.apply(this, arguments);
    }
  }

  _inherits(SampleUserModel, _LeapsModel);

  _createClass(SampleUserModel, null, {
    properties: {
      value: function properties() {
        return {
          name: "",
          age: null,
          admin: false
        };
      }
    },
    customResource: {
      value: function customResource() {
        return {
          testUpdate: {
            resource: "/users/{name}/test.json",
            method: "PUT"
          },
          testShow: {
            resource: "/users/{name}/test.json",
            method: "GET"
          },
          testIndex: {
            resource: "/users/test.json",
            method: "GET"
          }
        };
      }
    }
  });

  return SampleUserModel;
})(LeapsModel);