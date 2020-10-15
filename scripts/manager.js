class Manager{
  constructor(){
    this.graphics = new Graphics();
    resources = new Resources();
    input = new Input();
    this.scene = null;
    this.scenes = new Map();
    this.delta = 0.0;
    this.ms = null;
    mapPlacer = new MapPlacer();
    physics = new Physics();
  }

  ManageTime(){
    var newMs = Date.now();
    this.delta = (newMs - this.ms)/1000.0;
    if(this.delta > 1.0) this.delta = 1.0;
    this.ms = newMs;
  }

  GameLoop(that){
    //Log("Gameloop iteration");
    that.ManageTime();
    input.Update();
    //fsm.Update();
    if(this.scene){
      this.scene.Update();
      //this.scene.UpdatePhysics();
      physics.Update();
      this.graphics.Render();
      //Update map placer
      if(mapPlacer) mapPlacer.Update();
    }

    window.requestAnimationFrame(function(){
      that.GameLoop(that);
    });
  }

  Start(){
    this.AddInputKeys();

    var that = this;
    resources.Load(function(){
      that.graphics.LoadResources();
      that.LoadScene('testScene');

      //PROBANDO AUDIO
      /*var go1= new Gameobj('Box', 1, null, that.scene, [ new AudioSource(["sound"]), new Transform()]);
      var go2= new Gameobj('Box', 2, null, that.scene, [ new AudioSource(["sound"]), new Transform()]);

      go1.audioSource.Play("sound");

      setTimeout(() => {
        //go2.audioSource.PlayAll();
        //go1.audioSource.ChangeVol("sound",0.5);
        //go1.audioSource.Pause("sound");
        //go1.audioSource.Rate("sound",2);
        /*go1.audioSource.Mute("sound",true);
        setTimeout(() => {
          //go2.audioSource.PlayAll();
          //go1.audioSource.ChangeVol("sound",0.5);
          //go1.audioSource.Pause("sound");
          //go1.audioSource.Rate("sound",2);
          go1.audioSource.Mute("sound",false);

        }, 10000);
        //go1.audioSource.Stop("sound");
        //Log(go1.audioSource.Playing("sound"));
        go1.audioSource.Fade("sound",1,0,10000);
      }, 10000);*/



      //comprobacion colision entre dos circulos
      /*let obj = new Gameobj('firstObj', null, testScene, [new ColliderGroup()], new Transform(new Vec2(4.1,0)));
      let obj2 = PF_Tree(new Vec2(0,0));

      obj.colliderGroup.AddColliders([new CircleCollider(2,new Vec2(),obj.colliderGroup)]);
      obj2.colliderGroup.AddColliders([new CircleCollider(2,new Vec2(),obj2.colliderGroup)]);
      Log(obj.colliderGroup.colliders[0].OnColisionEnter(obj2.colliderGroup.colliders[0]));
      */
      //comprobacion colision entre dos planos
      /*let obj = new Gameobj('firstObj', null, testScene, [new ColliderGroup()], new Transform(new Vec2(3,0)));
      let obj2 = PF_Tree(new Vec2(0,0));

      obj.colliderGroup.AddColliders([new BoxCollider(2,3,obj.colliderGroup)]);
      obj2.colliderGroup.AddColliders([new BoxCollider(2,3,obj2.colliderGroup)]);
      Log(obj.colliderGroup.colliders[0].OnColisionEnter(obj2.colliderGroup.colliders[0]));*/
      //comprobacion colision entre plano-circulo
      /*let obj = new Gameobj('firstObj', null, testScene, [new ColliderGroup()], new Transform(new Vec2(2.5,0)));
      let obj2 = PF_Tree(new Vec2(0,0));

      obj.colliderGroup.AddColliders([new CircleCollider(1,new Vec2(),obj.colliderGroup)]);
      obj2.colliderGroup.AddColliders([new BoxCollider(2,3,obj2.colliderGroup)]);
      Log(obj.colliderGroup.colliders[0].OnColisionEnter(obj2.colliderGroup.colliders[0]));*/

      that.ms = Date.now();
      that.GameLoop(that);
    });
  }



  AddInputKeys(){
    input.AddKey('KeyW');
    input.AddKey('KeyA');
    input.AddKey('KeyS');
    input.AddKey('KeyD');

    input.AddKey('KeyR');
    //arrow keys
    input.AddKey('ArrowLeft');
    input.AddKey('ArrowRight');
    input.AddKey('ArrowUp');
    input.AddKey('ArrowDown');

    input.AddKey('Space');

    input.AddKey('KeyT');
    input.AddKey('KeyG');
    input.AddKey('KeyY');
    input.AddKey('KeyH');
  }

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName) {
    if(this.scene) this.scene.Unload();
    this.scene = this.scenes.get(sceneName);
    this.scene.LoadByteCode();
  }
}
