var finder;
class Finder {
  constructor() {

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
