class SampleUserModel extends LeapsModel {
  static properties() {
    return {
      name:        "",
      age:         null,
      admin:       false
    }
  };

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
}
