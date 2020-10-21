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
    that.CanvasResponsive();
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
      that.ms = Date.now();
      that.GameLoop(that);
    });
  }

CanvasResponsive(){
  var style=getComputedStyle(canvas);
  var w=style.width;
  var h=style.height;
  canvas.width=w.split('px')[0];
  canvas.height=h.split('px')[0];
  
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
