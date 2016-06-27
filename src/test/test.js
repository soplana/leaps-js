(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _testModel = require('./test-model');

var _testModel2 = _interopRequireDefault(_testModel);

function eventTestRun() {
  var User = _testModel2["default"].User;
  var UserWithUpdate = _testModel2["default"].UserWithUpdate;

  describe("leaps-event", function () {

    // XHRをスタブ化する
    beforeEach(function () {
      var _this = this;

      this.xhr = sinon.useFakeXMLHttpRequest();
      this.requests = [];
      this.xhr.onCreate = function (xhr) {
        _this.requests.push(xhr);
      };
    });

    afterEach(function () {
      User.destroyAll();
      this.xhr.restore();
    });

    describe("onSave", function () {
      var user = null,
          index = 0;

      beforeEach(function () {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.onSave(function () {
          return index = 1;
        });
        user.save();
      });

      it("onSaveが実行されること", function () {
        return expect(index).to.equal(1);
      });

      context("contextが保持されていること", function () {
        var newValue = "newValue",
            context = { value: "oldValue" };

        beforeEach(function () {
          user = new User({ name: "aaa", age: 30, admin: true });
          user.onSave(function () {
            this.value = newValue;
          }, context);
          user.save();
        });

        it("contextの値が書き換わること", function () {
          return expect(context.value).to.equal(newValue);
        });
      });
    });

    describe("onChange", function () {
      var user = null,
          result = [];

      beforeEach(function () {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.onChange(function () {
          return result.push(1);
        });
        user.save();
      });

      it("onChangeが実行されないこと", function () {
        return expect(result.length).to.equal(0);
      });

      context("onChangeが実行されること", function () {
        beforeEach(function () {
          user.name = 'bbb';
          user.save();
        });

        it("実行される", function () {
          return expect(result.length).to.equal(1);
        });
      });

      context("onChangeが実行されること", function () {
        var user = null,
            result = [];

        beforeEach(function () {
          user = new User({ name: "aaa", age: 30, admin: true });
          user.onChange(function () {
            return result.push(1);
          });
          user.onChange(function () {
            return result.push(1);
          });
          user.save();

          user.name = "bbb";
          user.save();
        });

        it("複数個のEventが実行されること", function () {
          return expect(result.length).to.equal(2);
        });
      });
    });

    describe("onDestroy", function () {
      var user = null,
          result = null;

      beforeEach(function () {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.onDestroy(function () {
          return result = user.name;
        });
        user.save();
      });

      it("onDestroyが実行されないこと", function () {
        return expect(result).to.equal(null);
      });

      context("onChangeが実行されること", function () {
        beforeEach(function () {
          return user.destroy();
        });

        it("実行される", function () {
          return expect(result).to.equal(user.name);
        });
      });
    });

    describe("onInsert", function () {
      var users = [new User({ name: "a", age: 10, admin: true }), new User({ name: "b", age: 20, admin: true }), new User({ name: "c", age: 30, admin: true })],
          result = null;

      beforeEach(function () {
        User.onInsert(function () {
          return result = User.all().length;
        });
        User.insert(users);
      });

      it("onInsertが実行されること", function () {
        return expect(result).to.equal(users.length);
      });
    });

    describe("onDestroyAll", function () {
      var users = [new User({ name: "a", age: 10, admin: true }), new User({ name: "b", age: 20, admin: true }), new User({ name: "c", age: 30, admin: true })],
          result = null;

      beforeEach(function () {
        User.onDestroyAll(function () {
          return result = User.all().length;
        });
        User.insert(users);
      });

      it("onDestroyAllが実行されないこと", function () {
        return expect(result).to.equal(null);
      });

      context("onDestroyAllが実行されること", function () {
        beforeEach(function () {
          return User.destroyAll();
        });
        it("実行される", function () {
          return expect(result).to.equal(0);
        });
      });
    });

    describe('onIndex', function () {
      var users = [new User({ name: "a", age: 10, admin: true }), new User({ name: "b", age: 20, admin: true }), new User({ name: "c", age: 30, admin: true })],
          result = false;

      beforeEach(function () {
        User.onIndex(function () {
          return result = true;
        });
      });

      it("onIndexが実行されること", function (done) {
        User.index().then(function () {
          expect(result).to.be["true"];
          done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(users));
      });
    });

    describe('onShow', function () {
      var user = new User({ name: 'aa', age: 10 }),
          result = false;

      beforeEach(function () {
        user.onShow(function () {
          return result = true;
        });
      });

      it("onShowが実行されること", function (done) {
        user.show().then(function () {
          expect(result).to.be["true"];
          done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(user));
      });
    });

    describe('onUpdate', function () {
      var user = new User({ name: 'aa', age: 10 }),
          result = false;

      beforeEach(function () {
        user.onUpdate(function () {
          return result = true;
        });
      });

      it("onUpdateが実行されること", function (done) {
        user.update().then(function () {
          expect(result).to.be["true"];
          done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(user));
      });

      context('onUpdateをクラスで宣言する', function () {
        var user = new UserWithUpdate({ name: 'aa', age: 10 });

        it("onUpdateが実行されること", function (done) {
          user.update().then(function () {
            expect(user.result).to.be["true"];
            done();
          });
          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(user));
        });
      });
    });

    describe('onCreate', function () {
      var user = new User({ name: 'aa', age: 10 }),
          result = false;

      beforeEach(function () {
        user.onCreate(function () {
          return result = true;
        });
      });

      it("onCreateが実行されること", function (done) {
        user.create().then(function () {
          expect(result).to.be["true"];
          done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(user));
      });
    });

    describe('onDelete', function () {
      var user = new User({ name: 'aa', age: 10 }),
          result = false;

      beforeEach(function () {
        user.onDelete(function () {
          return result = true;
        });
      });

      it("onDeleteが実行されること", function (done) {
        user["delete"]().then(function () {
          expect(result).to.be["true"];
          done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(user));
      });
    });
  });
};

exports["default"] = { run: eventTestRun };
module.exports = exports["default"];

},{"./test-model":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _testModel = require('./test-model');

var _testModel2 = _interopRequireDefault(_testModel);

function modelTestRun() {
  var User = _testModel2['default'].User;
  var UserWithUpdate = _testModel2['default'].UserWithUpdate;

  describe('leaps-model', function () {

    afterEach(function () {
      User.destroyAll();
    });

    describe('新規作成', function () {
      var user = null;

      beforeEach(function () {
        user = new User({ name: "aaa", age: 30, admin: true });
      });

      context('保存に成功すること', function () {
        it('save()', function () {
          expect(user.save()).to.be['true'];
        });
      });

      context('__idにシーケンス番号が割り当てられること', function () {
        var user2 = null;

        beforeEach(function () {
          user.save();
          user2 = new User({ name: "bbb", age: 35, admin: false });
          user2.save();
        });

        it('number型である', function () {
          expect(user.__id).to.be.a("number");
        });

        it('シーケンス番号がincrementされている', function () {
          expect(user2.__id).to.equal(user.__id + 1);
        });
      });
    });

    describe('一括新規作成', function () {
      var users = null;

      beforeEach(function () {
        users = User.build([{ name: "aaa", age: 30, admin: true }, { name: "bbb", age: 31, admin: true }, { name: "ccc", age: 32, admin: true }]);
      });

      context('作成に成功すること', function () {
        it('save()', function () {
          expect(users.length).to.equal(3);
        });
      });
    });

    describe('一括保存', function () {
      var users = [],
          size = 10;

      beforeEach(function () {
        _.each(new Array(size), function (e, index) {
          users.push(new User({ name: 'aaa' + index, age: 20 + index }));
        });

        User.insert(users);
      });

      context('保存に成功すること', function () {
        it('save()', function () {
          expect(User.all().length).to.equal(size);
        });
      });
    });

    describe('アップデート', function () {
      var user = null;

      beforeEach(function () {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.save();
      });

      context('アップデートに成功すること', function () {
        var afterUser = null,
            afterName = "afterName";

        beforeEach(function () {
          user.name = afterName;
          user.__id = user.__id + 100;
          user.save();
          afterUser = User.find(user.__id);
        });

        it('save()', function () {
          expect(afterUser.name).to.equal(afterName);
        });

        it('シーケンス番号は上書きできないこと', function () {
          expect(afterUser.__id).to.equal(user.__id);
        });
      });
    });

    describe('削除', function () {
      var user = null,
          __id = null;

      beforeEach(function () {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.save();
        __id = user.__id;
      });

      it('destroy => true', function () {
        expect(user.destroy()).to.be['true'];
      });

      context('削除されていること', function () {
        beforeEach(function () {
          user.destroy();
        });

        it('find => null', function () {
          expect(User.find(__id)).to.equal(null);
        });
      });
    });

    describe('一括削除', function () {
      var users = [],
          size = 10;

      beforeEach(function () {
        _.each(new Array(size), function (e, index) {
          users.push(new User({ name: 'aaa' + index, age: 20 + index }));
        });

        User.insert(users);
        User.destroyAll();
      });

      context('削除に成功すること', function () {
        it('0件', function () {
          expect(User.all().length).to.equal(0);
        });
      });

      context('シーケンス番号も初期化されること', function () {
        var user = null;

        beforeEach(function () {
          user = new User({ name: 'aaa', age: 20 });
          user.save();
        });

        it('1が割り振られること', function () {
          expect(user.__id).to.equal(1);
        });
      });
    });
  });
};

exports['default'] = { run: modelTestRun };
module.exports = exports['default'];

},{"./test-model":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _testModel = require('./test-model');

var _testModel2 = _interopRequireDefault(_testModel);

function requestTestRun() {
  var User = _testModel2['default'].User;
  var UserWithUpdate = _testModel2['default'].UserWithUpdate;

  describe('leaps-request', function () {

    // XHRをスタブ化する
    beforeEach(function () {
      var _this = this;

      this.xhr = sinon.useFakeXMLHttpRequest();
      this.requests = [];
      this.xhr.onCreate = function (xhr) {
        _this.requests.push(xhr);
      };
    });

    afterEach(function () {
      User.destroyAll();
      this.xhr.restore();
    });

    describe('一覧取得リクエスト', function () {
      var response = [new User({ name: 'aa', age: 10 }), new User({ name: 'bb', age: 20 }), new User({ name: 'cc', age: 30 })];

      it("pathが正しいこと", function () {
        expect(User.routing().indexPath).to.equal("/users.json");
      });

      context('DBへの保存なし', function () {
        it("responseが正しいこと", function (done) {
          User.index().then(function (data) {
            expect(response.length).deep.equal(data.length);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function (done) {
          User.index().then(function (data) {
            expect(User.all().length).to.equal(0);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', function () {
        it("DBへの保存も同時に行えること", function (done) {
          User.index({ save: true }).then(function (data) {
            expect(User.all().length).to.equal(response.length);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });
    });

    describe('詳細取得リクエスト', function () {
      var user = new User({ name: 'aa', age: 10 }),
          response = user;

      it("pathが正しいこと", function () {
        expect(user.routing().showPath).to.equal("/users/aa.json");
      });

      context('DBへの保存なし', function () {
        it("responseが正しいこと", function (done) {
          user.show().then(function (data) {
            expect(response.name).to.equal(data.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function (done) {
          user.show().then(function (data) {
            expect(User.all().length).to.equal(0);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', function () {
        it("DBへの保存も同時に行えること", function (done) {
          user.show({ save: true }).then(function (data) {
            expect(User.find(data.__id).name).to.equal(response.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });
    });

    describe('新規作成リクエスト', function () {
      var response = new User({ name: 'aa', age: 10 });

      it("pathが正しいこと", function () {
        expect(User.routing().createPath).to.equal("/users.json");
      });

      context('DBへの保存なし', function () {
        it("responseが正しいこと", function (done) {
          new User(response).create().then(function (data) {
            expect(response.length).deep.equal(data.length);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function (done) {
          new User(response).create().then(function (data) {
            expect(User.all().length).to.equal(0);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', function () {
        it("DBへの保存も同時に行えること", function (done) {
          new User(response).create({ save: true }).then(function (data) {
            expect(User.all().length).to.equal(1);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });
    });

    describe('アップデートリクエスト', function () {
      var user = new User({ name: 'aa', age: 10 }),
          response = user;

      it("pathが正しいこと", function () {
        expect(user.routing().updatePath).to.equal("/users/aa.json");
      });

      context('DBへの保存なし', function () {
        it("responseが正しいこと", function (done) {
          user.update().then(function (data) {
            expect(response.name).to.equal(data.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function (done) {
          user.update().then(function (data) {
            expect(User.all().length).to.equal(0);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', function () {
        it("DBへの保存も同時に行えること", function (done) {
          user.update({ save: true }).then(function (data) {
            expect(User.find(data.__id).name).to.equal(response.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });
    });

    describe('削除リクエスト', function () {
      var user = new User({ name: 'aa', age: 10 }),
          response = user;

      it("pathが正しいこと", function () {
        expect(user.routing().deletePath).to.equal("/users/aa.json");
      });

      context('DBへの保存なし', function () {
        it("responseが正しいこと", function (done) {
          user['delete']().then(function (data) {
            expect(response.name).to.equal(data.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function (done) {
          user['delete']().then(function (data) {
            expect(User.all().length).to.equal(0);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });
    });

    describe('customResourceのテスト', function () {
      var user = new User({ name: 'aa', age: 10 }),
          response = user;

      context('testShow', function () {
        it("pathが正しいこと", function () {
          expect(user.routing().testShowPath).to.equal("/users/aa/test.json");
        });

        it("responseが正しいこと", function (done) {
          user.testShow().then(function (data) {
            expect(response.name).to.equal(data.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });

      context('testUpdate', function () {
        it("pathが正しいこと", function () {
          expect(user.routing().testUpdatePath).to.equal("/users/aa/test.json");
        });

        it("responseが正しいこと", function (done) {
          user.testUpdate().then(function (data) {
            expect(response.name).to.equal(data.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });

      context('testIndex', function () {
        it("pathが正しいこと", function () {
          expect(user.routing().testIndexPath).to.equal("/users/test.json");
        });

        it("responseが正しいこと", function (done) {
          user.testIndex().then(function (data) {
            expect(response.name).to.equal(data.name);
            done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
      });
    });
  });
};

exports['default'] = { run: requestTestRun };
module.exports = exports['default'];

},{"./test-model":5}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _leapsModelTest = require('./leaps-model-test');

var _leapsModelTest2 = _interopRequireDefault(_leapsModelTest);

var _leapsRequestTest = require('./leaps-request-test');

var _leapsRequestTest2 = _interopRequireDefault(_leapsRequestTest);

var _leapsEventTest = require('./leaps-event-test');

var _leapsEventTest2 = _interopRequireDefault(_leapsEventTest);

mocha.setup('bdd');

window.assert = chai.assert;
window.expect = chai.expect;
window.should = chai.should();

// テストで使用するDB設定
LeapsModel.setUp({
  database: "sampleModel",
  drop: true
});

_leapsModelTest2['default'].run();
_leapsRequestTest2['default'].run();
_leapsEventTest2['default'].run();

mocha.checkLeaks();
mocha.globals(['jQuery']);
mocha.run();

},{"./leaps-event-test":1,"./leaps-model-test":2,"./leaps-request-test":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User = (function (_LeapsModel) {
  _inherits(User, _LeapsModel);

  function User() {
    _classCallCheck(this, User);

    _get(Object.getPrototypeOf(User.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(User, null, [{
    key: "resource",
    value: function resource() {
      return "/users/{name}.json";
    }
  }, {
    key: "customResource",
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
  }, {
    key: "properties",
    value: function properties() {
      return {
        name: "",
        age: null,
        admin: false
      };
    }
  }]);

  return User;
})(LeapsModel);

;

var UserWithUpdate = (function (_User) {
  _inherits(UserWithUpdate, _User);

  function UserWithUpdate() {
    _classCallCheck(this, UserWithUpdate);

    _get(Object.getPrototypeOf(UserWithUpdate.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(UserWithUpdate, [{
    key: "afterUpdate",
    value: function afterUpdate() {
      this.result = true;
    }
  }], [{
    key: "resource",
    value: function resource() {
      return "/users/{name}.json";
    }
  }, {
    key: "properties",
    value: function properties() {
      return {
        name: "",
        age: null,
        admin: false
      };
    }
  }]);

  return UserWithUpdate;
})(User);

;

exports["default"] = { User: User, UserWithUpdate: UserWithUpdate };
module.exports = exports["default"];

},{}]},{},[4]);
