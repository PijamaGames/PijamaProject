class Manager {
  constructor() {
    this.graphics = new Graphics();
    resources = new Resources();
    input = new Input();
    this.scene = null;
    this.scenes = new Map();
    this.sleepingScenes = new Map();
    this.delta = 0.0;
    this.ms = null;
    this.targetFPS = 60;
    this.musicVolume=1.0;
    this.english=false;
    this.easy=false;
    finder = new Finder();
    //mapPlacer = new MapPlacer();
    physics = new Physics();
    this.lastScene="";
    this.choosenEnviroment=1;
    this.privateRoom=false;
  }

  ManageTime() {
    var newMs = Date.now();
    let diff = (newMs - this.ms) / 1000.0;
    /*if(diff > 1/this.targetFPS){*/
      this.delta = diff;
      if (this.delta > 0.1) this.delta = 0.1;
      this.ms = newMs;
      return true;
      /*return true;
    } else {
      return false;
    }*/
  }

  DebugIteration(){
    if(input.GetKeyDown('KeyT'))
      lighting.SetMorning();
    if(input.GetKeyDown('KeyY'))
      lighting.SetAfterNoon();
    /*if(input.GetKeyDown('KeyY'))
      lighting.SetNoon();*/
    if(input.GetKeyDown('KeyH'))
      lighting.SetNight();

    if(input.GetKeyDown('Digit1'))
      this.graphics.SetMinimumSettings();
    if(input.GetKeyDown('Digit2'))
      this.graphics.SetLowSettings();
    if(input.GetKeyDown('Digit3'))
      this.graphics.SetMediumSettings();
    if(input.GetKeyDown('Digit4'))
      this.graphics.SetHighSettings();
    if(input.GetKeyDown('Digit5')){
      this.graphics.SetMaxSettings();
    }

    if(input.GetKeyDown('KeyM')){
      mapEditor.SetActive(!mapEditor.fsm.active);
    }
  }

  GameLoop(that) {
    if(DEBUG){
      this.DebugIteration();
    }
    //Log(timesComputed/timesCalled*100.0+"%");
    //Log("Gameloop iteration");

    if(that.ManageTime()){
      input.Update();
      //fsm.Update();
      if (this.scene && this.scene != null) {
        this.scene.Update();
        //this.scene.UpdatePhysics();
        physics.Update();
        lighting.Update();
        this.graphics.CanvasResponsive();
        this.graphics.Render();
        //Update map placer
        if (mapEditor) mapEditor.Update();
      }

      input.LateUpdate();
    }

    setTimeout(function(){
      that.GameLoop(that);
    }, (1/that.targetFPS)*1000);

    /*window.requestAnimationFrame(function() {
      that.GameLoop(that);
    });*/
  }

  Start(initScene = 'testScene') {
    var that = this;
    resources.Load(function() {
      InitWebSocket(()=>{
        that.graphics.LoadResources();
        that.AddInputs();

        if(DEBUG){
          mapEditor = new MapEditor();
        }

        if(input.isDesktop){
          that.graphics.SetMaxSettings();
        } else {
          that.graphics.SetLowSettings();
          manager.targetFPS = 30;
        }

        that.LoadScene(initScene);
        that.ms = Date.now();
        that.GameLoop(that);
      });
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
    }
  }

  AddVirtualInputs() {
    let fullScreenBtn = input.AddVirtualInput(new VirtualInput('fullScreenBtn', 'btn_placeHolder', new Vec2(-0.07, -0.07), new Vec2(1, 1), new Vec2(0.1, 0.1), 0.1));
    fullScreenBtn.AddAction(() => {
      manager.EnterFullScreen(()=>fullScreenBtn.NextAction());
    });
    fullScreenBtn.AddAction(() => {
      manager.ExitFullScreen(()=>fullScreenBtn.NextAction());
    });

    input.AddVirtualInput(new VirtualJoystick('leftJoystick', 'backJoystick', new Vec2(), true, 0.3, new Vec2(0.25, 0.3), new Vec2(0.3, 0.3), 0.55, 0.1, 'frontJoystick'));
  }

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName, sleep = false) {
    let newScene = this.scenes.get(sceneName);
    if(newScene == this.scene) return;

    if (this.scene && !sleep){
      this.scene.Unload();
    } else if(this.scene && sleep){
      this.sleepingScenes.set(this.scene.name, this.scene);
      this.scene.Sleep();
    }
    this.scene = newScene;

    if(this.sleepingScenes.has(this.scene.name)){
      this.sleepingScenes.delete(this.scene.name);
      this.scene.WakeUp();
      Log("WakeUp: "+this.scene.name);
    } else {
      this.scene.LoadByteCode();
      this.scene.GenerateCam();
      Log("Loaded: "+this.scene.name);
    }
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
