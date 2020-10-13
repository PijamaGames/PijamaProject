class FSM{
  constructor(nodes){
    this.nodes=new Map();
    this.AddNodes(nodes);
    this.currentNode;
    this.changed=false;

  }

  Start(node){
    this.currentNode=node;
    this.currentNode.Start();
  }

  Update(){
    this.currentNode.Update();
    this.ChangeCurrentNode();

  }

  ChangeCurrentNode() {
    //version con while
    var i=0;
    while(!this.changed and i<this.currentNode.edges.length){
      edge=this.currentNode.edges[i];
      if(edge.CheckConditions()){
        this.currentNode.Exit();
        this.currentNode=edge.nodeDest;
        this.currentNode.Start();
        this.changed=true;
      }
      i++;
    }
    //version con foreach
    for(var edge of this.currentNode.edges){
      if(edge.CheckConditions()){
        this.currentNode.Exit();
        this.currentNode=edge.nodeDest;
        this.currentNode.Start();
        continue;
      }
    }

  }

  AddNodes(nodes) {
    for (var n of nodes)this.SetNode(n);
  }

  SetNode(node) {
    this.nodes.set(nodes.name, node);

  }

}
