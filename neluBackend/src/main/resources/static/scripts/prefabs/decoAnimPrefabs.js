
prefabFactory.AddPrototype("Tree", new Vec2(6,6), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('tree', new Vec2(0, 0),new Vec2(6,6), true, 1, [0], 8, true),
  ]
});

prefabFactory.AddPrototype("Bush", new Vec2(2,2), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('bush', new Vec2(0, 0),new Vec2(2,2), true, 1, [0], 8, true),
  ]
});

var waterFPS=4;
prefabFactory.AddPrototype("WaterBottom", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterbottom', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterBottomLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterbottomleft', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterBottomRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterbottomright', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterleft', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterOuterBottomLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterouterbottonleft', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterOuterBottomRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterouterbottomright', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterOuterTopLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('wateroutertopleft', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterOuterTopRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('wateroutertopright', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('waterright', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterTop", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('watertop', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterTopLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('watertopleft', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("WaterTopRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('watertopright', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("Water1", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('water1', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("Water2", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('water2', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
prefabFactory.AddPrototype("Water3", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('water3', new Vec2(0, 0),new Vec2(1,1), true, 1, [0], waterFPS, false),
  ]
});
