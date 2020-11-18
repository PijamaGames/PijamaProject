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
    this.maxVolume=1.0;
    var eng = localStorage.getItem("english");
    if(!eng || eng == null){
      eng = false;
    }
    if(eng == "true"){
      this.english = true;
    } else {
      this.english = false;
    }
    Log("english "+this.english);
    let easy = localStorage.getItem("easy");
    if(easy){
      this.easy = easy == "true" ? true : false;
    } else {
      this.easy=true;
    }
    console.log("easy: " + this.easy);

    finder = new Finder();
    physics = new Physics();
    this.lastScene="";
    this.choosenEnviroment=1;
    this.privateRoom=false;
    this.changeLanguageEvent=new EventDispatcher();
    this.changeInMenuEvent=new EventDispatcher();
    this.menuSound;
    this.singleGameMusic;
    this.cutScene2Music;
    this.inMenu;
  }

  SetEasy(easy){
    this.easy = easy;
    localStorage.setItem("easy", easy);
  }

  VolumeFromDistance(pos1, pos2){
    let sub=Sub(pos1,pos2);
    let d=sub.Mod();
    let vol=this.maxVolume/d;

  }

  SetVolume(vol){
    this.maxVolume=vol;
    Howler.volume(vol);
  }

  SetEnglish(english){
    this.english=english;
    this.changeLanguageEvent.Dispatch();
    localStorage.setItem("english", this.english);
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
      lighting.BeginTransition(1, 3);
    if(input.GetKeyDown('KeyY'))
      lighting.BeginTransition(2, 3);
    /*if(input.GetKeyDown('KeyY'))
      lighting.SetNoon();*/
    if(input.GetKeyDown('KeyH'))
      lighting.BeginTransition(3, 3);

    if(input.GetKeyDown("KeyP"))
      DEBUG_VISUAL = !DEBUG_VISUAL;

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

    if(input.GetKeyDown("Digit9")){
      this.LoadScene("multiGame3");
    }

    if(mapEditor){
      if(input.GetKeyDown('KeyM')){
        mapEditor.SetActive(!mapEditor.fsm.active);
        DEBUG_VISUAL = mapEditor.fsm.active;
      }
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
    }, (1/that.targetFPS)*1000 - (Date.now()-this.ms));

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
        that.AddMenuSound();
        that.CheckFocusLost();
        if(EDITOR_MODE){
          mapEditor = new MapEditor();
        }

        let savedGraphics = localStorage.getItem("graphics");
        Log("saved graphics " + savedGraphics);
        if(savedGraphics != null){
          that.graphics.SetSettingsByNumber(parseInt(savedGraphics));
        } else {
          if(input.isDesktop){
            that.graphics.SetSettingsByNumber(4);
          } else {
            that.graphics.SetSettingsByNumber(1);
            physics.MovileSettings();
          }
        }

        that.LoadScene(initScene);
        that.ms = Date.now();
        //that.changeLanguageEvent.Dispatch();
        that.GameLoop(that);
      });
    });
  }

  AddMenuSound(){
    this.menuSound=new AudioSource(["menuSound"]);
    this.singleGameMusic=new AudioSource(["levelSound"]);
    this.changeInMenuEvent.AddListener(this,()=>this.SetInMenu());
    this.cutScene2Music=new AudioSource(["kinematicSound"]);
    //this.menuSound.PlayAll();
  }

  SetInMenu(bool){
    this.inMenu=bool;
    if(bool){
      this.menuSound.LoopAll(true);
      this.menuSound.PlayAll();
    }
    else this.menuSound.PauseAll();
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

    input.AddVirtualInput(new VirtualJoystick('leftJoystick', 'backJoystick', new Vec2(), true, 0.3, new Vec2(0.25, 0.3), new Vec2(0.3, 0.3), 0.35, 0.1, 'frontJoystick'));

    input.AddVirtualInput(new VirtualJoystick('rightJoystick', 'backJoystick', new Vec2(-0.15), false, 0.3, new Vec2(1.0, 0.3), new Vec2(0.25, 0.25), 0.17, 0.1, 'hummingbirdJoystick'));

    let dashBtn = input.AddVirtualInput(new VirtualInput('dashBtn', 'btn_dash', new Vec2(-0.42, 0), new Vec2(1, 0.3), new Vec2(0.15, 0.15), 0.1));

    let cacBtn = input.AddVirtualInput(new VirtualInput('cacBtn', 'btn_CAC', new Vec2(-0.33, 0.18), new Vec2(1, 0.3), new Vec2(0.15, 0.15), 0.1));

    let beeBtn = input.AddVirtualInput(new VirtualInput('beeBtn', 'btn_bee', new Vec2(-0.15, 0.26), new Vec2(1, 0.3), new Vec2(0.15, 0.15), 0.1));

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
      if(sceneName != "gallery"){
        prefabFactory.ClearCounts();
      }
      this.scene.GenerateCam();
      this.scene.LoadByteCode();
      Log("Loaded: "+this.scene.name);
    }
    if(Renderer.hoverSet){
      Renderer.hoverSet = new Set();
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

  CheckFocusLost(){
    var hidden = "hidden";

     if (hidden in document)
       document.addEventListener("visibilitychange", this.OnChange);
     else if ((hidden = "mozHidden") in document)
       document.addEventListener("mozvisibilitychange", this.OnChange);
     else if ((hidden = "webkitHidden") in document)
       document.addEventListener("webkitvisibilitychange", this.OnChange);
     else if ((hidden = "msHidden") in document)
       document.addEventListener("msvisibilitychange", this.OnChange);
  }

  OnChange(){
    if(socket!=null && user && (user.isHost || user.isClient)) socket.close();
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
