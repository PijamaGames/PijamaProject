class Node{
  constructor(name, startCallback, updateCallback, exitCallback){
    Object.assign(this,{name, startCallback, updateCallback, exitCallback});

  }

  SetEdges(_edges){
    this.edges=_edges;
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
