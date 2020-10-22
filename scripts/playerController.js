class PlayerController {
  constructor(player, idleAnimation, runAnimation, dashAnimation, attackAnimation) {

    Object.assign(this, {
      player,
      idleAnimation,
      runAnimation,
      dashAnimation,
      attackAnimation
    });

    this.CreateNodes();
    this.CreateEdges();
    this.SetEdges();

    this.playerFSM = new FSM([this.idle, this.run, this.dash, this.attack]);
  }

  SetAnimation(animation) {
    player.renderer.spriteRenderer.spriteSheetName = animation;
  }

  PlayerMove() {
    let x = input.GetKeyPressed('KeyA') * -1.0 + input.GetKeyPressed('KeyD');
    let y = input.GetKeyPressed('KeyS') * -1.0 + input.GetKeyPressed('KeyW');
    let v = new Vec2(x, y);
    v.Norm();
    v.Scale(2.0);
    this.player.rigidbody.force.Add(v);
  }

  PlayerDash() {
    //hay que restringir el movimiento en una direccion
  }

  PlayerAttack() {
    //lo q pasa cuando ataca
  }

  CreateEdges() {
    //meter de segundo parámetro lista de condiciones para ir a cada estado
    this.edgeToIdle = new Edge(this.idle,[this.IdleConditions()]);
    this.edgeToDash = new Edge(this.dash,[this.DashConditions()]);
    this.edgeToRun = new Edge(this.run, [this.RunConditions()]);
    this.edgeToAttack = new Edge(this.attack, [this.AttackConditions()]);
  }

  DashConditions(){
    //pulsar x tecla?
  }

  IdleConditions(){
    //no pulsar tecla?
  }

  RunConditions(){
    //pulsar wasd?
  }

  AttackConditions(){
    //pulsar x tecla?
  }

  CreateNodes() {
    this.idle = new Node(
      "idle", //necesito
      () => this.SetAnimation(idleAnimation)
    );
    this.run = new Node(
      "run", //necesito
      () => this.SetAnimation(runAnimation),
      () => this.PlayerMove()
    );
    this.dash = new Node(
      "dash", //necesito
      () => this.SetAnimation(runAnimation),
      () => this.PlayerDash()
    );
    this.attack = new Node(
      "attack", //necesito
      () => this.SetAnimation(attackAnimation),
      () => this.PlayerAttack()
    );
  }

  SetEdges() {
    this.idle.SetEdges([this.edgeToRun, this.edgeToAttack]);
    this.run.SetEdges([this.edgeToIdle, this.edgeToDash, this.edgeToAttack]);
    this.dash.SetEdges([this.edgeToIdle, this.edgeToRun]);
    this.attack.SetEdges([this.edgeToIdle, this.edgeToRun]);
  }

}
