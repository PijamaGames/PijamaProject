class Manager {
  constructor() {
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

  ManageTime() {
    var newMs = Date.now();
    this.delta = (newMs - this.ms) / 1000.0;
    if (this.delta > 1.0) this.delta = 1.0;
    this.ms = newMs;
  }

  GameLoop(that) {
    //Log("Gameloop iteration");
    that.ManageTime();
    input.Update();
    //fsm.Update();
    if (this.scene) {

      if(input.GetKeyDown('KeyT')){
        this.EnterFullScreen();
      }
      if(input.GetKeyDown('KeyG')){
        this.ExitFullScreen();
      }

      this.scene.Update();
      //this.scene.UpdatePhysics();
      physics.Update();
      this.graphics.CanvasResponsive();
      this.graphics.Render();
      //Update map placer
      if (mapPlacer) mapPlacer.Update();
    }

    input.LateUpdate();

    window.requestAnimationFrame(function() {
      that.GameLoop(that);
    });
  }

  Start() {
    var that = this;
    resources.Load(function() {
      that.graphics.LoadResources();
      that.AddInputs();
      that.LoadScene('testScene');
      that.ms = Date.now();
      that.GameLoop(that);
    });
  }

  AddInputs() {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
      Log('Movile platform');
      input.isDesktop = false;
      input.AddListeners();
      this.AddVirtualInputs();
    } else {
      Log('Desktop platform');
      input.isDesktop = true;
      input.AddListeners();
      this.AddInputKeys();
    }
  }

  AddInputKeys() {
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

  AddVirtualInputs() {
    let fullScreenBtn = input.AddVirtualInput(new VirtualInput('fullScreenBtn', 'btn_placeHolder', new Vec2(-0.07, -0.07), new Vec2(1.0, 1.0), new Vec2(0.1, 0.1), 0.1));
    fullScreenBtn.AddAction(this.EnterFullScreen);
    fullScreenBtn.AddAction(this.ExitFullscreen);
  };

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName) {
    if (this.scene) this.scene.Unload();
    this.scene = this.scenes.get(sceneName);
    this.scene.LoadByteCode();
  }

  EnterFullScreen(){
    let elem = document.documentElement;
    let success = false;
    try{
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        success = true;
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
        success = true;
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
        success = true;
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
        success = true;
      }
    } catch(e){
      Log('FAILED TO ENABLE FULLSCREEN');
    }

    if (success)
      Log('FULLSCREEN ENABLED');
  }

  ExitFullScreen(){
    let success = false;
    let elem = document;
    try{
      if (elem.exitFullscreen) {
        elem.exitFullscreen();
        success = true;
      } else if (elem.mozCancelFullScreen) {
        /* Firefox */
        elem.mozCancelFullScreen();
        success = true;
      } else if (elem.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitExitFullscreen();
        success = true;
      } else if (elem.msExitFullscreen) {
        /* IE/Edge */
        elem.msExitFullscreen();
        success = true;
      }
    } catch(e){
      Log('FAILED TO DISABLE FULLSCREEN');
    }

    if(success)
      Log('FULLSCREEN DISABLED');
  }
}
