class User extends LeapsModel {
  static resource() {
    return "/users/{name}.json"
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

  static properties() {
    return {
      name:        "",
      age:         null,
      admin:       false
    }
  };
};

class UserWithUpdate extends User {
  static resource() {
    return "/users/{name}.json"
  };

  static properties() {
    return {
      name:        "",
      age:         null,
      admin:       false
    }
  };

  afterUpdate() {
    this.result = true
  };
};
