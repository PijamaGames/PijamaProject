class Gameobj {
  constructor(type, id, parent = null, scene = null, components = [], transform = null, isStatic = false) {
    Object.assign(this, {
      type,
      id,
      parent,
      scene,
      isStatic
    });
    this.key = this.type+this.id;
    this.selfActive = true;

    this.components = new Map();
    this.children = new Map();
    this.SetParent(this.parent);
    this.parentActive = this.parent == null || this.parent.active;
    let t;
    if(transform) t = transform;
    else t = new Transform();
    this.SetComponent(t);
    this.AddComponents(components);
    this.OnCreate();
  }

  OnCreate(){
    for(var [key, component] of this.components){
      component.OnCreate();
    }
  }

  get active(){
    return this.selfActive && this.parentActive && manager.scene == this.scene;
  }

  SetScene(scene, removeParent = true){
    if(scene == this.scene) return;

    for(var [key, value] of this.components){
      value.SetScene(scene);
    }

    if(this.parent == null){
      this.scene.RemoveGameobj(this);
    } else if(removeParent) {
      this.parent.RemoveChild(this);
    }

    this.scene = scene;
    if(removeParent || this.parent == null){
      if(this.isStatic){
        this.scene.AddStaticGameobj(this);
      } else {
        this.scene.AddGameobj(this);
      }
    }




    for(var [key, value] of this.children){
      value.SetScene(scene, false);
    }
  }

  SetActive(active){
    this.selfActive=active;

    for(var [key, component] of this.components){
      component.OnSetActive(active);
    }

    for (var [key, child] of this.children){
      child.SetParentActive(active);
    }
  }

  SetParentActive(active){
    this.parentActive = active;
    for (var [key, child] of this.children){
      child.SetParentActive(this.selfActive);
      for(var [key, component] of child.components){
        component.OnSetActive(active);
      }
    }
  }

  get bytecode(){
    let str = this.type+' '+this.transform.position.x+' '+this.transform.position.y+' '+this.transform.height;
    //if(!this.renderer || !this.renderer.vertical){
    str += ' ' + this.transform.scale.x + ' ' + this.transform.scale.y;
    //}
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
  RemoveChild(child){
    this.children.delete(child.key);
  }
  SetParent(parent) {
    if(this.parent != null){
      this.parent.RemoveChild(this);
    } else if (this.parent == null){
      this.scene.RemoveGameobj(this);
    }

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
    //Log("deleting " + this.type);

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
    //Log(this.scene);
    this.scene.RemoveGameobj(this);
    //this.scene = null;
  }
}
