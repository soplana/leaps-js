import modelTest   from './leaps-model-test'
import requestTest from './leaps-request-test'
import eventTest   from './leaps-event-test'

mocha.setup('bdd');

window.assert = chai.assert;
window.expect = chai.expect;
window.should = chai.should();

// テストで使用するDB設定
LeapsModel.setUp({
  database: "sampleModel",
  drop:     true
});

modelTest.run();
requestTest.run();
eventTest.run();

mocha.checkLeaks();
mocha.globals(['jQuery']);
mocha.run();
