class Node{
  constructor(name, startCallback, updateCallback, exitCallback, edges){
    Object.assign(this,{name, startCallback, updateCallback, exitCallback, edges});

  }

  Start(){
    this.startCallback();
  }

  Update(){
    this.updateCallback();
  }

  Exit(){
    this.exitCallback();
  }

}
