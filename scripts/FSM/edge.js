class Edge{
  constructor(destNode, conditions){
    Object.assign(this, {destNode, conditions});
  }

  CheckConditions(){
    var i=0;
    var ready=true;
    while(ready && i<this.conditions.length){
      ready=this.conditions[i]();
      i++;
    }
    return ready;
  }
}
