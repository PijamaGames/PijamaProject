prefabFactory.AddPrototype("InteractBox", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "E", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LifeFlower", new Vec2(1,1), new Vec2(0,0), false, ()=>{
  return [
    new Renderer(new Vec2(2,1), new Vec2(1,1), true),
    new Interactive(2.0),
  ]
});

prefabFactory.AddPrototype("LifeFlowerUsed", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,1), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("LifeFlowerBig", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,1), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("LifeFlowerBigUsed", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,1), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("FireFlower", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,1), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("FireFlowerUsed", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,1), new Vec2(1,1), true),
  ]
});