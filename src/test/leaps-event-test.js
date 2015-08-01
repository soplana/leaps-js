"use strict";

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
        user.name = "bbb";
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

  describe("onIndex", function () {
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
      this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(users));
    });
  });

  describe("onShow", function () {
    var user = new User({ name: "aa", age: 10 }),
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
      this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(user));
    });
  });

  describe("onUpdate", function () {
    var user = new User({ name: "aa", age: 10 }),
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
      this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(user));
    });
  });

  describe("onCreate", function () {
    var user = new User({ name: "aa", age: 10 }),
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
      this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(user));
    });
  });

  describe("onDelete", function () {
    var user = new User({ name: "aa", age: 10 }),
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
      this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(user));
    });
  });
});