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
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.65), 0.35, false,
    function(){
      Log("Nelu: holi");
    },
    function(){
      Log("Nelu: aqui");
    },
    function(){
      Log("Nelu: adios");
    })]),
    new SpriteRenderer('nelu_idleE', new Vec2(0, 2),new Vec2(2,2), true, 8, [4,0,6,1,5,3,7,2], 5),
    new Rigidbody(),
    new ShadowCaster(new Vec2(0,-0.75), 0.75),
  ]
});

prefabFactory.AddPrototype("Grass", new Vec2(1,1), new Vec2(0,1), true, ()=>{
  return [
    new Renderer(new Vec2(0,132), new Vec2(1,1), false),
  ]
});

prefabFactory.AddPrototype("Light", null, null, true, ()=>{
  return [
    new LightSource(8.0),
  ]
});
