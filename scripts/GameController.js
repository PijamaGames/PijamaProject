class GameController {

  constructor() {
    this.delta = 0.0;
    //this.date = new Date();
    this.ms = Date.now();
    this.refreshRate = 5;
    this.step = 1.0/this.refreshRate;
    this.elapsed = 0.0;
    this.frameElapsedFlag = false;
    this.scenes = new Map();
    this.currentScene = null;
    this.graphics = new Graphics();
    this.resources = new Resources();
    this.input = new InputController();
  }

  set fps(newFps){
    this.refreshRate = newFps;
    this.step = 1.0/this.refreshRate;
  }

  get fps(){
    return this.refreshRate;
  }

  ManageTime() {
    var newMs = Date.now();
    this.delta = (newMs - this.ms)/1000.0;
    this.elapsed += this.delta;

    if(this.elapsed>this.step){
      this.elapsed-=this.step;
      this.frameElapsedFlag=true;
    }

    this.ms = newMs;
  }

  GameLoop(that) {
      that.ManageTime();
      that.input.Update();
      //that.graphics.UpdateDimensions();
      that.currentScene.Update();
      /*let obj = that.currentScene.gameObjects.get('firstObject');
      if(obj){
        let transform = obj.transform;
        transform.ry = transform.ry + that.delta*10.0;
      }*/

      that.graphics.Render();
      //that.currentScene.gameObjects[0].transform.sy += 1;
      that.LowerFlags();

      window.requestAnimationFrame(function(){
        that.GameLoop(that);
      });
  }

  Start(){
    //0-ADD INPUT keys
    this.AddInputKeys();
    //1-CREATE GRAPHICS CONTEXT
    this.graphics.Init();
    //2-LOAD GAME RESOURCES
    var that = this;
    this.resources.Load(function(){
      //Once resources are loaded
      //3-CREATE PROGRAMS
      that.graphics.CreatePrograms();
      that.graphics.CreatePostProcessEffects();
      //4-LOAD SCENE
      that.LoadGameObjs();
      //5-START GAMELOOP
      that.GameLoop(that);
    });

  }

  AddInputKeys(){
    this.input.AddKey('KeyW');
    this.input.AddKey('KeyA');
    this.input.AddKey('KeyS');
    this.input.AddKey('KeyD');
  }

  LoadGameObjs(){
    var go1 = new GameObject("firstObject", null, testScene, [
      new Transform(),
      new Mesh('stage'),
      new Renderer('opaque', 'grassTex')
    ]);

    //go1.components['Mesh'].DefaultPlane();
    var go2 = new GameObject("secondObject", null, testScene, [
      new Transform(),
      new Mesh(),
      new Renderer('opaque', 'boxTex'),
      //new FlyController(2.0, 10.0)
    ]);
    //go2.components['Mesh'].DefaultPlane();
    //go1.transform.rx = 45;
    //go1.transform.ry = 180;
    //go1.transform.rz = 45;
    go1.transform.pz = -18;
    go1.transform.px = 0;
    go1.transform.py = -3;
    //go2.transform.px = 2;
    //go2.transform.py = 1;
    go2.transform.pz = -10;
    go1.transform.ry = 240;
    //go2.ry = 45;

    //this.currentScene.AddGameObject(go1);
  }

  LowerFlags() {
    this.frameElapsedFlag = false;
  }

  AddScene(scene) {
    this.scenes.set(scene.name, scene);
  }

  LoadScene(sceneName) {
    this.currentScene = this.scenes.get(sceneName);
  }
}
