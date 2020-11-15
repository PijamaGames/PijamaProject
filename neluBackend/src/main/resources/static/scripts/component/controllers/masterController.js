class MasterController extends Component{
  constructor(){
    super();
    this.type = "masterController";
    this.cameraFree = false;
    this.moveSpeed = 0.5;
    var that = this;
    this.enemyType = 0;
    this.listener = input.clickEvent.AddListener(this, ()=>that.SpawnEnemy(), false);
    this.maxMonkeys = 7;
    this.maxBeekeepers = 3;
    this.monkeys = 0;
    this.beekeepers = 0;
    this.monkeyCooldown = 5.0;
    this.monkeyTime = 0.0;
    this.beekeeperCooldown = 10.0;
    this.beekeeperTime=0.0;
    this.selectedTint = new Float32Array([0.6,0.6,1.0]);
  }

  UpdateCounts(){
    let aliveMonkeys = 0;
    let aliveBeekeepers = 0;
    for(let enemy of manager.scene.enemies){
      if(enemy.enemyController.isMonkey){
        aliveMonkeys++;
      } else {
        aliveBeekeepers++;
      }
    }
    let mY = this.maxMonkeys-aliveMonkeys;
    let bY = this.maxBeekeepers-aliveBeekeepers;

    if(this.monkeys < mY){
      this.monkeyTime+=manager.delta;
      if(this.monkeyTime >= this.monkeyCooldown){
        this.monkeyTime -= this.monkeyCooldown;
        this.monkeys += 1;
      }
    }
    if(this.beekeepers<bY){
      this.beekeeperTime+=manager.delta;
      if(this.beekeeperTime>=this.beekeeperCooldown){
        this.beekeeperTime-=this.beekeeperCooldown;
        this.beekeepers+=1;
      }
    }

    this.UpdateTexts(mY,bY);
  }

  UpdateTexts(mY=this.maxMonkeys, bY=this.maxBeekeepers){
    let mX = this.monkeys;
    let bX = this.beekeepers;
    let auxM =""+ mX + "/"+mY;
    this.monkeyButton.textBox.SetText(manager.english ? "Monkeys: " + auxM : "Monos: "+auxM);
    let auxB =""+ bX + "/"+bY;
    this.beekeeperButton.textBox.SetText(manager.english ? "Beekeepers: " + auxB : "Apicultores: "+auxB);
  }

  Destroy(){
    this.listener.Remove();
    this.gameobj.scene.masterController=null;
  }

  SpawnEnemy(){
    if(Renderer.hoverSet && Renderer.hoverSet.size != 0) return;
    if(this.enemyType == 0){
      if(this.monkeys > 0){
        this.monkeys--;
        SendEnemy(this.enemyType, input.clickPosition);
      }
    } else {
      if(this.beekeepers>0){
        this.beekeepers--;
        SendEnemy(this.enemyType, input.clickPosition);
      }
    }
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
    this.UpdateCounts();
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.masterController = this;
    this.gameobj.scene.masterController=this;
    this.CreateFSM();

    this.beekeeperButton=prefabFactory.CreateObj("BeekeeperButton", new Vec2(0.25,0.1));
    this.monkeyButton = prefabFactory.CreateObj("MonkeyButton", new Vec2(-0.25,0.1));
    this.monkeyButton.renderer.SetTint(this.selectedTint[0],this.selectedTint[1],this.selectedTint[2]);
    this.UpdateTexts();
  }
}
