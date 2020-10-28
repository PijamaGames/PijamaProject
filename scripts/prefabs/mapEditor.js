var mapEditor;
class MapEditor {
  constructor() {
    this.cameraSpeed = 300.0;

    this.bytecodeText = document.getElementById('bytecodeText');

    this.selected = null;
    this.lastTint = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    this.overlapTint = new Float32Array([0.7, 0.7, 1.0, 1.0]);
    this.lastMousePos = new Vec2();
    this.lastScale;
    this.scaleFactor = 2.5;
    this.goToGalleryObj = null;
    this.copyBytecodeObj = null;
    this.currentScene;
    this.hoverCount = 0;

    var that = this;
    var selectNode = new Node("select").SetStartFunc(()=>{
      that.currentScene = manager.scene.name;
      that.bytecodeText.value = manager.scene.bytecode;
      //Log("BYTECODE: "+manager.scene.bytecode);

      if(that.goToGalleryObj != null){
        that.goToGalleryObj.SetScene(manager.scene);
      }else{
        that.goToGalleryObj = prefabFactory.CreateObj("GoToGallery", new Vec2(-0.2,0.1));
      }
      if(that.copyBytecodeObj != null){
        that.copyBytecodeObj.SetScene(manager.scene);
      } else {
        that.copyBytecodeObj = prefabFactory.CreateObj("CopyBytecode", new Vec2(0.25,0.1));
      }
    }).SetUpdateFunc(() => {
      that.CheckOverlappedObjs();
    }).SetExitFunc(()=>{
      if(that.goToGalleryObj != null){
        that.goToGalleryObj.Destroy();
        that.goToGalleryObj = null;
      }
      if(that.copyBytecodeObj != null){
        that.copyBytecodeObj.Destroy();
        that.copyBytecodeObj = null;
      }


      if(that.selected != null)
        that.selected.renderer.tint = that.lastTint;
    }).SetEdges([
      new Edge("put").AddCondition(()=>input.mouseLeftDown && that.selected != null && !that.hoverCount > 0).SetFunc(()=>{
        manager.scene.RemoveObjFromBytecode(that.selected);
        Log("BYTECODE: "+manager.scene.bytecode);
      }),
      new Edge("delete").AddCondition(()=>input.GetKeyDown("KeyX") && that.selected != null).SetFunc(()=>{
        manager.scene.RemoveObjFromBytecode(that.selected);
        Log("BYTECODE: "+manager.scene.bytecode);
      }),
      new Edge("copy").AddCondition(()=>that.selected != null && input.GetKeyDown("KeyC") && !that.hoverCount > 0),
      new Edge("gallery").AddCondition(()=>manager.scene.name == "gallery"),
    ]);

    var galleryNode = new Node("gallery").SetStartFunc(()=>{
      that.hoverCount = 0;
      that.selected = null;
    }).SetUpdateFunc(()=>{
      that.CheckOverlappedObjs();
    }).SetExitFunc(()=>{
      manager.LoadScene(that.currentScene);
    }).SetEdges([
      new Edge("copy").AddCondition(()=>input.mouseLeftDown && that.selected != null),
      new Edge("select").AddCondition(()=>manager.scene.name == that.currentScene),
    ]);

    var putNode = new Node("put").SetUpdateFunc(()=>{
      //that.selected.transform.SetWorldCenter(Vec2.Sub(input.mouseGridPosition, Vec2.Scale(that.selected.transform.anchor, 1.0)));
      that.selected.transform.SetWorldPosition(Vec2.Add(input.mouseGridPosition, Vec2.Scale(that.selected.transform.anchor, 0.5)));
    }).SetEdges([
      new Edge("select").AddCondition(()=>input.mouseLeftDown).SetFunc(()=>{
        manager.scene.AddObjToBytecode(that.selected);
        that.bytecodeText.value = manager.scene.bytecode;
        Log("BYTECODE: "+manager.scene.bytecode);
      }),
      new Edge("delete").AddCondition(()=>input.GetKeyDown("KeyX")),
      new Edge("scale").AddCondition(()=>input.GetKeyDown("Space") && !that.selected.renderer.vertical),
    ]);

    var scaleNode = new Node("scale").SetStartFunc(()=>{
      that.lastMousePos.Set(input.mouseGridPosition.x, input.mouseGridPosition.y);
      that.lastScale = that.selected.transform.scale.Copy();
      //canvas.requestPointerLock();
    }).SetUpdateFunc(()=>{
      that.selected.transform.scale.Set(
        Math.floor(Math.abs(input.mouseWorldPosition.x-that.lastMousePos.x)*this.scaleFactor+1),
        Math.floor(Math.abs(input.mouseWorldPosition.y-that.lastMousePos.y)*this.scaleFactor+1)
      );
    }).SetExitFunc(()=>{
      //document.exitPointerLock();
    }).SetEdges([
      new Edge("put").AddCondition(()=>input.GetKeyUp("Space")),
    ]);

    var copyNode = new Node("copy").SetStartFunc(()=>{
      that.CopySelected();
    }).SetEdges([
      new Edge("put"),
    ]);

    var deleteNode = new Node("delete").SetStartFunc(()=>{
      if(that.selected && that.selected != null){
        that.selected.Destroy();
        that.selected = null;
      }
    }).SetEdges([
      new Edge("select"),
    ]);

    this.fsm = new FSM([selectNode, putNode, scaleNode, copyNode, galleryNode, deleteNode]);
    this.fsm.active = false;
    //this.SetActive(false);
    //this.SetActive(true); //The mapEditor is activated when a scene is loaded in Manager.LoadScene
  }

  Update() {
    if(this.fsm.active){
      let camPos = manager.scene.camera.transform.GetWorldPos().Copy();
      let axis = input.GetLeftAxis();
      camPos.Add(axis.Scale(this.cameraSpeed*manager.delta*(input.GetKeyPressedF('ShiftLeft')+1.0)));
      manager.scene.camera.camera.target = camPos;
    }

    this.fsm.Update();
  }

  SetActive(active){
    this.fsm.active = active;

    let renderers = finder.FindComponents("renderer");
    for(let r of renderers){
      if(r.isUI && r.gameobj != this.goToGalleryObj && r != this.copyBytecodeObj && !r.isText){
        r.gameobj.SetActive(!active);
      }
    }

    if(active){
      this.fsm.Start("select");
      let nelu = finder.FindObjectsByType("Nelu");
      if(nelu.length > 0){
        this.player = nelu[0];
        this.player.playerController.playerFSM.active = false;
        this.player.playerController.playerFSM.Stop();
      }
    } else {
      this.fsm.Stop();
      manager.graphics.res = manager.graphics.defaultRes.Copy();
      if(this.player){
        this.player.playerController.playerFSM.active = true;
        this.player.playerController.playerFSM.Start("idle");
      }
    }
  }

  CopySelected(){
    this.selected = prefabFactory.CreateObj(
      this.selected.type,
      input.mouseGridPosition,
      this.selected.transform.height,
      this.selected.transform.scale
    );
  }

  CheckOverlappedObjs(){
    let that = this;
    let pos = input.mouseWorldPosition;
    let objs = manager.scene.GetObjectsInBoundaries(pos);
    if(objs.length == 0){
      if(that.selected != null){
        that.selected.renderer.tint = that.lastTint;
        that.selected = null;
      }
      return;
    }
    let closest = null;
    let minDist = 999999999999999.99999;

    let dist;
    for (let obj of objs) {
      if (obj.renderer) {
        if (obj.renderer.isUI) {
          continue;
        } else {
          dist = obj.transform.Distance(input.mouseWorldPosition);
          if (dist < minDist) {
            minDist = dist;
            closest = obj;
          }
        }
      }
    }

    if (closest && closest != null) {
      if (that.selected != null) {
        that.selected.renderer.tint = that.lastTint;
      }
      that.selected = closest;

      that.lastTint = closest.renderer.tint;
      closest.renderer.tint = that.overlapTint;
    }
  }
}

/*var mapPlacer;
class MapPlacer {
  constructor() {
    this.gameobj = null;
    this.overlappedObj = null;
    this.gameobjType = '';

    this.editorDiv = document.getElementById('editor');
    this.bytecodeText = document.getElementById('bytecodeText')
    this.newObjectTypeField = document.getElementById('objectType');
    this.createButton = document.getElementById('create');
    this.copyButton = document.getElementById('copyButton');
    this.objectTypeDiv = document.getElementById('objectTypeDiv');

    var that = this;
    this.copyButton.onclick = () => that.CopyBytecode(that);
    this.createButton.onclick = () => that.CreateGameobj(that);

    //Add object type buttons
    let button;
    //let text;
    let i = 0;
    if (prefabMapper.size > 0) {
      for (var [objName, createFunc] of prefabMapper) {
        button = document.createElement('button');
        button.innerHTML = objName;
        this.objectTypeDiv.appendChild(button);
        let text = objName;
        button.onclick = function() {
          that.newObjectTypeField.value = text;
          that.CreateGameobj(that);
        };
        if (i >= 5) {
          this.objectTypeDiv.appendChild(document.createElement('br'));
          i = 0;
        }
        i++;
      }
    }

    this.isVisible = true;
  }

  set isVisible(isVisible) {
    this.editorDiv.hidden = !(isVisible && EDITOR_MODE);
  }
  get isVisible() {
    return !this.editorDiv.hidden;
  }

  CopyBytecode(that) {
    that.bytecodeText.select();
    that.bytecodeText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  CreateGameobj(that) {
    var createFunc = prefabMapper.get(that.newObjectTypeField.value);
    if (createFunc) {
      this.DestroyGameobj();
      this.gameobjType = that.newObjectTypeField.value;
      that.gameobj = createFunc();
      that.gameobj.transform.SetWorldCenter(input.mouseGridPosition);
    }
  }

  DestroyGameobj(){
    if (this.gameobj) this.gameobj.Destroy();
    this.gameobj = null;
  }

  AddGameobj(that) {
    if (that.gameobj) {
      let str = this.scene.bytecode === '' ? '' : '\n';
      str += that.gameobj.bytecode;
      that.scene.bytecode += str;
      that.gameobj = null;
      that.UpdateInfo();
    }
  }

  UpdateInfo() {
    this.bytecodeText.value = this.scene.bytecode;
  }

  CheckOverlap(){
    if(this.overlappedObj && this.overlappedObj.renderer){
      //this.overlappedObj.renderer.SetTint(0.5,0.5,1.0,1.0);
      this.overlappedObj.renderer.SetTint(1.0,1.0,1.0,1.0);
    }
    let overlappedList = manager.scene.GetObjectsInBoundaries(input.mouseWorldPosition);
    let closestObj = null;
    let minDist = Infinity;
    let dist = 0.0;
    for(let obj of overlappedList){
      dist = obj.transform.Distance(input.mouseWorldPosition);
      if(dist < minDist){
        closestObj = obj;
        minDist = dist;
      }
    }
    if(closestObj){
      this.overlappedObj = closestObj;
      this.overlappedObj.renderer.SetTint(0.5,0.5,1.0,1.0);
    }
    return closestObj;
  }

  Update() {
    if(!this.isVisible) return;
    if (this.scene != manager.scene) {
      this.scene = manager.scene;
      this.UpdateInfo();
    }
    if (this.gameobj) {
      //let gridPos = input.mouseGridPosition;
      this.gameobj.transform.worldPos = (input.mouseGridPosition);
      if (input.mouseLeftDown) {
        this.AddGameobj(this);
      }
      if(input.GetKeyDown('KeyR')){
        this.DestroyGameobj();
      }
    } else {
      if(this.CheckOverlap()){
        if (input.mouseLeftDown) {
          this.scene.RemoveObjFromBytecode(this.overlappedObj);
          this.gameobj = this.overlappedObj;
          this.overlappedObj.renderer.SetTint(1.0,1.0,1.0,1.0);
          this.overlappedObj = null;
          this.gameobjType = this.gameobj.name;
          this.newObjectTypeField.value = this.gameobjType;
          this.game
          this.UpdateInfo();
        }
      }
    }
    if (input.GetKeyDown('Space')){
      if(this.overlappedObj){
        if(this.overlappedObj.renderer){
          this.overlappedObj.renderer.SetTint(1.0,1.0,1.0,1.0);
        }
        this.overlappedObj = null;
      }
      this.CreateGameobj(this);


    }
    //Log(this.scene.gameobjs);
  }
}
*/
