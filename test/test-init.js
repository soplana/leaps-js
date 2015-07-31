"use strict"

mocha.setup('bdd');

var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

// テストで使用するDB設定
LeapsModel.setUp({
  database: "sampleModel",
  drop:     true
});

