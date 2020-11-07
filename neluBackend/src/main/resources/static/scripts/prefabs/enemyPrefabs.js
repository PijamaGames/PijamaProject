prefabFactory.AddPrototype("MonkeyEnemy", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.35, false)]),
    new SpriteRenderer('nelu_idle', new Vec2(0, 2),new Vec2(1,1), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new EnemyController(2.0),
  ]
});
