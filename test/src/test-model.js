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
