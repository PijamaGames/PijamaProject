var finder;
class Finder{
  constructor(){

  }

  FindObjectsByType(type){
    let objs = [];
    for(var [key, value] of manager.scene.gameobjs){
      if(value.type == type){
        objs.push(value);
      }
      this.FindChildrenByType(objs, type, value);
    }
    for(var [key, value] of manager.scene.staticGameobjs){
      if(value.type == type){
        objs.push(value);
      }
      this.FindChildrenByType(objs, type, value);
    }
    return objs;
  }
sa
  FindChildrenByType(objs, type, obj){
    for(var [key, value] of obj.children){
      if(value.type === type){
        objs.push(value);
        this.FindChildrenByType(type, value);
      }
    }
    return objs;
  }
}
