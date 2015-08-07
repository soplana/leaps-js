"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var User = (function (_LeapsModel) {
  function User() {
    _classCallCheck(this, User);

    if (_LeapsModel != null) {
      _LeapsModel.apply(this, arguments);
    }
  }

  _inherits(User, _LeapsModel);

  _createClass(User, null, {
    resourcePath: {
      value: function resourcePath() {
        return "/users/{name}.json";
      }
    },
    properties: {
      value: function properties() {
        return {
          name: "",
          age: null,
          admin: false
        };
      }
    }
  });

  return User;
})(LeapsModel);

;

var UserWithUpdate = (function (_User) {
  function UserWithUpdate() {
    _classCallCheck(this, UserWithUpdate);

    if (_User != null) {
      _User.apply(this, arguments);
    }
  }

  _inherits(UserWithUpdate, _User);

  _createClass(UserWithUpdate, {
    afterUpdate: {
      value: function afterUpdate() {
        this.result = true;
      }
    }
  }, {
    resourcePath: {
      value: function resourcePath() {
        return "/users/{name}.json";
      }
    },
    properties: {
      value: function properties() {
        return {
          name: "",
          age: null,
          admin: false
        };
      }
    }
  });

  return UserWithUpdate;
})(User);

;