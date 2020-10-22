class Node{
  constructor(name, edges, startCallback, updateCallback, exitCallback){
    Object.assign(this,{name, startCallback, updateCallback, exitCallback, edges});

  }

  SetEdges(_edges){
    this.edges=edges;
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
