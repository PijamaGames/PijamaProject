var mapPlacer;
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
    }
  }

  DestroyGameobj(){
    if (this.gameobj) this.gameobj.Destroy();
    this.gameobj = null;
  }

  AddGameobj(that) {
    if (that.gameobj) {
      let str = this.scene.bytecode === '' ? '' : '\n';
      str += that.gameobjType + ' ' +
        that.gameobj.transform.position.x + ' ' +
        that.gameobj.transform.position.y + ' ' +
        that.gameobj.transform.height;
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
      this.gameobj.transform.SetWorldCenter(input.mouseGridPosition);
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
          this.UpdateInfo();
        }
      } else if (input.GetKeyDown('Space')){
        this.CreateGameobj(this);
      }
    }
    //Log(this.scene.gameobjs);
  }
}
