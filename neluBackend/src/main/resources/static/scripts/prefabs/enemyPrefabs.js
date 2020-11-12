prefabFactory.AddPrototype("MonkeyEnemy", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.1), 0.2, false), new CircleCollider(new Vec2(0,0), 0.5, true)]),
    new SpriteRenderer('monkey_idle', new Vec2(0, 2),new Vec2(1,1), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new EnemyController(2.0),
    new Burnable().SetOnBurn((obj)=>{
      obj.enemyController.TakeDamage(10, true);
    }),
    new NetworkEntity(),
    new AudioSource(["monkeyHouseSound", "screamingMonkeySound","monkeyDamageSound","throwMissileSound","fireSound"]),
  ]
});

prefabFactory.AddPrototype("MonkeySpawner", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new Spawner("MonkeyEnemy", 10),
    /*new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = EDITOR_MODE ? 5 : 6;
    }),*/
  ]
});

prefabFactory.AddPrototype("BeekeeperEnemy", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.6), 0.35, false), new CircleCollider(new Vec2(0,-0.3), 0.5, true)]),
    new SpriteRenderer('beekeeper_idle', new Vec2(0, 2),new Vec2(2,2), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new BeekeeperController(1),
    new Burnable().SetOnBurn((obj)=>{
      obj.enemyController.TakeDamage(10, true);
    }),
    new NetworkEntity(),
    new AudioSource(["fireSound"]),
  ]
});

prefabFactory.AddPrototype("apple", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.0,0.0), 0.3, true,
    function(obj){
      let apple=this.gameobj;
      if(obj.playerController){
        obj.playerController.TakeDamage(5);
        apple.appleController.enemy.enemyController.PoolAdd(apple);
      }
    }, null, null
    )]),
    new Renderer(new Vec2(4,3), new Vec2(1,1), false),
    new Rigidbody(0.9),
    new AppleController(),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("particle", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.0,0.0), 0.3, true,
    function(obj){
      let particle=this.gameobj;
      let damage=0.5;
      if(obj.playerController){
        obj.playerController.TakeDamage(damage);
        particle.particlesController.enemy.enemyController.PoolAdd(particle);
      }
    }, null, null
    )]),
    new SpriteRenderer('smoke', new Vec2(0, 0),new Vec2(2,2), true, 1, [0], 8, true),
    new Rigidbody(0.2),
    new ParticlesController(),
    new NetworkEntity(),
  ]
});
