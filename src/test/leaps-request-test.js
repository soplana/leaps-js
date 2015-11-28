import TestModel from './test-model'

function requestTestRun() {
  var User = TestModel.User;
  var UserWithUpdate = TestModel.UserWithUpdate;

  describe('leaps-request', ()=>{

    // XHRをスタブ化する
    beforeEach(function(){
      this.xhr      = sinon.useFakeXMLHttpRequest();
      this.requests = [];
      this.xhr.onCreate = (xhr)=>{
        this.requests.push(xhr);
      };
    });

    afterEach(function(){
      User.destroyAll();
      this.xhr.restore();
    });

    describe('一覧取得リクエスト', ()=>{
      var response = [
        new User({name: 'aa', age: 10}),
        new User({name: 'bb', age: 20}),
        new User({name: 'cc', age: 30})
      ];

      it("pathが正しいこと", function(){
        expect( User.routing().indexPath ).to.equal( "/users.json" )
      });

      context('DBへの保存なし', ()=>{
        it("responseが正しいこと", function(done){
          User.index().then((data)=>{
            expect( response.length ).deep.equal( data.length );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function(done){
          User.index().then((data)=>{
            expect( User.all().length ).to.equal( 0 );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', ()=>{
        it("DBへの保存も同時に行えること", function(done){
          User.index({save: true}).then((data)=>{
            expect( User.all().length ).to.equal( response.length );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });
    });

    describe('詳細取得リクエスト', ()=>{
      var user     = new User({name: 'aa', age: 10}),
          response = user;

      it("pathが正しいこと", function(){
        expect( user.routing().showPath ).to.equal( "/users/aa.json" )
      });

      context('DBへの保存なし', ()=>{
        it("responseが正しいこと", function(done){
          user.show().then((data)=>{
            expect( response.name ).to.equal( data.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function(done){
          user.show().then((data)=>{
            expect( User.all().length ).to.equal( 0 );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', ()=>{
        it("DBへの保存も同時に行えること", function(done){
          user.show({save: true}).then((data)=>{
            expect( User.find(data.__id).name ).to.equal( response.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });
    });


    describe('新規作成リクエスト', ()=>{
      var response = new User({name: 'aa', age: 10});

      it("pathが正しいこと", function(){
        expect( User.routing().createPath ).to.equal( "/users.json" )
      });

      context('DBへの保存なし', ()=>{
        it("responseが正しいこと", function(done){
          new User( response ).create().then((data)=>{
            expect( response.length ).deep.equal( data.length );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function(done){
          new User( response ).create().then((data)=>{
            expect( User.all().length ).to.equal( 0 );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', ()=>{
        it("DBへの保存も同時に行えること", function(done){
          new User( response ).create({save: true}).then((data)=>{
            expect( User.all().length ).to.equal( 1 );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });
    });


    describe('アップデートリクエスト', ()=>{
      var user     = new User({name: 'aa', age: 10}),
          response = user;

      it("pathが正しいこと", function(){
        expect( user.routing().updatePath ).to.equal( "/users/aa.json" )
      });

      context('DBへの保存なし', ()=>{
        it("responseが正しいこと", function(done){
          user.update().then((data)=>{
            expect( response.name ).to.equal( data.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function(done){
          user.update().then((data)=>{
            expect( User.all().length ).to.equal( 0 );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

      context('DBへの保存あり', ()=>{
        it("DBへの保存も同時に行えること", function(done){
          user.update({save: true}).then((data)=>{
            expect( User.find(data.__id).name ).to.equal( response.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });
    });


    describe('削除リクエスト', ()=>{
      var user     = new User({name: 'aa', age: 10}),
          response = user;

      it("pathが正しいこと", function(){
        expect( user.routing().deletePath ).to.equal( "/users/aa.json" )
      });

      context('DBへの保存なし', ()=>{
        it("responseが正しいこと", function(done){
          user.delete().then((data)=>{
            expect( response.name ).to.equal( data.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });

        it("DBに保存されていないこと", function(done){
          user.delete().then((data)=>{
            expect( User.all().length ).to.equal( 0 );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });
    });


    describe('customResourceのテスト', ()=>{
      var user     = new User({name: 'aa', age: 10}),
          response = user;

      context('testShow', ()=>{
        it("pathが正しいこと", function(){
          expect( user.routing().testShowPath ).to.equal( "/users/aa/test.json" )
        });

        it("responseが正しいこと", function(done){
          user.testShow().then((data)=>{
            expect( response.name ).to.equal( data.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

      context('testUpdate', ()=>{
        it("pathが正しいこと", function(){
          expect( user.routing().testUpdatePath ).to.equal( "/users/aa/test.json" )
        });

        it("responseが正しいこと", function(done){
          user.testUpdate().then((data)=>{
            expect( response.name ).to.equal( data.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

      context('testIndex', ()=>{
        it("pathが正しいこと", function(){
          expect( user.routing().testIndexPath ).to.equal( "/users/test.json" )
        });

        it("responseが正しいこと", function(done){
          user.testIndex().then((data)=>{
            expect( response.name ).to.equal( data.name );
            done();
          });

          this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(response));
        });
      });

    });

  });
};

export default { run: requestTestRun }
