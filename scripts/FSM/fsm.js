class FSM {
  constructor(nodes) {
    this.nodes = new Map();
    this.AddNodes(nodes);
    this.currentNode;

    for(let [key,node] of this.nodes){
      node.Create();
    }
  }

  Start(name) {
    this.currentNode = this.nodes.get(name);
    this.currentNode.Start();
    return this;
  }

  Update() {
    this.currentNode.Update();
    this.ChangeCurrentNode();
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
        console.log('Cambia de: ' + this.currentNode.name);
        this.currentNode = this.nodes.get(edge.destNode);
        console.log('A: ' + this.currentNode.name);
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
