class Node{
  constructor(name){

    Object.assign(this,{name});
    this.startCallback = null;
    this.updateCallback = null;
    this.exitCallback =  null;
    this.onCreateCallback = null;
  }

  SetOnCreate(callback){
    this.onCreateCallback = callback;
    return this;
  }

  SetStartFunc(callback){
    this.startCallback = callback;
    return this;
  }

  SetUpdateFunc(callback){
    this.updateCallback = callback;
    return this;
  }

  SetExitFunc(callback){
    this.exitCallback = callback;
    return this;
  }

  SetEdges(_edges){
    this.edges=_edges;
    return this;
  }

  Create(){
    if(this.onCreateCallback && this.onCreateCallback != null){
      this.onCreateCallback();
    }
  }

  Start(){
    if(this.startCallback && this.startCallback != null)
      this.startCallback();
    return this;
  }

  Update(){
    if(this.updateCallback && this.updateCallback != null)
      this.updateCallback();
    return this;
  }

  Exit(){
    if (this.exitCallback && this.exitCallback != null)
      this.exitCallback();
    return this;
  }

}
