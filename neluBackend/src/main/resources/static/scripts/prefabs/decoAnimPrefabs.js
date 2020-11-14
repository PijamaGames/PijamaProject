
prefabFactory.AddPrototype("Tree", new Vec2(6,6), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('tree', new Vec2(0, 0),new Vec2(6,6), true, 1, [0], 8, true),
  ]
});

prefabFactory.AddPrototype("TreeStatic", new Vec2(6,6), new Vec2(0.0, 0.0), true, ()=>{
  return [
    new Renderer(new Vec2(9,0), new Vec2(6,6), true),
  ]
});

prefabFactory.AddPrototype("DecoTree", new Vec2(6,6), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('tree', new Vec2(0, 0),new Vec2(6,6), true, 1, [0], 8, true),
  ]
});

prefabFactory.AddPrototype("BushStatic", new Vec2(2,2), new Vec2(0.0, 0.0), false, ()=>{
  return [
    //new ColliderGroup([new CircleCollider(new Vec2(0.0,0.0), 0.5, true)]),
    new Renderer(new Vec2(9,6), new Vec2(2,2), true),
    //new Burnable(),
  ]
});

prefabFactory.AddPrototype("Bush", new Vec2(2,2), new Vec2(0.0, 0.0), false, ()=>{
  return [
    //new ColliderGroup([new CircleCollider(new Vec2(0.0,0.0), 0.5, true)]),
    new SpriteRenderer('bush', new Vec2(0, 0),new Vec2(2,2), true, 1, [0], 8, true),
    //new Burnable(),
  ]
});
var waterFPS=4;
prefabFactory.AddPrototype("WaterBottom", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterbottom', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterBottomLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterbottomleft', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterBottomRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterbottomright', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterleft', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterOuterBottomLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterouterbottonleft', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterOuterBottomRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterouterbottomright', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterOuterTopLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('wateroutertopleft', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterOuterTopRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('wateroutertopright', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('waterright', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterTop", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('watertop', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterTopLeft", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('watertopleft', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("WaterTopRight", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('watertopright', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("Water1", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('water1', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("Water2", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('water2', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
prefabFactory.AddPrototype("Water3", new Vec2(1,1), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new SpriteRenderer('water3', new Vec2(0, 0),new Vec2(1,1), false, 1, [0], waterFPS, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
