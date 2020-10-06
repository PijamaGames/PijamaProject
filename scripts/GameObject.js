class GameObject {

  constructor(_name, _parent, _scene, _components) {
    this.name = _name;
    this.active = true;
    this.children = new Map();
    this.components = new Map();
    this.scene = _scene;
    this.SetParent(_parent);

    this.AddComponents(_components);
  }

  Destroy() {
    console.log("deleting " + this.name);

    //Destroy _components
    for(var [key, component] of this.components){
      component.Destroy();
      this.components.delete(key);
    }

    //Destroy Children
    for (var [key,value] of this.children) {
      value.Destroy();
      this.children.delete(key);
    }

    //Destroy self
    this.scene.gameObjects.delete(this.name);
    this.scene = null;
  }

  Update() {
    if (!this.active) return;

    //console.log("Updating " + this.name);

    //Update components
    for(var [key, component] of this.components){
      component.Update();
    }

    //Update Children
    for (var [key,value] of this.children) {
      value.Update();
    }
  }

  CheckModelMat(parentModelMat, parentChanged) {
    //console.log("parent model mat of " + this.name + ": " + parentModelMat);
    var propagateModelMat;
    if (this.transform) {
      if (parentChanged || this.transform.changed) {
        glMatrix.mat4.multiply(this.transform.modelMat, parentModelMat, this.transform.GetLocalModelMat());
      }
      propagateModelMat = this.transform.modelMat;
    } else {
      propagateModelMat = parentModelMat;
    }

    for (var [key,value] of this.children) {
      value.CheckModelMat(propagateModelMat, this.transform.changed);
    }
    this.transform.changed = false;
  }

  AddComponents(components) {
    for (var c of components) this.SetComponent(c);
  }
  SetComponent(_component) {
    this.components.set(_component.type, _component);
    _component.SetGameObject(this);
  }

  AddChild(child) {
    this.children.set(child.name,child);

  }
  SetParent(parent) {
    this.parent = parent;
    if (!parent){
      this.scene.AddGameObject(this);
    }
    else{
      parent.AddChild(this);
    }

  }

  get transform() {
    return this.components.get('Transform');
  }
  get mesh(){
    return this.components.get('Mesh');
  }
}
