var mapPlacer;
class MapPlacer{
  constructor(){
    this.editorDiv = document.getElementById('editor');
    this.bytecodeText = document.getElementById('bytecodeText')
    this.newObjectTypeField = document.getElementById('objectType');
    this.createButton = document.getElementById('create');
    this.addButton = document.getElementById('add');
    this.copyButton = document.getElementById('copyButton');
    this.objectTypeDiv = document.getElementById('objectTypeDiv');

    var that = this;
    this.copyButton.onclick = ()=>that.CopyBytecode(that);
    this.createButton.onclick = ()=>that.CreateGameobj(that);
    this.addButton.onclick = ()=>that.AddGameobj(that);

    let button;
    //let text;
    let i = 0;
    if(prefabMapper.size > 0){
      for(var [objName, createFunc] of prefabMapper){
        button = document.createElement('button');
        button.innerHTML = objName;
        this.objectTypeDiv.appendChild(button);
        let text = objName;
        button.onclick = function(){
          that.newObjectTypeField.value = text;
          that.CreateGameobj(that);
        };
        if(i >= 5){
          this.objectTypeDiv.appendChild(document.createElement('br'));
          i = 0;
        }
        i++;
      }
    }

    this.gameobj = null;
    this.gameobjType = '';

    if(EDITOR_MODE){
      this.editorDiv.hidden = false;
    }
  }

  CopyBytecode(that){
    that.bytecodeText.select();
    that.bytecodeText.setSelectionRange(0,99999);

    document.execCommand("copy");
  }

  CreateGameobj(that){
    var createFunc = prefabMapper.get(that.newObjectTypeField.value);
    if(createFunc){
      if(this.gameobj) this.gameobj.Destroy();
      this.gameobjType = that.newObjectTypeField.value;
      that.gameobj = createFunc();
    }
  }

  AddGameobj(that){
    if(that.gameobj){
      let str = ''+that.gameobjType + ' ' +
      that.gameobj.transform.position.x + ' ' +
      that.gameobj.transform.position.y + ' ' +
      that.gameobj.transform.height + '\n';
      that.scene.bytecode += str;
      that.UpdateInfo();
      this.gameobj = null;
    }
  }

  UpdateInfo(){
    this.scene = manager.scene;
    if(this.scene.bytecode && this.scene.bytecode !== ''){
      this.bytecodeText.value = this.scene.bytecode.slice(1);
      //this.bytecodeText.value = this.scene.bytecode.match(/[^\r\n]+/g).join('\n');
    }
  }

  Update(){
    if(this.scene != manager.scene){
      this.UpdateInfo();
    }
    if(this.gameobj){
      //let gridPos = input.mouseGridPosition;
      this.gameobj.transform.position.Set(
        input.mouseGridPosition.x,
        input.mouseGridPosition.y
      )
      if(input.mouseLeftDown){
        this.AddGameobj(this);
      }
    }
    if(input.GetKeyDown('Space')){
      this.CreateGameobj(this);
    }
  }
}
