class FSM {
  constructor(nodes) {
    this.nodes = new Map();
    this.AddNodes(nodes);
    this.currentNode;
    this.active = true;

    for(let [key,node] of this.nodes){
      node.Create();
    }
  }

  Start(name) {
    this.currentNode = this.nodes.get(name);
    this.currentNode.Start();
    return this;
  }

  Stop(){
    if(this.currentNode){
      this.currentNode.Exit();
    }
    return this;
  }

  Update() {
    if(this.active){
      this.currentNode.Update();
      this.ChangeCurrentNode();
    }
  }

  ChangeCurrentNode() {
    if (!this.currentNode.edges) return;

    let i = 0;
    let edge;
    let changed = false;
    while (!changed && i < this.currentNode.edges.length) {
      edge = this.currentNode.edges[i];
      if (edge.CheckConditions()) {
        this.currentNode.Exit();

        if(edge.Func != null){
          edge.Func();
        }
        //console.log('Cambia de: ' + this.currentNode.name);
        this.currentNode = this.nodes.get(edge.destNode);
        //console.log('A: ' + this.currentNode.name);
        this.currentNode.Start();
        changed = true;
      }
      i++;
    }
  }

  AddNodes(nodes) {
    for (var n of nodes) this.AddNode(n);
  }

  AddNode(node) {
    this.nodes.set(node.name, node);
  }

}
