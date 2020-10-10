class Manager{
  constructor(){
    this.graphics = new Graphics();
    resources = new Resources();
    this.input = new Input();
    this.scene = null;
    this.scenes = new Map();
    this.delta = 0.0;
    this.ms = null;
  }

  ManageTime(){
    var newMs = Date.now();
    this.delta = (newMs - this.ms)/1000.0;
    this.ms = newMs;
  }

  GameLoop(that){
    that.ManageTime();
    that.input.Update();


    if(this.scene){
      this.scene.Update();
      //Update Physics
      this.graphics.Render();
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

      let obj = new Gameobj('firstObj', null, testScene, [new ColliderGroup()]);
      let obj2 = new Gameobj('secondObj', null, testScene, [new ColliderGroup(),new Renderer(['opaque'])]);
      /*obj.colliderGroup.AddColliders([new CircleCollider(2,new Vec2(-3,0),new Vec2(2,0))]);
      Log(obj.colliderGroup.colliders[0].collider.OncolisionEnter(new CircleCollider(2,new Vec2(-3,0),new Vec2(3,0))));
      */
      obj.transform.position = new Vec2(2,0);
      obj2.transform.position=new Vec2(0,2.1);
      obj.colliderGroup.AddColliders([new BoxCollider(2,3,obj.colliderGroup)]);
      obj2.colliderGroup.AddColliders([new BoxCollider(2,1,obj2.colliderGroup)]);
      Log(obj.colliderGroup.colliders[0].OnColisionEnter(obj2.colliderGroup.colliders[0]));


      that.ms = Date.now();
      that.GameLoop(that);
    });
  }

  AddInputKeys(){
    this.input.AddKey('KeyW');
    this.input.AddKey('KeyA');
    this.input.AddKey('KeyS');
    this.input.AddKey('KeyD');
    //arrow keys
    this.input.AddKey('ArrowLeft');
    this.input.AddKey('ArrowRight');
    this.input.AddKey('ArrowUp');
    this.input.AddKey('ArrowDown');
  }

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName) {
    this.scene = this.scenes.get(sceneName);
  }
}
