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
    //Update Physics
    //Render graphics

    window.requestAnimationFrame(function(){
      that.GameLoop(that);
    });
  }

  Start(){
    this.ms = Date.now();
    this.AddInputKeys();

    var that = this;
    this.resources.Load(function(){


      that.GameLoop(that);
    });
  }

  AddInputKeys(){
    this.input.AddKey('KeyW');
    this.input.AddKey('KeyA');
    this.input.AddKey('KeyS');
    this.input.AddKey('KeyD');
  }

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName) {
    this.currentScene = this.scenes.get(sceneName);
  }
}
