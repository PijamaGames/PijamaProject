class Manager{
  constructor(){
    this.graphics = new Graphics();
    this.resources = new Resources();
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

    //Update scene
    if(this.scene){
      this.scene.Update();
      //Update Physics
      //Render graphics
    }

    window.requestAnimationFrame(function(){
      that.GameLoop(that);
    });
  }

  Start(){
    this.AddInputKeys();

    var that = this;
    this.resources.Load(function(){
      let obj = new Gameobj('firstObj', null, testScene, []);
      let obj2 = new Gameobj('secondObj', obj, testScene, []);

      /*obj.transform.position = new Vec2(1,0);
      obj2.transform.position=new Vec2(3,4);
      Log(obj2.transform.worldPos);
      obj2.transform.worldPos = new Vec2(0,0);
      Log(obj2.transform.position);*/

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
