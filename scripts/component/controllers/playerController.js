class PlayerController extends Component {
  constructor() {

    super();
    this.type = "playerController";
    this.speed = 2.0;
    this.camOffset = 3.0;
    this.leftAxis = new Vec2();
    this.rawLeftAxis = new Vec2();
    this.lerpLeftAxis = 10.0;
    this.endAttackAnim=false;
    this.life = 45;
    this.combo = false;
    this.numCombo = 1;
    this.waitComboMaxTime = 0.05;
    this.waitComboTime = 0.0;
    this.attackDir = new Vec2();
    this.attackImpulse = 20.0;
    this.attack1Speed = 16;
    this.attack2Speed = 16;
    this.attack3Speed = 17;
    this.dashImpulse = 50.0;
    this.dashMaxTime = 0.1;
    this.dashTime = 0.0;
    this.dashMaxCooldown = 0.4;
    this.dashCooldown = this.dashMaxCooldown;

    this.particlePosition = new Vec2(0,-1);
    this.particleDisplacement = 0.4;

  }

  SetScene(scene){
    this.gameobj.scene.players.delete(this.gameobj);
    scene.players.add(this.gameobj);
  }

  Destroy(){
    this.gameobj.scene.players.delete(this.gameobj);
  }

  Update(){
    let leftAxis = input.GetLeftAxis();
    this.rawLeftAxis.Set(leftAxis.x, leftAxis.y);
    let axisDir = Vec2.Sub(this.rawLeftAxis, this.leftAxis);
    this.leftAxis.Add(axisDir.Scale(this.lerpLeftAxis*manager.delta));
    this.playerFSM.Update();
    this.dashCooldown+=manager.delta;
  }


  PlayerMove() {
    let axis = this.leftAxis.Copy();

    this.gameobj.renderer.SetDirection(axis);
    this.particles.renderer.SetDirection(axis);

    let movement = axis.Scale(this.speed);
    this.gameobj.rigidbody.force.Add(movement);
  }

  CreateFSM(){
    var that = this;

    let idleNode = new Node('idle').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('idle', 'nelu_idle', 5);
      manager.scene.camera.transform.SetWorldPosition(that.gameobj.transform.GetWorldCenter().Copy());
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('idle');
      manager.scene.camera.camera.target = that.gameobj.transform.GetWorldCenter().Copy();
      that.numCombo = 1;
    }).SetEdges([
      new Edge('run').AddCondition(()=>that.rawLeftAxis.mod > 0.05).SetFunc(()=>{
        that.gameobj.renderer.SetAnimation('run');
      }),
      new Edge('attack1').AddCondition(()=>input.mouseLeftDown),
    ]);

    let runNode = new Node('run').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('run', 'nelu_run', 16);

    }).SetStartFunc(()=>{
      //that.gameobj.renderer.SetAnimation('run');
      that.numCombo = 1;

    }).SetUpdateFunc(()=>{
      that.PlayerMove();
      let camTarget = that.gameobj.transform.GetWorldCenter().Copy().Add(Vec2.Scale(that.leftAxis, that.camOffset));
      manager.scene.camera.camera.target = camTarget;

    }).SetEdges([
      new Edge('idle').AddCondition(()=>that.rawLeftAxis.mod < 0.05),
      new Edge('attack1').AddCondition(()=>input.mouseLeftDown),
      new Edge('dash').AddCondition(()=>input.GetKeyDown("Space") && that.dashCooldown > that.dashMaxCooldown),
    ]);

    let attack1Node = new Node('attack1').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack1', 'nelu_attack1', that.attack1Speed, false);
      that.particles.renderer.AddAnimation('attack1', 'nelu_particles1', that.attack1Speed, false);
      //
      //that.particles.transform.SetLocalPosition(that.particlePosition);
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('attack1');
      that.particles.renderer.SetAnimation('attack1');
      that.particles.SetActive(true);
      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);
      that.attackDir = that.gameobj.renderer.dir.Copy();
      that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, that.attackImpulse));
      that.combo = false;

      let displacement = Vec2.Norm(that.attackDir).Scale(that.particleDisplacement+0.5*Math.abs(that.attackDir.x));
      that.particles.transform.SetLocalPosition(Vec2.Add(that.particlePosition, displacement));

    }).SetUpdateFunc(()=>{
      //METER LO Q HACE MIENTRAS ATACA
      that.combo = that.combo || input.mouseLeftDown;
    }).SetExitFunc(()=>{
      that.numCombo = 2;
      that.particles.SetActive(false);
    }).SetEdges([
      new Edge('waitCombo').AddCondition(()=>that.endAttackAnim),
    ]);

    let attack2Node = new Node('attack2').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack2', 'nelu_attack2', that.attack2Speed, false);
      that.particles.renderer.AddAnimation('attack2', 'nelu_particles2', that.attack2Speed, false);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('attack2');
      that.particles.renderer.SetAnimation('attack2');
      that.particles.SetActive(true);
      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);
      that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, that.attackImpulse));
      that.combo = false;
    }).SetUpdateFunc(()=>{
      //METER LO Q HACE MIENTRAS ATACA
      this.combo = this.combo || input.mouseLeftDown;
    }).SetExitFunc(()=>{
      that.numCombo = 3;
      that.particles.SetActive(false);
    }).SetEdges([
      new Edge('waitCombo').AddCondition(()=>that.endAttackAnim),
    ]);

    let attack3Node = new Node('attack3').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack3', 'nelu_attack3', that.attack3Speed, false);
      that.particles.renderer.AddAnimation('attack3', 'nelu_particles3', that.attack3Speed, false);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('attack3');
      that.particles.renderer.SetAnimation('attack3');
      that.particles.SetActive(true);

      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);
      that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, this.attackImpulse));
      that.combo = false;
    }).SetExitFunc(()=>{
      that.combo = false;
      that.particles.SetActive(false);
    }).SetEdges([
      new Edge('waitCombo').AddCondition(()=>that.endAttackAnim),
    ]);

    let waitComboNode = new Node("waitCombo").SetStartFunc(()=>{
      that.waitComboTime = 0;
      lighting.motionBlur = 0.0;
    }).SetUpdateFunc(()=>{
      that.waitComboTime += manager.delta;
      //that.combo = that.combo || input.mouseLeftDown;
    }).SetEdges([
      new Edge('idle').AddCondition(()=>!that.combo && that.rawLeftAxis.mod < 0.05 && that.waitComboTime > that.waitComboMaxTime),
      new Edge('run').AddCondition(()=>!that.combo &&that.rawLeftAxis.mod > 0.05 && that.waitComboTime > that.waitComboMaxTime).SetFunc(()=>{
        that.gameobj.renderer.SetAnimation('run');
      }),
      new Edge('attack2').AddCondition(()=>that.combo && that.numCombo == 2),
      new Edge('attack3').AddCondition(()=>that.combo && that.numCombo == 3),
    ]);

    let dashNode = new Node("dash").SetStartFunc(()=>{
      let dir = that.gameobj.renderer.dir.Copy();
      that.gameobj.rigidbody.force.Add(dir.Scale(that.dashImpulse));
      that.gameobj.renderer.paused = true;
      //this.dashMaxTime = 0.2;
      this.dashTime = 0.0;
    }).SetUpdateFunc(()=>{
      this.dashTime += manager.delta;
    }).SetExitFunc(()=>{
      that.gameobj.renderer.paused = false;
      that.dashCooldown = 0.0;
    }).SetEdges([
      new Edge('idle').AddCondition(()=>that.rawLeftAxis.mod < 0.05 && that.dashTime > that.dashMaxTime),
      new Edge('run').AddCondition(()=>that.rawLeftAxis.mod > 0.05 && that.dashTime > that.dashMaxTime),
    ]);

    this.playerFSM = new FSM([idleNode, runNode, dashNode, waitComboNode, attack1Node, attack2Node, attack3Node]).Start('idle');
  }

  TakeDamage(damage){
    this.life -= damage;
    this.lifeText.textBox.SetText(this.life + "HP");
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.playerController = this;

    this.particles = prefabFactory.CreateObj("neluParticles", new Vec2(/*1.5*/0.0,-1));
    this.particles.SetParent(this.gameobj);
    this.particles.transform.height = 1.0;
    this.particles.SetActive(false);

    this.CreateFSM();
    manager.scene.players.add(this.gameobj);

    this.lifeText = prefabFactory.CreateObj("lifeText", new Vec2(0.15,-0.1));
    this.TakeDamage(0);
  }
}
