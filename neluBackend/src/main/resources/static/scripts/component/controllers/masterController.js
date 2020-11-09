class MasterController extends Component{
  constructor(){
    super();
    this.type = "masterController";
    this.cameraFree = false;
    this.moveSpeed = 0.5;
    var that = this;
    this.enemyType = 0;
    this.listener = input.clickEvent.AddListener(this, ()=>that.SpawnEnemy(), false);
  }

  Destroy(){
    this.listener.Remove();
    this.gameobj.scene.masterController=null;
  }

  SpawnEnemy(){
    if(Renderer.hoverSet && Renderer.hoverSet.size != 0) return;
    SendEnemy(this.enemyType, input.clickPosition);
  }

  get player(){
    return manager.scene.players.values().next().value;
  }

  CreateFSM(){
    var that = this;
    let followNode = new Node("follow").SetUpdateFunc(()=>{

      if(that.player && that.player != null){
        //Log("update camera follow");
        manager.scene.camera.camera.target = that.player.transform.GetWorldPos();
      }
    }).SetEdges([
      new Edge("move").AddCondition(()=>that.cameraFree),
    ]);

    let moveNode = new Node("move").SetUpdateFunc(()=>{
      //Log("update camera move");
      let axis = input.GetLeftAxis();
      manager.scene.camera.camera.target.Add(axis.Scale(that.moveSpeed));
    }).SetEdges([
      new Edge("follow").AddCondition(()=>!that.cameraFree),
    ]);

    this.fsm = new FSM([followNode, moveNode]).Start("follow");
  }

  Update(){
    if(this.cameraFree){
      if(input.GetBlockCamera()){
        Log("block cam");
        this.cameraFree = false;
      }
    } else {
      if (input.GetFreeCamera()){
        Log("free cam");
        this.cameraFree = true;
      }
    }

    if(this.fsm){
      this.fsm.Update();
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.masterController = this;
    this.gameobj.scene.masterController=this;
    this.CreateFSM();
  }
}
