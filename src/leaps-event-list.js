export default class LeapsEventList extends Array {
  constructor() {
    super();
  };

  fire(eventName) {
    _.each(_.where(this, {eventName}), (eventObject)=>{
      if(!eventObject) return null;

      if(!!eventObject.context) {
        eventObject.eventFunction.call(eventObject.context)
      } else {
        eventObject.eventFunction.call()
      };
    });
  };
}
