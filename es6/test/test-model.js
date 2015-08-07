class User extends LeapsModel {
  static resourcePath() {
    return "/users/{name}.json"
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
  static resourcePath() {
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
