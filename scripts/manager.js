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

  Start(initScene = 'testScene') {
    var that = this;
    resources.Load(function() {
      that.graphics.LoadResources();
      that.AddInputs();
      that.LoadScene(initScene);
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
    let fullScreenBtn = input.AddVirtualInput(new VirtualInput('fullScreenBtn', 'btn_placeHolder', new Vec2(-0.07, -0.07), new Vec2(1, 1), new Vec2(0.1, 0.1), 0.1));
    fullScreenBtn.AddAction(() => {
      manager.EnterFullScreen(()=>fullScreenBtn.NextAction());
    });
    fullScreenBtn.AddAction(() => {
      manager.ExitFullScreen(()=>fullScreenBtn.NextAction());
    });

    let leftJoystick = input.AddVirtualInput(new VirtualJoystick('leftJoystick', 'backJoystick', new Vec2(), new Vec2(0.25, 0.5), new Vec2(0.3, 0.3), 0.6, 0.2, 'frontJoystick'));
  }

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName) {
    if (this.scene) this.scene.Unload();
    this.scene = this.scenes.get(sceneName);
    this.scene.LoadByteCode();
  }

  EnterFullScreen(callback = function(){}) {
    let elem = document.documentElement;

    if (elem.requestFullscreen) {
      let promise = elem.requestFullscreen().then(()=>{
        Log('FULLSCREEN ENABLED');
        callback();
        return true;
      }).catch((e)=>{
        Log('FAILED TO ENABLE FULLSCREEN'+e);
        return false;
      });
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      let promise = elem.mozRequestFullScreen().then(()=>{
        Log('FULLSCREEN ENABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO ENABLE FULLSCREEN');
        return false;
      });
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      let promise = elem.webkitRequestFullscreen().then(()=>{
        Log('FULLSCREEN ENABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO ENABLE FULLSCREEN');
        callback();
        return false;
      });
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      let promise = elem.msRequestFullscreen().then(()=>{
        Log('FULLSCREEN ENABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO ENABLE FULLSCREEN');
        return false;
      });
    }
  }

  ExitFullScreen(callback = function(){}) {
    let elem = document;
    if (elem.exitFullscreen) {
      let promise = elem.exitFullscreen().then(()=>{
        Log('FULLSCREEN DISABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO DISABLE FULLSCREEN');
        return false;
      });

    } else if (elem.mozCancelFullScreen) {
      /* Firefox */
      let promise = elem.mozCancelFullScreen().then(()=>{
        Log('FULLSCREEN DISABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO DISABLE FULLSCREEN');
        return false;
      });
    } else if (elem.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      let promise = elem.webkitExitFullscreen().then(()=>{
        Log('FULLSCREEN DISABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO DISABLE FULLSCREEN');
        return false;
      });
    } else if (elem.msExitFullscreen) {
      /* IE/Edge */
      let promise = elem.msExitFullscreen().then(()=>{
        Log('FULLSCREEN DISABLED');
        callback();
        return true;
      }).catch(()=>{
        Log('FAILED TO DISABLE FULLSCREEN');
        return false;
      });
    }
  }
}
