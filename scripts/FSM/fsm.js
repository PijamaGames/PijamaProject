class FSM{
  constructor(nodes){
    this.nodes=new Map();
    this.AddNodes(nodes);
    this.currentNode;
    this.changed=false;

  }

  Start(name){
    this.currentNode=this.nodes.get(name);
    this.currentNode.Start();
  }

  Update(){
    this.currentNode.Update();
    this.ChangeCurrentNode();

  }

  ChangeCurrentNode() {
    var i=0;
    var edge;
    while(!this.changed && i<this.currentNode.edges.length){
      edge=this.currentNode.edges[i];
      if(edge.CheckConditions()){
        this.currentNode.Exit();
        this.currentNode=edge.destNode;
        this.currentNode.Start();
        this.changed=true;
      }
      i++;
    }

  }

  AddNodes(nodes) {
    for (var n of nodes)this.SetNode(n);
  }

  SetNode(node) {
    this.nodes.set(node.name, node);

  }

}
