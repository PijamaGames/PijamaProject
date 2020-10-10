class Manager{
  constructor(){
    this.graphics = new Graphics();
    resources = new Resources();
    input = new Input();
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
    Log("Gameloop iteration");
    that.ManageTime();
    input.Update();

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
      that.LoadScene('testScene');
      //let obj = new Gameobj('firstObj', null, testScene, [new ColliderGroup()]);
      //let obj2 = new Gameobj('secondObj', null, testScene, [new ColliderGroup(),new Renderer(['opaque'], new Vec2(0,130))]);
      //let obj2 = PF_Tree(new Vec2(0,0));
      //let obj2 = PF_Box();

      /*obj.colliderGroup.AddColliders([new CircleCollider(2,new Vec2(-3,0),new Vec2(2,0))]);
      Log(obj.colliderGroup.colliders[0].collider.OncolisionEnter(new CircleCollider(2,new Vec2(-3,0),new Vec2(3,0))));
      */
      /*obj.transform.position = new Vec2(2,0);
      obj.colliderGroup.AddColliders([new BoxCollider(2,3,obj.colliderGroup)]);
      obj2.colliderGroup.AddColliders([new BoxCollider(2,1,obj2.colliderGroup)]);
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
    //arrow keys
    input.AddKey('ArrowLeft');
    input.AddKey('ArrowRight');
    input.AddKey('ArrowUp');
    input.AddKey('ArrowDown');
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
