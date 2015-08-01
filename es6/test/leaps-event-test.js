describe("leaps-event", ()=> {

  // XHRをスタブ化する
  beforeEach(function() {
    this.xhr      = sinon.useFakeXMLHttpRequest();
    this.requests = [];
    this.xhr.onCreate = (xhr)=>{
      this.requests.push(xhr);
    };
  });

  afterEach(function () {
    User.destroyAll();
    this.xhr.restore();
  });

  describe("onSave", ()=> {
    var user  = null,
        index = 0;

    beforeEach(()=> {
      user = new User({ name: "aaa", age: 30, admin: true });
      user.onSave(()=> index = 1);
      user.save();
    });

    it("onSaveが実行されること", ()=> expect(index).to.equal(1));

    context("contextが保持されていること", ()=> {
      var newValue = "newValue",
          context  = {value: "oldValue"};

      beforeEach(()=> {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.onSave(function(){ this.value = newValue }, context);
        user.save();
      });

      it("contextの値が書き換わること", ()=> expect(context.value).to.equal(newValue));
    });
  });

  describe("onChange", ()=> {
    var user   = null,
        result = [];

    beforeEach(()=> {
      user = new User({ name: "aaa", age: 30, admin: true });
      user.onChange(()=> result.push(1));
      user.save();
    });

    it("onChangeが実行されないこと", ()=> expect(result.length).to.equal(0));

    context("onChangeが実行されること", ()=> {
      beforeEach(()=> {
        user.name = 'bbb';
        user.save();
      });

      it("実行される", ()=> expect(result.length).to.equal(1));
    });

    context("onChangeが実行されること", ()=> {
      var user   = null,
          result = [];

      beforeEach(()=> {
        user = new User({ name: "aaa", age: 30, admin: true });
        user.onChange(()=> result.push(1));
        user.onChange(()=> result.push(1));
        user.save();

        user.name = "bbb";
        user.save();
      });

      it("複数個のEventが実行されること", ()=> expect(result.length).to.equal(2));
    });
  });

  describe("onDestroy", ()=> {
    var user   = null,
        result = null;

    beforeEach(function () {
      user = new User({ name: "aaa", age: 30, admin: true });
      user.onDestroy(()=> result = user.name);
      user.save();
    });

    it("onDestroyが実行されないこと", ()=> expect(result).to.equal(null));

    context("onChangeが実行されること", ()=> {
      beforeEach(()=> user.destroy());

      it("実行される", ()=> expect(result).to.equal(user.name));
    });
  });

  describe("onInsert", ()=> {
    var users = [
      new User({ name: "a", age: 10, admin: true }),
      new User({ name: "b", age: 20, admin: true }),
      new User({ name: "c", age: 30, admin: true })],
      result = null;

    beforeEach(()=> {
      User.onInsert(()=> result = User.all().length);
      User.insert(users);
    });

    it("onInsertが実行されること", ()=> expect(result).to.equal(users.length));
  });

  describe("onDestroyAll", ()=> {
    var users = [
      new User({ name: "a", age: 10, admin: true }),
      new User({ name: "b", age: 20, admin: true }),
      new User({ name: "c", age: 30, admin: true })],
      result = null;

    beforeEach(()=> {
      User.onDestroyAll(()=> result = User.all().length);
      User.insert(users);
    });

    it("onDestroyAllが実行されないこと", ()=> expect(result).to.equal(null));

    context("onDestroyAllが実行されること", ()=> {
      beforeEach(()=> User.destroyAll());
      it("実行される", ()=> expect(result).to.equal(0));
    });
  });

  describe('onIndex', ()=> {
    var users = [
      new User({ name: "a", age: 10, admin: true }),
      new User({ name: "b", age: 20, admin: true }),
      new User({ name: "c", age: 30, admin: true })],
      result = false;

    beforeEach(()=> {
      User.onIndex(()=> result = true);
    });

    it("onIndexが実行されること", function(done){
      User.index().then(()=>{
        expect( result ).to.be.true;
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(users));
    });
  });

  describe('onShow', ()=>{
    var user   = new User({name: 'aa', age: 10}),
        result = false;

    beforeEach(()=> {
      user.onShow(()=> result = true);
    });

    it("onShowが実行されること", function(done){
      user.show().then(()=>{
        expect( result ).to.be.true;
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(user));
    });
  });

  describe('onUpdate', ()=>{
    var user   = new User({name: 'aa', age: 10}),
        result = false;

    beforeEach(()=> {
      user.onUpdate(()=> result = true);
    });

    it("onUpdateが実行されること", function(done){
      user.update().then(()=>{
        expect( result ).to.be.true;
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(user));
    });
  });

  describe('onCreate', ()=>{
    var user   = new User({name: 'aa', age: 10}),
        result = false;

    beforeEach(()=> {
      user.onCreate(()=> result = true);
    });

    it("onCreateが実行されること", function(done){
      user.create().then(()=>{
        expect( result ).to.be.true;
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(user));
    });
  });

  describe('onDelete', ()=>{
    var user   = new User({name: 'aa', age: 10}),
        result = false;

    beforeEach(()=> {
      user.onDelete(()=> result = true);
    });

    it("onDeleteが実行されること", function(done){
      user.delete().then(()=>{
        expect( result ).to.be.true;
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(user));
    });
  });

});
