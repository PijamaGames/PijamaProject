var finder;
class Finder {
  constructor() {

  }

  FindObjectsWithBytecode(bytecode = ""){
    let objs = [];
    var lines = this.bytecode.match(/[^\r\n]+/g);
    let obj;
    for(line of lines){
      obj = this.FindObjectWithBytecode(line);
      if(obj != null){
        objs.push(obj);
      }
    }
    return objs;
  }

  FindObjectWithBytecode(bytecode = ""){
    let found = null;
    for (var [key, obj] of manager.scene.gameobjs) {
      if (obj.bytecode.Equals(bytecode)) {
        found = obj;
        return found;
      }
    }
    return found;
  }

  FindComponents(type) {
    let components = [];
    for (var [key, obj] of manager.scene.gameobjs) {
      if (obj.components.has(type)) {
        components.push(obj.components.get(type));
      }
      this.FindComponentsInChildren(components, type, obj);
    }
    for (var [key, obj] of manager.scene.staticGameobjs) {
      if (obj.components.has(type)) {
        components.push(obj.components.get(type));
      }
      this.FindComponentsInChildren(components, type, obj);
    }
    return components;
  }

  FindComponentsInChildren(components, type, parent) {
    for (var [key, obj] of parent.children) {
      if (obj.components.has(type)) {
        components.push(obj.components.get(type));
      }
      this.FindComponentsInChildren(components, type, obj);
    }
    return components;
  }

  FindObjectsByType(type) {
    let objs = [];
    for (var [key, value] of manager.scene.gameobjs) {
      if (value.type == type) {
        objs.push(value);
      }
      this.FindChildrenByType(objs, type, value);
    }
    for (var [key, value] of manager.scene.staticGameobjs) {
      if (value.type == type) {
        objs.push(value);
      }
      this.FindChildrenByType(objs, type, value);
    }
    return objs;
  }

  FindChildrenByType(objs, type, obj) {
    for (var [key, value] of obj.children) {
      if (value.type === type) {
        objs.push(value);
      }
      this.FindChildrenByType(objs, type, value);
    }
    return objs;
  }
}
