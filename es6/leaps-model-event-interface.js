class LeapsModelEventInterface extends LeapsCriteria {
  constructor() {
    this.eventList = new LeapsEventList();
  };


  // クエリEvent
  onSave(event,    context) {this.__addEvent__("onSave",    event, context)};
  onChange(event,  context) {this.__addEvent__("onChange",  event, context)};
  onDestroy(event, context) {this.__addEvent__("onDestroy", event, context)};


  // 通信Event
  onShow(event,   context) {this.__addEvent__("onShow",   event, context)};
  onUpdate(event, context) {this.__addEvent__("onUpdate", event, context)};
  onCreate(event, context) {this.__addEvent__("onCreate", event, context)};
  onDelete(event, context) {this.__addEvent__("onDelete", event, context)};


//***************** classMethods *****************//
  // クエリEvent
  static onDestroyAll(event, context) {this.__addClassEvent__("onDestroyAll", event, context)};
  static onInsert(event, context)     {this.__addClassEvent__("onInsert",     event, context)};

  // 通信Event
  static onIndex(event, context)      {this.__addClassEvent__("onIndex",      event, context)};

//***************** __privateMethods__ *****************//
  // class変数としてのeventListは区別する
  static __addClassEvent__(eventName, eventFunction, context) {
    if(!this.classEventList) {
      this.classEventList = new LeapsEventList();
    };
    this.classEventList.push({eventName, eventFunction, context});
  };

  // class変数としてのeventListは区別する
  __addEvent__(eventName, eventFunction, context) {
    this.eventList.push({eventName, eventFunction, context});
  };

  __eventFire__(eventName) {
    this.eventList.fire(eventName);
  };

  static __classEventFire__(eventName) {
    if(!!this.classEventList){
      this.classEventList.fire(eventName);
    }
  };
}
