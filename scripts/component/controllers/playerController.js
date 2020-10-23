class PlayerController extends Component {
  constructor(idleAnimation, runAnimation, dashAnimation, attackAnimationIdle, attackAnimationRun) {

    super();
    this.type = "playerController";

    Object.assign(this, {
      idleAnimation,
      runAnimation,
      dashAnimation,
      attackAnimationIdle,
      attackAnimationRun
    });
  }

  Update(){
    this.playerFSM.Update();
  }

  //Start functions nodes
  SetAnimation(animation) {
    this.gameobj.renderer.SetTextureByName(animation);
  }

  SetAnimationAttack(animationRun,animationIdle) {
    if(this.WASDPressed()){
      this.gameobj.renderer.SetTextureByName(animationRun);
    }
    else{
      this.gameobj.renderer.SetTextureByName(animationIdle);
    }
  }

  WASDPressed(){
    return input.GetKeyPressed('KeyW') && input.GetKeyPressed('KeyA') && input.GetKeyPressed('KeyS') && input.GetKeyPressed('KeyD');
  }

  //Update functions nodes
  PlayerMove() {
    let x;
    let y;
    if(this.WASDPressed()){
      x = input.GetKeyPressed('KeyA') * -1.0 + input.GetKeyPressed('KeyD');
      y = input.GetKeyPressed('KeyS') * -1.0 + input.GetKeyPressed('KeyW');
    }
    else if(input.GetKeyPressed('ArrowLeft') && input.GetKeyPressed('ArrowRight') && input.GetKeyPressed('ArrowDown') && input.GetKeyPressed('ArrowUp')){
      x = input.GetKeyPressed('ArrowLeft') * -1.0 + input.GetKeyPressed('ArrowRight');
      y = input.GetKeyPressed('ArrowDown') * -1.0 + input.GetKeyPressed('ArrowUp');
    }

    let v = new Vec2(x, y);
    v.Norm();
    v.Scale(2.0);
    this.gameobj.rigidbody.force.Add(v);
  }

  PlayerDash() {

    //hay que restringir el movimiento en una direccion
  }

  PlayerAttack() {

    //lo q pasa cuando ataca, rellenar cuando tengamos enemigos
  }

  CoolDownDash(){

  }

  //Edges conditions
  DashConditions(){
    if (input.GetKeyPressed('Space'))
      return true;
    else
      return false;
  }

  IdleConditions(){
    for(var [key, value] of input.keys){
      if (input.GetKeyPressed(key))
        return false;
    }
    return true;
  }

  RunConditions(){
    if (input.GetKeyPressed('W') || input.GetKeyPressed('A') || input.GetKeyPressed('S') || input.GetKeyPressed('D'))
      return true;
    else
      return false;
  }

  AttackConditions(){
    if (input.mouseLeftDown)
      return true;
    else
      return false;
  }

  CreateNodes() {
    this.idle = new Node(
      "idle",
      ()=>{this.SetAnimation(this.idleAnimation);}
    );
    this.run = new Node(
      "run",
      ()=>{this.SetAnimation(this.runAnimation);},
      //()=>{this.PlayerMove()}
    );
    this.dash = new Node(
      "dash",
      ()=>{this.SetAnimation(this.dashAnimation);},
      ()=>{this.PlayerDash();},
      ()=>{this.CoolDownDash();}
    );
    this.attack = new Node(
      "attack",
      ()=>{this.SetAnimationAttack(this.attackAnimationIdle,this.attackAnimationRun);},
      ()=>{this.PlayerAttack();}
    );
  }

  CreateEdges() {
    this.edgeToIdle = new Edge(this.idle,[this.IdleConditions()]);
    this.edgeToDash = new Edge(this.dash,[this.DashConditions()]);
    this.edgeToRun = new Edge(this.run, [this.RunConditions()]);
    this.edgeToAttack = new Edge(this.attack, [this.AttackConditions()]);
  }

  SetEdges() {
    this.idle.SetEdges([this.edgeToRun, this.edgeToAttack]);
    this.run.SetEdges([this.edgeToIdle, this.edgeToDash, this.edgeToAttack]);
    this.dash.SetEdges([this.edgeToIdle, this.edgeToRun]);
    this.attack.SetEdges([this.edgeToIdle, this.edgeToRun]);
  }

  CreateFSM(){
    this.CreateNodes();
    this.CreateEdges();
    this.SetEdges();

    this.playerFSM = new FSM([this.idle, this.run, this.dash, this.attack]);
    this.playerFSM.Start('idle');
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.playerController = this;
    this.CreateFSM();
  }

}
