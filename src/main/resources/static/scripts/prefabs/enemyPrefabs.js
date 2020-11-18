prefabFactory.AddPrototype("MonkeyEnemy", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.1), 0.2, false), new CircleCollider(new Vec2(0,0), 0.5, true)]),
    new SpriteRenderer('monkey_idle', new Vec2(0, 2),new Vec2(1,1), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    //new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new EnemyController(1.0),
    new Burnable().SetOnBurn((obj)=>{
      obj.enemyController.TakeDamage(8, true);
    }),
    new NetworkEntity(),
    new AudioSource(["screamingMonkeySound","monkeyDamageSound","beekeeperDied","throwMissileSound","fireSound"]),
  ]
});

prefabFactory.AddPrototype("MonkeySpawner1", new Vec2(1,1), new Vec2(0.0,0.0), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new Spawner("MonkeyEnemy", 1, 1.5),
    new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = DEBUG_VISUAL ? 6 : 5;
    }),
  ]
});

prefabFactory.AddPrototype("MonkeySpawner2", new Vec2(1,1), new Vec2(0.0,0.0), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new Spawner("MonkeyEnemy", 2, 3),
    new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = DEBUG_VISUAL ? 6 : 5;
    }),
  ]
});

prefabFactory.AddPrototype("MonkeySpawner3", new Vec2(1,1), new Vec2(0.0,0.0), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new Spawner("MonkeyEnemy", 3, 6),
    new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = DEBUG_VISUAL ? 6 : 5;
    }),
  ]
});

prefabFactory.AddPrototype("MonkeySpawner4", new Vec2(1,1), new Vec2(0.0,0.0), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new Spawner("MonkeyEnemy", 7),
    new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = DEBUG_VISUAL ? 6 : 5;
    }),
  ]
});

prefabFactory.AddPrototype("MonkeySpawner5", new Vec2(1,1), new Vec2(0.0,0.0), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new Spawner("MonkeyEnemy", 10),
    new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = DEBUG_VISUAL ? 6 : 5;
    }),
  ]
});


prefabFactory.AddPrototype("BattleManager", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new Renderer(new Vec2(6, 13), new Vec2(1,1), false),
    new BattleController([
      //constructor(id, autoStart, pos, dist, spawnerRefs='', startEnable = '', startDisable = '', endEnable = '', endDisable = ''){
      new Battle("1", true, new Vec2(57, -10), 5.0, `
      MonkeySpawner1 54 -9 0 1 1
      MonkeySpawner1 57 -9 0 1 1
      `,`
      BindWeed 45 -12 0.5 1 2
      BindWeed 45 -11 0.5 1 2
      `,``,``,`
      BindWeed 67 -10 0.5 1 2
      BindWeed 67 -11 0.5 1 2
      BindWeed 67 -12 0.5 1 2
      `).SetOnEnd(()=>{
        if(user.entity.controlPoint < 2){
          user.entity.controlPoint = 2;
          user.SaveProgress();
        }
      }),
      new Battle("2", true, new Vec2(80,-10), 9.0, `
      MonkeySpawner2 71 -3 0 1 1
      MonkeySpawner2 74 -3 0 1 1
      MonkeySpawner2 77 -3 0 1 1
      MonkeySpawner2 80 -3 0 1 1
      `,`
      BindWeed 67 -10 0.5 1 2
      BindWeed 67 -11 0.5 1 2
      BindWeed 67 -12 0.5 1 2
      `,``,``,`
      BindWeed 85 -14 0.5 1 2
      BindWeed 85 -16 0.5 1 2
      BindWeed 85 -15 0.5 1 2
      `).SetOnEnd(()=>{
        dialogSystem.InitDialog("cap1_nelu_nido");
        if(user.entity.controlPoint < 3){
          user.entity.controlPoint = 3;
          user.SaveProgress();
        }
      }),
      new Battle("3", false, new Vec2(80,-10), 9.0, `
      MonkeySpawner1 100 -11 0 1 1
      MonkeySpawner1 101 -11 0 1 1
      MonkeySpawner1 102 -11 0 1 1
      MonkeySpawner1 103 -11 0 1 1
      MonkeySpawner1 104 -11 0 1 1
      `,`
      BindWeed 85 -14 0.5 1 2
      BindWeed 85 -16 0.5 1 2
      BindWeed 85 -15 0.5 1 2
      `,``,``,``),
      new Battle("4", true, new Vec2(178,-2), 9.0, `
      MonkeySpawner3 168 2 0.05 1 1
      MonkeySpawner3 170 2 0.05 1 1
      MonkeySpawner3 172 2 0.05 1 1
      MonkeySpawner3 183 2 0.05 1 1
      MonkeySpawner3 185 2 0.05 1 1
      MonkeySpawner3 187 2 0.05 1 1
      `,`
      BigLog 176 -19 0.1
      BigLog 177 -19 0.1
      BigLog 178 -19 0.1
      BigLog 179 -19 0.1
      `,``,``,``).SetOnEnd(()=>{
        //dialogSystem.InitDialog("cap1_colibri_inicio_pelea");
        battleController.AddEvent(new ScriptedEvent("cap1_colibri_inicio_pelea", true, new Vec2(166,1), 3.0, false, ()=>dialogSystem.InitDialog("cap1_colibri_inicio_pelea")));
      }),
      new Battle("5", true, new Vec2(181,24), 8.0, `
      MonkeySpawner2 170 25 0.05 1 1
      MonkeySpawner2 172 25 0.05 1 1
      MonkeySpawner2 174 25 0.05 1 1
      MonkeySpawner2 176 25 0.05 1 1
      MonkeySpawner2 179 25 0.05 1 1
      MonkeySpawner2 181 25 0.05 1 1
      MonkeySpawner2 183 25 0.05 1 1
      MonkeySpawner2 185 25 0.05 1 1
      `,`
      BindWeed 166 22 0.05 1 2
      BindWeed 166 23 0.05 1 2
      `,``,``,`
      BindWeed 186 11 0.05 1 2
      BindWeed 187 11 0.05 1 2
      BindWeed 188 11 0.05 1 2
      `),
      new Battle("RiverBattle", true, new Vec2(107,-34), 5.0, `
      MonkeySpawner1 118 -34 0.05 1 1
      MonkeySpawner1 120 -33 0.05 1 1
      MonkeySpawner1 120 -35 0.05 1 1
      MonkeySpawner1 130 -33 0.05 1 1
      MonkeySpawner1 132 -33 0.05 1 1
      MonkeySpawner1 134 -33 0.05 1 1
      MonkeySpawner1 133 -34 0.05 1 1
      MonkeySpawner1 131 -34 0.05 1 1
      MonkeySpawner1 151 -33 0.05 1 1
      MonkeySpawner1 151 -34 0.05 1 1
      MonkeySpawner1 153 -33 0.05 1 1
      MonkeySpawner1 157 -33 0.05 1 1
      MonkeySpawner1 159 -34 0.05 1 1
      `,``,``,``,`
      BindWeed 161 -32 0 1 2
      `)
    ], [
      //constructor(id, autoStart, pos, dist, repeat, onStart = function(){}){
      new ScriptedEvent("saveProgress4", true, new Vec2(175,-33), 4.0, false, ()=>{
        if(user.entity.controlPoint < 4){
          user.entity.controlPoint = 4;
          user.SaveProgress();
        }
      }),
      new ScriptedEvent("toMorning", true, new Vec2(178,-19), 3.0, true, ()=>lighting.BeginTransition(1, 1)),
      new ScriptedEvent("toNight", true, new Vec2(178,-11), 3.0, true, ()=>lighting.BeginTransition(3, 1)),
      new ScriptedEvent("t_movimiento", true, new Vec2(0,2), 100.0, false, ()=>{
        if(input.isDesktop)
          dialogSystem.InitDialog("t_movimiento")
      }),
      new ScriptedEvent("cap1_intro_nelu", true, new Vec2(14,2), 5.0, false, ()=>dialogSystem.InitDialog("cap1_intro_nelu")),
      new ScriptedEvent("t_ataque_dash", true, new Vec2(38,-11), 5.0, false, ()=>{
        if(input.isDesktop)
          dialogSystem.InitDialog("t_ataque_dash")
      }),
      new ScriptedEvent("cap1_intro_monos", true, new Vec2(48,-10), 4.0, false, ()=>dialogSystem.InitDialog("cap1_intro_monos")),
      //new ScriptedEvent("t_dash", false, new Vec2(14,2), 5.0, false, ()=>dialogSystem.InitDialog("t_dash")),
      new ScriptedEvent("cap1_nelu_nido", false, new Vec2(14,2), 5.0, false, ()=>dialogSystem.InitDialog("cap1_nelu_nido")),
      new ScriptedEvent("cap1_intro_colibri", true, new Vec2(107,-31), 4.0, false, ()=>dialogSystem.InitDialog("cap1_intro_colibri")),
      new ScriptedEvent("cap1_colibri_fortaleza", true, new Vec2(177,-18), 5.0, false, ()=>dialogSystem.InitDialog("cap1_colibri_fortaleza")),
      new ScriptedEvent("cap1_colibri_fin_pelea", true, new Vec2(152,1), 2.5, false, ()=>{
        prefabFactory.CreateObj("BindWeed", new Vec2(166,0));
        prefabFactory.CreateObj("BindWeed", new Vec2(166,-1));
        if(user.entity.controlPoint < 5){
          user.entity.controlPoint = 5;
          user.SaveProgress();
        }
        if(!input.isDesktop) manager.scene.canUseColibri = true;

        dialogSystem.InitDialog("cap1_colibri_fin_pelea");
        battleController.AddEvent(new ScriptedEvent("t_colibri", true, new Vec2(151,5), 1.7, false, ()=>{
          if (input.isDesktop) dialogSystem.InitDialog("t_colibri");
          manager.scene.canUseColibri = true;
        }));
      }),
      new ScriptedEvent("cap1_fin", true, new Vec2(208,-40), 5.0, false, ()=>{
        dialogSystem.InitDialog("cap1_fin");
        if(user.entity.controlPoint < 6){
          user.entity.controlPoint = 0;
          user.SaveProgress();
        }
      }),

    ]).SetOnStartBattle((obj)=>{
      let player= manager.scene.players.values().next().value.playerController;
      if(manager.singleGameMusic.Playing("levelSound")){
        manager.singleGameMusic.PauseAll();
      }
      if(!obj.audioSource.Playing("monkeyHouseSound") && !player.firePower){
        obj.audioSource.PlayAll();
      }


    }).SetOnEndBattle((obj)=>{
      let player= manager.scene.players.values().next().value.playerController;
      if(!manager.singleGameMusic.Playing("levelSound") && !player.firePower){
        manager.singleGameMusic.LoopAll(true);
        manager.singleGameMusic.PlayAll();
      }
      obj.audioSource.StopAll();

    }),
    /*new ColliderGroup([new CircleCollider(new Vec2(), 3.0, true, (obj, self)=>{
      if(obj.playerController){
        self.battleController.Start();
      }
    })]),*/
    new CustomBehaviour().SetOnUpdate((obj)=>{
      obj.renderer.tile.x = DEBUG_VISUAL ? 6 : 5;
    }),
    new AudioSource(["monkeyHouseSound"]),
  ]
});

prefabFactory.AddPrototype("BeekeeperEnemy", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.6), 0.35, false), new CircleCollider(new Vec2(0,-0.3), 0.5, true)]),
    new SpriteRenderer('beekeeper_idle', new Vec2(0, 2),new Vec2(2,2), true, 8, [4,0,6,1,5,3,7,2], 14),
    new Rigidbody(0.5),
    //new ShadowCaster(new Vec2(0,-0.75), 0.75),
    new BeekeeperController(0.7),
    new Burnable().SetOnBurn((obj)=>{
      obj.enemyController.TakeDamage(8, true);
    }),
    new NetworkEntity(),
    new AudioSource(["fireSound","beekeeperAttack","beekeeperDied","beekeeperDamage"]),
  ]
});

prefabFactory.AddPrototype("apple", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new Renderer(new Vec2(4,3), new Vec2(1,1), false, 1.0, ['color', 'depth', 'mask']),
    new Rigidbody(0.1),
    new AppleController(),
    new NetworkEntity(),
  ]
});

prefabFactory.AddPrototype("particle", new Vec2(2, 2), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new SpriteRenderer('smoke', new Vec2(0, 0),new Vec2(2,2), false, 1, [0], 8, false),
    new Rigidbody(0.1),
    new ParticlesController(),
    new NetworkEntity(),
  ]
});
