prefabFactory.AddPrototype("Tree", new Vec2(2, 2), new Vec2(0.0,0.0), true, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.0,-0.8), 0.2,false,
    function(){
      Log("arbol: holi");
    },
    function(){
      Log("arbol: aqui");
    },
    function(){
      Log("arbol: adios");
    })]),
    new Renderer(new Vec2(0, 130), new Vec2(2,2), true),
    new ShadowCaster(new Vec2(0.0,-0.8), 0.5),
  ]
});

prefabFactory.AddPrototype("Box", new Vec2(2, 2), new Vec2(0,0), false, ()=>{
  return [
    new Rigidbody(0.9, false),
    new Renderer(new Vec2(), new Vec2(2,2), true),
    new ColliderGroup([new BoxCollider(new Vec2(0.0,-0.65), 2.0, 0.5)]),
  ]
});

prefabFactory.AddPrototype("Nelu", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.4, false)]),
    new SpriteRenderer('nelu_idle', new Vec2(0, 2),new Vec2(2,2), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.7),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new PlayerController(),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("Colibri", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,0),0.4,true, (obj)=>{
      if(obj.enemyController){
        obj.enemyController.TakeDamage(5);
      }
    })]),
    new SpriteRenderer('hummingbird', new Vec2(0,0), new Vec2(1,1), false, 8, [4,0,6,1,5,3,7,2], 14/*, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']*/),
    new Rigidbody(0.2),
    new ColibriController(),
  ]
});

prefabFactory.AddPrototype("Bee", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    //new ColliderGroup([new CircleCollider(new Vec2(0,0),0.2,true)]),
    new SpriteRenderer('bee', new Vec2(0,0), new Vec2(1,1), false, 4, [2,0,3,1], 14, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
    new Rigidbody(0.2),
    new BeeController(),
  ]
});

prefabFactory.AddPrototype("Grass", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Sand", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Nenuphar", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("NenupharBig", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Rock", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("RockHole", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("RockHoleFilled", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,0), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("BindWeed", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(8,0), new Vec2(1,2), false),
  ]
});

prefabFactory.AddPrototype("Stump", new Vec2(2,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,1), new Vec2(2,1), true),
  ]
});

prefabFactory.AddPrototype("LifeFlower", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,1), new Vec2(1,1), true),
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

prefabFactory.AddPrototype("Tent", new Vec2(3,3), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,2), new Vec2(3,3), true),
  ]
});

prefabFactory.AddPrototype("LogHorizontal", new Vec2(2,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,2), new Vec2(2,1), true),
  ]
});

prefabFactory.AddPrototype("DryPlant", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,2), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("Puddle", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,2), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("Campfire", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,2), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("LianaLeft", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(8,2), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("LianaRight", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(8,4), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("LogVertical", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,3), new Vec2(1,2), false),
  ]
});

/*prefabFactory.AddPrototype("Apple", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,3), new Vec2(1,1), false),
  ]
});*/

prefabFactory.AddPrototype("CampLog", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,3), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("CampTop1", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,4), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("CampTop2", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("CampTop3", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("WoodStick", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,3), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("BigLog", new Vec2(1,3), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,3), new Vec2(1,3), true),
  ]
});

prefabFactory.AddPrototype("Herb1", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("Herb2", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("Nest", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("Nest1", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("BrokenEggs", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,5), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("DirtWall1", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,6), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("DirtWall2", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,6), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("DirtWall3", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,6), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("Grass1", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,6), new Vec2(1,1), false),
  ]
});
prefabFactory.AddPrototype("Grass2", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,6), new Vec2(1,1), false),
  ]
});
prefabFactory.AddPrototype("Grass3", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,6), new Vec2(1,1), false),
  ]
});
prefabFactory.AddPrototype("Grass4", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,6), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("SmallRocks", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,6), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass5", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,7), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass6", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,7), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass7", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,7), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Shit", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,7), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("GrassPillar", new Vec2(1,3), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,7), new Vec2(1,3), false),
  ]
});

prefabFactory.AddPrototype("Grass9", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,8), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass10", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,8), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass11", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,8), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass12", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,8), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass13", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,8), new Vec2(1,1), false),
  ]
});
prefabFactory.AddPrototype("Grass14", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,8), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass15", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,9), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass16", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,9), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass17", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,9), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass18", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,9), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass19", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,9), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass20", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,9), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass21", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass22", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass23", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass24", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass25", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass26", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass27", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Grass28", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,10), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("DirtWall4", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,11), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("DirtWall5", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,11), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("Cave", new Vec2(1,2), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,11), new Vec2(1,2), true),
  ]
});

prefabFactory.AddPrototype("Dirt1", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,11), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt2", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,11), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt3", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,11), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt4", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,11), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt5", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,12), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt6", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,12), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt7", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,12), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt8", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,13), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt9", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,13), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt10", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,13), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt11", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt12", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt13", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt14", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt15", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt16", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt17", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt18", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt19", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt20", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt21", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,13), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt22", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,13), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt23", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,13), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt24", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt25", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,14), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt26", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(0,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt27", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(1,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Dirt28", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(2,15), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("BigLogPack", new Vec2(1,5), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(8,6), new Vec2(1,5), true),
  ]
});

prefabFactory.AddPrototype("BigLogPackLiana", new Vec2(1,5), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(8,11), new Vec2(1,5), true),
  ]
});

prefabFactory.AddPrototype("Apple", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(4,3), new Vec2(1,1), false),
    new ColliderGroup([new CircleCollider(new Vec2(0.0,0.0), 0.3, false)]),
  ]
});

prefabFactory.AddPrototype("Light", null, null, true, ()=>{
  return [
    new LightSource(8.0),
  ]
});
prefabFactory.AddPrototype("Water", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,8), new Vec2(1,1), true),
  ]
});
prefabFactory.AddPrototype("Mud", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(6,2), new Vec2(1,1), true),
  ]
});
