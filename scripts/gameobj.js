class Gameobj {
  constructor(name, parent, scene, components = []) {
    Object.assign(this, {
      name,
      parent,
      scene
    });
    this.active = true;
    this.components = new Map();
    this.children = new Map();
    this.SetParent(this.parent);
    this.SetComponent(new Transform());
    this.AddComponents(components);
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
    this.children.set(child.name, child);
  }
  SetParent(parent) {
    this.parent = parent;
    if (!parent)
      this.scene.AddGameobj(this);
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

    //Destroy Children
    for (var [key,gameobj] of this.children) {
      gameobj.Destroy();
      this.children.delete(key);
    }

    //Destroy self
    this.scene.RemoveGameobj(this.name);
    this.scene = null;
  }
}
