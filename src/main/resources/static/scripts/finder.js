var finder;
class Finder {
  constructor() {

  }

  FindObjectsWithBytecode(bytecode = ""){
    let objs = [];
    var lines = bytecode.match(/[^\r\n]+/g);
    Log(lines);
    if(lines == null) return objs;
    let obj;
    for(let line of lines){
      obj = this.FindObjectWithBytecode(line);
      if(obj != null){
        objs.push(obj);
      }
    }
    return objs;
  }

  FindObjectWithBytecode(bytecode = ""){
    if(bytecode == "") return null;
    let found = null;
    Log(bytecode);
    bytecode = bytecode.split(" ");
    let elems = [];
    for(let e of bytecode){
      if(e != ""){
        elems.push(e);
      }
    }
    Log(elems);
    let type = elems[0];
    let pos = new Vec2(elems[1], elems[2]);
    let height = elems[3];
    let scale = new Vec2(elems[4], elems[5]);
    let objs = this.FindObjectsByType(type);
    for(let obj of objs){
      if(obj.transform.GetWorldPos().Equals(pos)){
        if(obj.transform.height == height){
          if(elems[4]){
            if(obj.transform.scale.Equals(scale)){
              Log("found");
              found = obj;
              return found;
            }
          } else {
            Log("found");
            found = obj;
            return found;
          }
        }
      }
    }
    Log("not found");
    //let str = elems.join(" ");
    //Log("str: " + str);
    /*for (var [key, obj] of manager.scene.gameobjs) {

      //Log(("obj: "+obj.bytecode + " byt: " + bytecode + " comp: " + obj.bytecode == bytecode));
      //Log(obj.bytecode + " " + str);
      if (obj.bytecode === str) {
        Log("found");
        found = obj;
        return found;
      }
    }*/
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
