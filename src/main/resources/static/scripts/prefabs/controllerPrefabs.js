prefabFactory.AddPrototype("Master", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new MasterController(),
  ]
});
prefabFactory.AddPrototype("Nelu", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.4, false)]),
    new SpriteRenderer('nelu_idle', new Vec2(0, 2),new Vec2(2,2), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.7),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new PlayerController(),
    new LightSource(8.0, 1.5, 0.5),
    new NetworkEntity(),
    new AudioSource(["comboSound1","comboSound2","comboSound3","healSound","dashSound","powerupFireSound","neluDied","neluDamage"]),
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
    new NetworkEntity(),
    new AudioSource(["hummingbirdSound"]),
  ]
});

prefabFactory.AddPrototype("Bee", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    //new ColliderGroup([new CircleCollider(new Vec2(0,0),0.2,true)]),
    new SpriteRenderer('bee', new Vec2(0,0), new Vec2(1,1), false, 8, [4,0,6,1,5,3,7,2], 14, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
    new Rigidbody(0.2),
    new BeeController(),
    new NetworkEntity(),
    new AudioSource(["beesSound"]),
  ]
});
