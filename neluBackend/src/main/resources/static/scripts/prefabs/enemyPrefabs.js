prefabFactory.AddPrototype("MonkeyEnemy", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.35, false)]),
    new SpriteRenderer('monkey_idle', new Vec2(0, 2),new Vec2(1,1), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new EnemyController(2.0),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("BeekeeperEnemy", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.35, false)]),
    new SpriteRenderer('beekeeper_idle', new Vec2(0, 2),new Vec2(2,2), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new BeekeeperController(1),
    new NetworkEntity(),
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
