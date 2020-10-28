class EventDispatcher{
  constructor(){
    this.listeners = new Set();
  }

  Dispatch(){
    for(let listener of this.listeners){
      listener.callback();
      if(listener.oneTime){
        listener.Remove();
      }
    }
  }

  AddListener(listener, callback, oneTime){
    return new EventListener(this, listener, callback, oneTime);
  }
}

class EventListener{
  constructor(dispatcher, listener, callback, oneTime = false){
    this.listener = listener;
    this.callback = callback;
    this.dispatcher = dispatcher;
    this.oneTime = oneTime;
    dispatcher.listeners.add(this);
  }

  Remove(){
    this.dispatcher.listeners.delete(this);
  }
}
