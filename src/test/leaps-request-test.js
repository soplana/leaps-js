"use strict";

describe("leaps-request", function () {

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

  describe("一覧取得リクエスト", function () {
    var response = [new User({ name: "aa", age: 10 }), new User({ name: "bb", age: 20 }), new User({ name: "cc", age: 30 })];

    it("pathが正しいこと", function () {
      expect(User.routing().indexPath).to.equal("/users.json");
    });

    context("DBへの保存なし", function () {
      it("responseが正しいこと", function (done) {
        User.index().then(function (data) {
          expect(response.length).deep.equal(data.length);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });

      it("DBに保存されていないこと", function (done) {
        User.index().then(function (data) {
          expect(User.all().length).to.equal(0);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });

    context("DBへの保存あり", function () {
      it("DBへの保存も同時に行えること", function (done) {
        User.index({ save: true }).then(function (data) {
          expect(User.all().length).to.equal(response.length);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });
  });

  describe("詳細取得リクエスト", function () {
    var user = new User({ name: "aa", age: 10 }),
        response = user;

    it("pathが正しいこと", function () {
      expect(user.routing().showPath).to.equal("/users/aa.json");
    });

    context("DBへの保存なし", function () {
      it("responseが正しいこと", function (done) {
        user.show().then(function (data) {
          expect(response.name).to.equal(data.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });

      it("DBに保存されていないこと", function (done) {
        user.show().then(function (data) {
          expect(User.all().length).to.equal(0);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });

    context("DBへの保存あり", function () {
      it("DBへの保存も同時に行えること", function (done) {
        user.show({ save: true }).then(function (data) {
          expect(User.find(data.__id).name).to.equal(response.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });
  });

  describe("新規作成リクエスト", function () {
    var response = new User({ name: "aa", age: 10 });

    it("pathが正しいこと", function () {
      expect(User.routing().createPath).to.equal("/users.json");
    });

    context("DBへの保存なし", function () {
      it("responseが正しいこと", function (done) {
        new User(response).create().then(function (data) {
          expect(response.length).deep.equal(data.length);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });

      it("DBに保存されていないこと", function (done) {
        new User(response).create().then(function (data) {
          expect(User.all().length).to.equal(0);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });

    context("DBへの保存あり", function () {
      it("DBへの保存も同時に行えること", function (done) {
        new User(response).create({ save: true }).then(function (data) {
          expect(User.all().length).to.equal(1);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });
  });

  describe("アップデートリクエスト", function () {
    var user = new User({ name: "aa", age: 10 }),
        response = user;

    it("pathが正しいこと", function () {
      expect(user.routing().updatePath).to.equal("/users/aa.json");
    });

    context("DBへの保存なし", function () {
      it("responseが正しいこと", function (done) {
        user.update().then(function (data) {
          expect(response.name).to.equal(data.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });

      it("DBに保存されていないこと", function (done) {
        user.update().then(function (data) {
          expect(User.all().length).to.equal(0);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });

    context("DBへの保存あり", function () {
      it("DBへの保存も同時に行えること", function (done) {
        user.update({ save: true }).then(function (data) {
          expect(User.find(data.__id).name).to.equal(response.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });
  });

  describe("削除リクエスト", function () {
    var user = new User({ name: "aa", age: 10 }),
        response = user;

    it("pathが正しいこと", function () {
      expect(user.routing().deletePath).to.equal("/users/aa.json");
    });

    context("DBへの保存なし", function () {
      it("responseが正しいこと", function (done) {
        user["delete"]().then(function (data) {
          expect(response.name).to.equal(data.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });

      it("DBに保存されていないこと", function (done) {
        user["delete"]().then(function (data) {
          expect(User.all().length).to.equal(0);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });
  });

  describe("customResourceのテスト", function () {
    var user = new User({ name: "aa", age: 10 }),
        response = user;

    context("testShow", function () {
      it("pathが正しいこと", function () {
        expect(user.routing().testShowPath).to.equal("/users/aa/test.json");
      });

      it("responseが正しいこと", function (done) {
        user.testShow().then(function (data) {
          expect(response.name).to.equal(data.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });

    context("testUpdate", function () {
      it("pathが正しいこと", function () {
        expect(user.routing().testUpdatePath).to.equal("/users/aa/test.json");
      });

      it("responseが正しいこと", function (done) {
        user.testUpdate().then(function (data) {
          expect(response.name).to.equal(data.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });

    context("testIndex", function () {
      it("pathが正しいこと", function () {
        expect(user.routing().testIndexPath).to.equal("/users/test.json");
      });

      it("responseが正しいこと", function (done) {
        user.testIndex().then(function (data) {
          expect(response.name).to.equal(data.name);
          done();
        });

        this.requests[0].respond(200, { "Content-Type": "text/json" }, JSON.stringify(response));
      });
    });
  });
});