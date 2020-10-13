class Edge{
  constructor(destNode, conditions){
    Object.assign(this, {destNode, conditions});
  }

  CheckConditions(){
    var i=0;
    var ready;
    while(ready && i<conditions.length){
      ready=conditions[i];
      i++;
    }
    return ready;
  }
}
