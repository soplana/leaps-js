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

```
// 新規作成
var user = new SampleUserModel({name: "soplana"});
user.admin = false
user.save() //=> true

// 全件取得
SampleUserModel.all()   // [SampleUserModel]

// id指定で検索
SampleUserModel.find(1) // User {name: "soplana", admin: false, id: 1}

// アップデート
var user = SampleUserModel.find(1)
user.name = "fugafuga"
user.save() //=> true
SampleUserModel.find(1) // SampleUserModel {name: "fugafuga", admin: false, id: 1}
```
