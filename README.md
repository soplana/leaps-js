## gulp
```
$ npm install
$ npm run watch
```

## Getting Started

```
<!DOCTYPE html>
<html>
  <head>
    <title>Leaps.js Sample</title>
    <script src='http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'></script>
    <script src='./src/leaps-model.js'></script>
  </head>
  <body></body>
</html>
```

## Tutorial

modelの作成
```
class SampleUserModel extends LeapsModel {
  static properties() {
    return {
      name:        "",
      age:         null,
      admin:       false
    }
  }
}
```

`setUp`を呼び出し、オプションをわたします。  
必須オプションは`database`のみです。DB名をわたします。
```
LeapsModel.setUp({database: "sample"})
```

他にはデータを永続化させるかどうかのオプションや、過去のデータを全て消去して新たにDBを作成するオプションがあります。
```
LeapsModel.setUp({
  database: "sample",
  persit:   false, // default true
  drop:     true,  // default false
})
```

データを作成してみます。  
保存されたデータはdefaultだとlocalStorageに保存されます。
```
var user = new SampleUserModel({name: "soplana"});
user.admin = false
user.save() // true
```

保存したデータを取得します。  
保存に成功した時点で`__id`というpropertyに自動でシーケンス番号が振られます。
```
// 全件取得
SampleUserModel.all()   // [SampleUserModel]

// id指定で検索
SampleUserModel.find(1) // User {name: "soplana", admin: false, id: 1}
```

アップデート
```
var user = SampleUserModel.find(1)
user.name = "fugafuga"
user.save() // true
SampleUserModel.find(1) // SampleUserModel {name: "fugafuga", admin: false, id: 1}
```

削除
```
var user = SampleUserModel.find(1)
user.destroy() // true
SampleUserModel.find(1) // null
```

一括削除
```
SampleUserModel.destroyAll()
SampleUserModel.all().length // 0
```

where検索も可能です。複数条件を渡すとand検索します。
```
new SampleUserModel({name: "a", age: 10}).save()
new SampleUserModel({name: "b", age: 10}).save()
new SampleUserModel({name: "c", age: 20}).save()
var users = SampleUserModel.where({age: 10})
users.length // 2
```

## Ajax Tutorial

## modelにresourceを定義する
```
class SampleUserModel extends LeapsModel {
  static resource() {
    return '/users/{id}.json'
  };

  static properties() {
    return {
      id:    null,
      name:  "",
      age:   null,
      admin: false
    }
  }
};
```

例えば共通のHttpHeaderとして`X-CSRF-Token`をRequestに含めたい場合は、`request: { defaultHeader: {...}}`オプションに設定します。
```
LeapsModel.setUp({
  database: 'sample',
  request: {
    defaultHeader: {
      'X-CSRF-Token' : $('meta[name="csrf-token"]').attr('content')
    }
  }
});
```

上記の例では`'/users/{id}.json'`の`{id}`のように、動的に変化するURLを定義します。
`{id}`はmodelオブジェクトにある同一名称のpropertyを利用し、エンドポイントを作成します。
リソースのエンドポイントを確認するには`.routing()`を呼び出します。

```
SampleUserModel().routing().indexPath // /users.json
```

### 一覧を取得する(getリクエスト)
```
SampleUserModel.index()
```

Promiseを使ってレスポンスを受け取る
```
var promise = SampleUserModel.index()

promise.then(function(data){ // [SampleUserModel, SampleUserModel, ..., SampleUserModel]
  // 受け取った情報を一括保存する
  SampleUserModel.insert(data);

}).catch(function(error){
  console.log(error)

});
```

レスポンスの受け取りに成功した場合、データを永続化さたい場合には`{save: true}`オプションを渡します。
```
var promise = SampleUserModel.index({save: true})

promise.then(function(data){
  SampleUserModel.all().length // n
})
```

### 単一のリソースを取得する(getリクエスト)
```
var user = new SampleUserModel({id: 1})
```

リソースのエンドポイントを確認
```
user.routing().showPath // /users/1.json
```

Promiseを使ってレスポンスを受け取る
```
var promise = user.show()

promise.then(function(data){
  ...
}).catch(function(error){
  ...
});
```

### リソースを作成する(postリクエスト)
```
var user = new SampleUserModel({id: 1, name: 'hoge'})
```

リソースのエンドポイントを確認
```
user.routing().createPath // /users.json
```

発行されるPOSTリクエストは、modelのpropertyがパラメータとして送信されます。
```
// パラメータ例
{
  SampleUserModel: {
    id:   "1",
    name: "hoge",
    age:  null
  }
}
```

Promiseを使ってレスポンスを受け取る
```
var promise = user.create()

promise.then(function(data){
  ...
}).catch(function(error){
  ...
});
```

### 単一のリソースに対するアップデート(putリクエスト)
```
var user = new SampleUserModel({id: 1})
user.name = "soplana"
user.age  = 99
```

リソースのエンドポイントを確認
```
user.routing().updatePath // /users/1.json
```

発行されるPUTリクエストは、modelのpropertyがパラメータとして送信されます。
```
// パラメータ例
{
  SampleUserModel: {
    id:   1,
    name: "soplana",
    age:  "99"
  }
}
```

Promiseを使ってレスポンスを受け取る
```
var promise = user.update()

promise.then(function(data){
  ...
}).catch(function(error){
  ...
});
```

## modelにcustom resourceを定義する

`resource`はRESTに対応するFunctionを自動で定義してくれますが、
customResourceを使用することで独自にエンドポイントを設定することが出来ます。
```
class SampleUserModel extends LeapsModel {
  static customResource() {
    return {
      testUpdate : {
        resource : "/users/{name}/test.json",
        method   : "PUT"
      },
      testShow : {
        resource : "/users/{name}/test.json",
        method   : "GET"
      },
      testIndex : {
        resource : "/users/test.json",
        method   : "GET"
      }
    }
  };

  static properties() {
    return {
      id:    null,
      name:  "",
      age:   null,
      admin: false
    }
  }
};
```

```
var user = new SampleUserModel({name: "abc"})
```

リソースのエンドポイントを確認
```
user.routing().testShowPath   // /users/abc/test.json
user.routing().testUpdatePath // /users/abc/test.json
user.routing().testIndexPath  // /users/test.json
```

リクエストを発行する
```
user.testShow()
user.testUpdate()
user.testIndex()
```

## Leaps Event
モデルの保存時や、HTTPレスポンスを受け取った時などに発火するEventを設定することが出来ます。Eventの種類は以下となります。

#### クエリ系Event
```
model.onSave(function,    context); // 新規レコード作成
model.onChange(function,  context); // アップデート
model.onDestroy(function, context); // 削除

Model.onInsert(function,  content);    // 一括保存
Model.onDestroyAll(function, context); // 一括削除
```

#### 通信系Event
通信Eventは成功時(HTTP STATUS CODE 200)に発火します。
```
model.onShow(function,    context);
model.onUpdate(function,  context);
model.onCreate(function,  context);
model.onDelete(function,  context);

Model.onIndex(function,   content);
```

## test

テストの実行はブラウザ上を想定します。テストの実態は`./src/test/`以下にあります。
```
$ open ./src/test/test.html
```
