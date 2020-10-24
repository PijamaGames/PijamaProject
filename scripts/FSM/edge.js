class Edge{
  constructor(destNode){
    Object.assign(this, {destNode});
    this.conditions = [];
  }

  AddCondition(callback){
    this.conditions.push(callback);
    return this;
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
