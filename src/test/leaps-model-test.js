import TestModel from './test-model'

function modelTestRun() {
  var User = TestModel.User;
  var UserWithUpdate = TestModel.UserWithUpdate;

  describe('leaps-model', ()=> {

    afterEach(()=>{
      User.destroyAll()
    });


    describe('新規作成', ()=>{
      var user = null;

      beforeEach(()=>{
        user = new User({name: "aaa", age: 30, admin: true})
      });

      context('保存に成功すること', ()=> {
        it('save()', ()=>{
          expect( user.save() ).to.be.true
        });
      });

      context('__idにシーケンス番号が割り当てられること', ()=>{
        var user2 =  null;

        beforeEach(()=>{
          user.save()
          user2 = new User({name: "bbb", age: 35, admin: false})
          user2.save()
        });

        it('number型である', ()=>{
          expect( user.__id ).to.be.a( "number" )
        });

        it('シーケンス番号がincrementされている', ()=>{
          expect( user2.__id ).to.equal( user.__id+1 )
        });
      });
    });

    describe('一括新規作成', ()=>{
      var users = null;

      beforeEach(()=>{
        users = User.build([
          {name: "aaa", age: 30, admin: true},
          {name: "bbb", age: 31, admin: true},
          {name: "ccc", age: 32, admin: true}
        ])
      });

      context('作成に成功すること', ()=> {
        it('save()', ()=>{
          expect( users.length ).to.equal( 3 )
        });
      });
    })

    describe('一括保存', ()=>{
      var users = [],
          size  = 10;

      beforeEach(()=>{
        _.each(new Array(size), (e, index)=>{
          users.push( new User({name: `aaa${index}`, age: 20+index}) )
        });

        User.insert(users);
      });

      context('保存に成功すること', ()=> {
        it('save()', ()=>{
          expect( User.all().length ).to.equal( size )
        });
      });
    });


    describe('アップデート', ()=>{
      var user = null;

      beforeEach(()=>{
        user = new User({name: "aaa", age: 30, admin: true})
        user.save()
      });

      context('アップデートに成功すること', ()=> {
        var afterUser  = null,
            afterName  = "afterName";

        beforeEach(()=>{
          user.name  = afterName;
          user.__id  = user.__id + 100
          user.save();
          afterUser = User.find(user.__id);
        });

        it('save()', ()=>{
          expect( afterUser.name ).to.equal( afterName )
        });

        it('シーケンス番号は上書きできないこと', ()=>{
          expect( afterUser.__id ).to.equal( user.__id )
        });
      });
    });


    describe('削除', ()=>{
      var user = null,
          __id = null;

      beforeEach(()=>{
        user = new User({name: "aaa", age: 30, admin: true})
        user.save()
        __id = user.__id;
      });

      it('destroy => true', ()=>{
        expect( user.destroy() ).to.be.true
      });

      context('削除されていること', ()=> {
        beforeEach(()=>{ user.destroy() });

        it('find => null', ()=>{
          expect( User.find(__id) ).to.equal( null )
        });
      });
    });


    describe('一括削除', ()=>{
      var users = [],
          size  = 10;

      beforeEach(()=>{
        _.each(new Array(size), (e, index)=>{
          users.push( new User({name: `aaa${index}`, age: 20+index}) )
        });

        User.insert(users);
        User.destroyAll();
      });

      context('削除に成功すること', ()=> {
        it('0件', ()=>{
          expect( User.all().length ).to.equal( 0 )
        });
      });

      context('シーケンス番号も初期化されること', ()=> {
        var user = null;

        beforeEach(()=>{
          user = new User({name: 'aaa', age: 20})
          user.save()
        });

        it('1が割り振られること', ()=>{
          expect( user.__id ).to.equal( 1 )
        });
      });
    });

  });
};

export default { run: modelTestRun }
