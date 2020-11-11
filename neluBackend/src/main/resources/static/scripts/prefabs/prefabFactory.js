class PrefabFactory{
  constructor(){
    this.prefabMapper = new Map();
  }

  AddPrototype(type, _scale, _anchor, _isStatic, prototypeFunc){
    if(_scale == null)
      _scale = new Vec2(1,1);
    if(_anchor == null)
      _anchor = new Vec2(0.5,0.5);

    this.prefabMapper.set(type, {
      count: 0,
      scale:_scale,
      anchor:_anchor,
      isStatic:_isStatic,
      GetPrototype: prototypeFunc
    });
  }

  ClearCounts(){
    for(var [key, value] of this.prefabMapper){
      value.count = 0;
    }
  }

  HasPrototype(type){
    return this.prefabMapper.has(type);
  }

  CreateObj(type, position = new Vec2(), height = 0.0, scale = null, id = null){
    let prefab = this.prefabMapper.get(type);

    scale = scale == null ? prefab.scale : scale;

    let obj = new Gameobj(type, id == null ? prefab.count : id, null, manager.scene, prefab.GetPrototype(),
      new Transform(position.Copy(), height, scale.Copy(), prefab.anchor.Copy()), prefab.isStatic);

    prefab.count++;
    return obj;
  }
}
prefabFactory = new PrefabFactory();
