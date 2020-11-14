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
    this.heightStep = 0.05;
    this.bigHeightStep = 0.5;

    this.adjustToGrid = true;

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
      if(input.GetKeyDown("KeyE")){
        Log(input.mouseGridPosition.toString("MOUSE GRID POS: "));
      }
      if(input.GetKeyDown("KeyR")){
        Log("OBJ: " + that.selected.bytecode);
      }
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
      let step = that.heightStep;
      if(input.GetKeyPressed("ShiftLeft")){
        step = that.bigHeightStep;
      }
      if(input.GetKeyDown("ArrowDown")){
        that.selected.transform.height -= step;
      }
      if(input.GetKeyDown("ArrowUp")){
        that.selected.transform.height += step;
      }
      if(input.GetKeyDown("KeyG")){
        that.adjustToGrid = !that.adjustToGrid;
      }
      //that.selected.transform.SetWorldCenter(Vec2.Sub(input.mouseGridPosition, Vec2.Scale(that.selected.transform.anchor, 1.0)));
      if(that.adjustToGrid){
        that.selected.transform.SetWorldPosition(Vec2.Add(input.mouseGridPosition, Vec2.Scale(that.selected.transform.anchor, 0.5)));
      } else {
        that.selected.transform.SetWorldPosition(Vec2.Add(input.mouseWorldPosition, Vec2.Scale(that.selected.transform.anchor, 0.5)));
      }

    }).SetEdges([
      new Edge("select").AddCondition(()=>input.mouseLeftDown).SetFunc(()=>{
        manager.scene.AddObjToBytecode(that.selected);
        that.bytecodeText.value = manager.scene.bytecode;
        Log("BYTECODE: "+manager.scene.bytecode);
      }),
      new Edge("delete").AddCondition(()=>input.GetKeyDown("KeyX")),
      new Edge("scale").AddCondition(()=>input.GetKeyDown("Space") /*&& !that.selected.renderer.vertical*/),
    ]);

    var scaleNode = new Node("scale").SetStartFunc(()=>{
      that.lastMousePos.Set(input.mouseGridPosition.x, input.mouseGridPosition.y);
      that.lastScale = that.selected.transform.scale.Copy();
      //canvas.requestPointerLock();
    }).SetUpdateFunc(()=>{
      if(!that.selected.renderer.vertical){
        that.selected.transform.scale.Set(
          Math.floor(Math.abs(input.mouseWorldPosition.x-that.lastMousePos.x)*this.scaleFactor+1),
          Math.floor(Math.abs(input.mouseWorldPosition.y-that.lastMousePos.y)*this.scaleFactor+1)
        );
      } else {
        that.selected.transform.scale.x = (Math.floor(Math.abs(input.mouseWorldPosition.x-that.lastMousePos.x))+1)*that.selected.renderer.numTiles.x;
      }

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
      //let axis = input.GetLeftAxis();
      let axis = new Vec2();
      axis.x -= input.GetKeyPressedF('KeyA');
      axis.x += input.GetKeyPressedF('KeyD');
      axis.y -= input.GetKeyPressedF('KeyS');
      axis.y += input.GetKeyPressedF('KeyW');

      camPos.Add(axis.Scale(this.cameraSpeed*manager.delta*(input.GetKeyPressedF('ShiftLeft')+1.0)));
      manager.scene.camera.camera.target = camPos;
    }

    this.fsm.Update();
  }

  SetActive(active){
    this.fsm.active = active;

    /*let renderers = finder.FindComponents("renderer");
    for(let r of renderers){
      if(r.isUI && r.gameobj != this.goToGalleryObj && r != this.copyBytecodeObj && !r.isText){
        r.gameobj.SetActive(!active);
      }
    }*/

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
        if (obj.renderer.isUI || (obj.type != "BoxColliderScalable" && input.GetKeyPressed("KeyZ"))) {
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
