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
    <script src='./out/leaps-model.js'></script>
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

つかう
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

データを作成してみます。保存されたデータはdefaultだとlocalStorageに保存されます。
```
var user = new SampleUserModel({name: "soplana"});
user.admin = false
user.save() // true
```

保存したデータを取得します。保存に成功した時点で`__id`というpropertyに自動でシーケンス番号が振られます。
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

where検索も可能です。複数条件を渡すとand検索します。
```
new SampleUserModel({name: "a", age: 10}).save()
new SampleUserModel({name: "b", age: 10}).save()
new SampleUserModel({name: "c", age: 20}).save()
var users = SampleUserModel.where({age: 10})
users.length // 2
```

## Ajax Tutorial

### modelにresourceを定義する
```
class SampleUserModel extends LeapsModel {
  static resourcePath() {
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

### 単一のリソースを取得する(getリクエスト)
```
var user = new SampleUserModel({id: 1})
```

リソースのエンドポイントを確認
```
user.routing().indexPath // /users/1.json
```

Promiseを使ってレスポンスを受け取る
```
var promise = user.show()

promise.then(function(data){
  console.log(data) // SampleUserModel

}).catch(function(error){
  console.log(error)

});
```
