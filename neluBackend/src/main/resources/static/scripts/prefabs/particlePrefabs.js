prefabFactory.AddPrototype("neluParticles", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.35, true, null, (obj)=>{
      if(obj.enemyController){
        obj.enemyController.TakeDamage(5);
      }
    })]),
    new SpriteRenderer('nelu_particles1', new Vec2(0, 2),new Vec2(2,2), false, 8, [4,0,6,1,5,3,7,2], 14, false, 1.0, ['spriteColor','spriteDepth', 'spriteMask']),
  ]
});
