prefabFactory.AddPrototype("neluParticles", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,0), 1.0, true, null, (obj)=>{
      if(obj.enemyController){
        obj.enemyController.TakeDamage(5);
      }
    })]),
    new SpriteRenderer('nelu_particles1', new Vec2(0, 2),new Vec2(2,2), false, 8, [4,0,6,1,5,3,7,2], 14, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
    new NetworkEntity(),
    new CustomBehaviour().SetOnEnable((obj)=>{
      obj.colliderGroup.firstCollider.displacement = obj.renderer.dir.Copy().Scale(0.4);
    })
  ]
});


prefabFactory.AddPrototype("neluFire", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,0), 0.35, true, null, (obj)=>{
      if(obj.burnable){
        obj.burnable.Burn();
      }
      /*if(obj.enemyController){
        obj.enemyController.TakeDamage(5);
      }*/
    })]),
    new SpriteRenderer('nelu_fire', new Vec2(0, 0),new Vec2(2,2), false, 8, [4,0,6,1,5,3,7,2], 14, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
    new Rigidbody(0.05),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("fire", new Vec2(2,3), new Vec2(0.5,0.1), false, ()=>{
  return [
    new SpriteRenderer('fire', new Vec2(0,0), new Vec2(2,3), true, 1, [0], 12, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
    new NetworkEntity(),
  ]
});
