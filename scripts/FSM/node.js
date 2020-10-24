class Node{
  constructor(name, startCallback, updateCallback=null, exitCallback=null){
    Object.assign(this,{name, startCallback, updateCallback, exitCallback});

  }

  SetEdges(_edges){
    this.edges=_edges;
  }

  Start(){
    this.startCallback();
  }

  Update(){
    if(this.updateCallback)
      this.updateCallback();
  }

  Exit(){
    if (this.exitCallback)
      this.exitCallback();
  }

}
