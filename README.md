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
    <script src='http://code.jquery.com/jquery-1.11.3.min.js'></script>
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
```
// 新規作成
var user = new SampleUserModel({name: "soplana"});
user.admin = false
user.save() // true

// 全件取得
SampleUserModel.all()   // [SampleUserModel]

// id指定で検索
SampleUserModel.find(1) // User {name: "soplana", admin: false, id: 1}

// アップデート
var user = SampleUserModel.find(1)
user.name = "fugafuga"
user.save() // true
SampleUserModel.find(1) // SampleUserModel {name: "fugafuga", admin: false, id: 1}

// 削除
var user = SampleUserModel.find(1)
user.destroy() // true
SampleUserModel.find(1) // null

// where検索
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
      id:          null,
      name:        "",
      age:         null,
      admin:       false
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

promise.then(function(data){ // [SampleUserModel, SampleUserModel, ..., SampleUserModel]
  console.log(data) // SampleUserModel

}).catch(function(error){
  console.log(error)

});
```
