class FSM{
  constructor(nodes,startNodeName){
    this.nodes=new Map();
    this.AddNodes(nodes);
    this.currentNode;
    this.changed=false;
    this.Start(startNodeName);
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
    if(this.currentNode.edges){
      while(!this.changed && i<this.currentNode.edges.length){
        edge=this.currentNode.edges[i];
        if(edge.CheckConditions()){
          this.currentNode.Exit();
          console.log('Cambia de: '+this.currentNode.name);
          this.currentNode=edge.destNode;
          console.log('A: '+this.currentNode.name);
          this.currentNode.Start();
          this.changed=true;
        }
        i++;
      }
    }
    this.changed=false;

  }

  AddNodes(nodes) {
    for (var n of nodes)this.SetNode(n);
  }

  SetNode(node) {
    this.nodes.set(node.name, node);

  }

}
