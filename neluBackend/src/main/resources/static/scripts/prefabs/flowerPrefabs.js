prefabFactory.AddPrototype("InteractBox", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5).GiveFunctionality(),
    new TextBox(null, "E", "E", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LifeFlower", new Vec2(1,1), new Vec2(0,0), false, ()=>{
  return [
    new Renderer(new Vec2(2,1), new Vec2(1,1), true),
    new Interactive().SetOnInteract((obj)=>{
      obj.flowerController.PickUp();
    }),
    new FlowerController(10).SetOnPickUp((obj)=>{
      obj.flowerController.player.playerController.GainLife(20);
    }),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("LifeFlowerUsed", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(3,1), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("LifeFlowerBig", new Vec2(1,1), new Vec2(0,0), false, ()=>{
  return [
    new Renderer(new Vec2(4,1), new Vec2(1,1), true),
    new Interactive().SetOnInteract((obj)=>{
      obj.flowerController.PickUp();
    }),
    new FlowerController(10).SetOnPickUp((obj)=>{
      obj.flowerController.player.playerController.GainLife(30);
    }),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("LifeFlowerBigUsed", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(5,1), new Vec2(1,1), true),
  ]
});

prefabFactory.AddPrototype("FireFlower", new Vec2(1,1), new Vec2(0,0), false, ()=>{
  return [
    new Renderer(new Vec2(6,1), new Vec2(1,1), true),
    new Interactive().SetOnInteract((obj)=>{
      obj.flowerController.PickUp();
    }),
    new FlowerController(10).SetOnPickUp((obj)=>{
      obj.flowerController.player.playerController.ActivateFirePower();
    }),
    new LightSource(8.0, 1.5, 0.8),
    new CustomBehaviour().SetOnUpdate((obj)=>{
      let target = obj.flowerController.used ? 0.0 : 8.0;
      let l = obj.lightSource;
      let lerp = 4.0 * manager.delta;
      l.ratio = l.ratio * (1.0-lerp) + target * lerp;
      const turbulence = 0.05;
      l.ratio += Math.random()*turbulence*target;
    }),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("FireFlowerUsed", new Vec2(1,1), new Vec2(0,0), true, ()=>{
  return [
    new Renderer(new Vec2(7,1), new Vec2(1,1), true),
  ]
});
