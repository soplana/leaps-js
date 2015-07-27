"use strict";

describe("leaps-model", function () {

  afterEach(function () {
    User.destroyAll();
  });

  describe("新規作成", function () {
    var user = null;

    beforeEach(function () {
      user = new User({ name: "aaa", age: 30, admin: true });
    });

    context("保存に成功すること", function () {
      it("save()", function () {
        expect(user.save()).to.be["true"];
      });
    });

    context("__idにシーケンス番号が割り当てられること", function () {
      var user2 = null;

      beforeEach(function () {
        user.save();
        user2 = new User({ name: "bbb", age: 35, admin: false });
        user2.save();
      });

      it("number型である", function () {
        expect(user.__id).to.be.a("number");
      });

      it("シーケンス番号がincrementされている", function () {
        expect(user2.__id).to.equal(user.__id + 1);
      });
    });
  });

  describe("一括保存", function () {
    var users = [],
        size = 10;

    beforeEach(function () {
      _.each(new Array(size), function (e, index) {
        users.push(new User({ name: "aaa" + index, age: 20 + index }));
      });

      User.insert(users);
    });

    context("保存に成功すること", function () {
      it("save()", function () {
        expect(User.all().length).to.equal(size);
      });
    });
  });

  describe("アップデート", function () {
    var user = null;

    beforeEach(function () {
      user = new User({ name: "aaa", age: 30, admin: true });
      user.save();
    });

    context("アップデートに成功すること", function () {
      var afterUser = null,
          afterName = "afterName";

      beforeEach(function () {
        user.name = afterName;
        user.__id = user.__id + 100;
        user.save();
        afterUser = User.find(user.__id);
      });

      it("save()", function () {
        expect(afterUser.name).to.equal(afterName);
      });

      it("シーケンス番号は上書きできないこと", function () {
        expect(afterUser.__id).to.equal(user.__id);
      });
    });
  });

  describe("削除", function () {
    var user = null,
        __id = null;

    beforeEach(function () {
      user = new User({ name: "aaa", age: 30, admin: true });
      user.save();
      __id = user.__id;
    });

    it("destroy => true", function () {
      expect(user.destroy()).to.be["true"];
    });

    context("削除されていること", function () {
      beforeEach(function () {
        user.destroy();
      });

      it("find => null", function () {
        expect(User.find(__id)).to.equal(null);
      });
    });
  });

  describe("一括削除", function () {
    var users = [],
        size = 10;

    beforeEach(function () {
      _.each(new Array(size), function (e, index) {
        users.push(new User({ name: "aaa" + index, age: 20 + index }));
      });

      User.insert(users);
      User.destroyAll();
    });

    context("保存に成功すること", function () {
      it("save()", function () {
        expect(User.all().length).to.equal(0);
      });
    });
  });
});