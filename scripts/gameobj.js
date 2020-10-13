class Gameobj {
  constructor(name, id, parent, scene, components = [], transform = null, isStatic = false) {
    Object.assign(this, {
      name,
      id,
      parent,
      scene,
      isStatic
    });
    this.key = this.name+this.id;
    this.active = true;
    this.components = new Map();
    this.children = new Map();
    this.SetParent(this.parent);
    let t;
    if(transform) t = transform;
    else t = new Transform();
    this.SetComponent(t);
    this.AddComponents(components);
  }

  get bytecode(){
    let str = this.name+' '+this.transform.position.x+' '+this.transform.position.y+' '+this.transform.height;
    if(!this.renderer.vertical){
      str += ' ' + this.transform.scale.x + ' ' + this.transform.scale.y
    }
    return str;
  }

  Update() {
    if (!this.active) return;

    //Update components
    for(var [key, component] of this.components){
      component.Update();
    }

    //Update Children
    for (var [key,gameobj] of this.children) {
      gameobj.Update();
    }
  }

  AddComponents(components) {
    for (var c of components)this.SetComponent(c);
  }
  SetComponent(_component) {
    this.components.set(_component.type, _component);
    _component.SetGameobj(this);
  }

  AddChild(child) {
    this.children.set(child.key, child);
  }
  SetParent(parent) {
    this.parent = parent;
    if (!parent)
      if(this.isStatic){
        this.scene.AddStaticGameobj(this);
      }
      else{
        this.scene.AddGameobj(this);
      }
    else
      parent.AddChild(this);
  }

  Destroy() {
    console.log("deleting " + this.name);

    //Destroy _components
    for(var [key, component] of this.components){
      component.Destroy();
      this.components.delete(key);
    }

    //Destroy colliderGroup
    //this.scene.colliderGroups.delete(this.colliderGroup);

    //Destroy Children
    for (var [key,gameobj] of this.children) {
      gameobj.Destroy();
      this.children.delete(key);
    }

    //Destroy self
    this.scene.RemoveGameobj(this);
    this.scene = null;
  }
}
