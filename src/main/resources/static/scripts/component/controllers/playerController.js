class PlayerController extends Component {
  constructor() {
    super();
    this.type = "playerController";
    this.speed = 2.0;
    this.camOffset = 5.0;
    this.leftAxis = new Vec2();
    this.rawLeftAxis = new Vec2();
    this.lerpLeftAxis = 10.0;
    this.endAttackAnim=false;

    this.maxLife = 50;
    this.life = 30;
    this.canTakeDamage = true;
    this.damageCooldown = 0.5;
    this.damageTime = 0.0;

    this.combo = false;
    this.numCombo = 1;
    this.waitComboMaxTime = 0.05;
    this.waitComboTime = 0.0;
    this.attackDir = new Vec2();
    this.attackImpulse = 1.0;
    this.attack1Speed = 16;
    this.attack2Speed = 16;
    this.attack3Speed = 17;
    this.dieSpeed = 12;
    this.dashImpulse = 3.5;
    this.dashInitImpulse = 2.0;
    this.dashMaxTime = 0.25;
    this.dashTime = 0.0;
    this.dashing = false;
    this.dashMaxCooldown = 0.3;
    this.dashCooldown = this.dashMaxCooldown;

    this.particlePosition = new Vec2(0,-1);
    this.particleDisplacement = 0.4;

    //this.colibriOrBees = false;
    this.hasColibri = true;
    this.hasBees = true;

    this.beesPool = [];
    this.allBees = [];
    this.maxBees = 20;
    this.numBees = this.maxBees;
    this.beeBirthMaxTime = 0.33;
    this.beeBirthTime = 0.0;
    this.beesTarget = null;

    this.firePower = false;
    this.fireTint = new Float32Array([1.6,1.2,1.0]);
    this.firePowerMaxTime = 14;
    this.firePowerTime = 0.0;
    this.fire = null;
    this.fireDisplacement = 1.2;
    this.fireImpulse = 5.0;
    this.fireLightLerp = 2.0;

    this.allBeesDiedEvent=new EventDispatcher();
    this.beeSourceSound;

  }

  SetScene(scene){
    this.gameobj.scene.players.delete(this.gameobj);
    scene.players.add(this.gameobj);
    if(this.lifeUnits){
      for(let obj of this.lifeUnits){
        obj.SetScene(scene);
      }
    }
  }

  Destroy(){
    this.gameobj.scene.players.delete(this.gameobj);

    this.colibri.Destroy();
    for(var bee of this.allBees){
      bee.Destroy();
    }

    if(this.lifeUnits){
      for(let obj of this.lifeUnits){
        obj.Destroy();
      }
    }
  }

  CheckFirePower(){
    if(this.firePower){
      this.firePowerTime += manager.delta;
      if(this.firePowerTime > this.firePowerMaxTime){
        this.DeactivateFirePower();
      }
    }

    let target = this.firePower ? this.originalFireLightStrength : 0.0;
    let lerp = manager.delta * this.fireLightLerp;
    this.gameobj.lightSource.strength = this.gameobj.lightSource.strength * (1.0-lerp) + target * lerp;
  }

  Update(){
    //Log("playerSpd: " + this.gameobj.rigidbody.velocity.mod);
    if(user && user.isClient) return;
    if(!this.playerFSM.active) return;
    let leftAxis = input.GetLeftAxis();
    this.rawLeftAxis.Set(leftAxis.x, leftAxis.y);
    let axisDir = Vec2.Sub(this.rawLeftAxis, this.leftAxis);
    this.leftAxis.Add(axisDir.Scale(this.lerpLeftAxis*manager.delta));
    this.playerFSM.Update();
    this.dashCooldown+=manager.delta;



    /*if(input.GetChangeSkillDown()){
      this.ChangeSkill();
    }*/
    this.ReloadBees();
    this.ManageBeesTarget();
    //this.canAttack = this.canAttack || input.GetKeyUp("Space");

    this.CheckFirePower();

    if(!this.canTakeDamage && this.life > 0){
      this.damageTime+=manager.delta;
      if(this.damageTime > this.damageCooldown){
        this.canTakeDamage = true;
        if(this.firePower){
          this.gameobj.renderer.SetTint(this.fireTint[0], this.fireTint[1], this.fireTint[2]);
        } else {
          let aux = this.gameobj.renderer.realTint;
          this.gameobj.renderer.SetTint(aux[0],aux[1],aux[2]);
        }

      }
    }
  }

  /*ChangeSkill(){
    this.colibriOrBees = !this.colibriOrBees;
    Log("Skill: " + (this.colibriOrBees ? "bees" : "colibri"));
  }*/

  ReloadBees(){
    if(this.numBees == this.maxBees) return;
    this.beeBirthTime += manager.delta;
    if(this.beeBirthTime > this.beeBirthMaxTime){
      let lastNumBees = this.numBees;
      let poolSize = this.beesPool.length;
      this.numBees = Math.min(this.numBees+1, poolSize);
      if(lastNumBees != this.numBees){
        this.beeBirthTime = 0.0;
        //Log("Num bees: " + this.numBees);
      }
    }
  }

  ManageBeesTarget(){
    if(!this.beesTarget || this.beesTarget == null || !this.beesTarget.enemyController.canTakeDamage || this.beesTarget.scene != this.gameobj.scene){
      this.beesTarget = this.GetBeesTarget();

    }
  }

  PlayerMove() {
    let axis = this.leftAxis.Copy();

    this.gameobj.renderer.SetDirection(axis);
    this.particles.renderer.SetDirection(axis);

    let movement = axis.Scale(this.speed);
    this.gameobj.rigidbody.force.Add(movement);
  }

  PlayerADAttack(){
    if(input.GetADBeesDown()){

      if(this.hasBees){
        this.ThrowBees();
      }
    }
    if(input.GetADColibriDown()){
      if(this.hasColibri){
        this.ThrowColibri();
      }
    }
  }

  ThrowColibri(){
    if(!this.gameobj.scene.canUseColibri) return;
    if(this.gameobj.scene.paused) return;
    if(Renderer.hoverSet && Renderer.hoverSet.size != 0) return;
    Log("THROW COLIBRI");
    this.hasColibri = false;
    this.colibri.audioSource.PlayAll();
    this.colibri.SetActive(true);
    this.colibri.colibriController.SetLocalPosDir(input.GetRightAxis(this.gameobj));
    this.colibri.rigidbody.velocity.Set(this.gameobj.rigidbody.velocity.x, this.gameobj.rigidbody.velocity.y).Scale(2.5);
  }

  PauseSoundBees(){
    this.beeSourceSound.audioSource.PauseAll();
    //Log("escuchando");
  }

  ThrowBees(){
    if(!this.gameobj.scene.canUseBees) return;
    if(Renderer.hoverSet && Renderer.hoverSet.size != 0) return;
    this.beesTarget = this.GetBeesTarget();
    if(this.beesTarget != null){
      Log("THROW " + this.numBees +" BEES");
      let wp = this.gameobj.transform.GetWorldFloor();
      this.beeSourceSound=this.beesPool[0];
      this.beeSourceSound.audioSource.PlayAll();
      this.allBeesDiedEvent.AddListener(this,()=>this.PauseSoundBees());
      for(var i = 0; i < this.numBees; i++){
        let bee = this.BeePoolPop();
        bee.transform.SetWorldPosition(wp);
        //bee.beeController.SetTarget(target);
      }
      this.numBees = 0;
      this.beeBirthTime = 0.0;
    } else {
      Log("No target for bees");
    }
  }

  GetBeesTarget(){
    if(this.gameobj.scene.enemies.length == 0) return null;
    let closest = null;
    let minDist = 9999999999999.9999;
    let dist;
    let playerPos = this.gameobj.transform.GetWorldPos();
    for(var enemy of this.gameobj.scene.enemies){
      if(!enemy.active || !enemy.enemyController.canTakeDamage) continue;
      dist = Vec2.Distance(playerPos, enemy.transform.GetWorldPos());
      if(dist < minDist){
        closest = enemy;
        minDist = dist;
      }
    }
    return closest;
  }

  OnCreate(){
    //Log("center: " + this.gameobj.transform.GetWorldCenter().toString());
    //Log(this.gameobj.scene.name);
    this.originalFireLightStrength = this.gameobj.lightSource.strength;
    this.gameobj.lightSource.strength = 0.0;
    this.gameobj.scene.camera.transform.SetWorldPosition(this.gameobj.transform.GetWorldCenter().Copy());
    //Log(this.gameobj.scene.camera.transform.GetWorldPos().toString("camPos:"));
  }

  CreateFSM(){
    var that = this;

    let idleNode = new Node('idle').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('idle', 'nelu_idle', 5);
      //manager.scene.camera.transform.SetWorldPosition(that.gameobj.transform.GetWorldCenter().Copy());
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('idle');
      manager.scene.camera.camera.target = that.gameobj.transform.GetWorldCenter().Copy();
      that.numCombo = 1;
    }).SetUpdateFunc(()=>{
      that.PlayerADAttack();
    }).SetEdges([
      new Edge('run').AddCondition(()=>{
        return that.rawLeftAxis.mod > 0.05 && !manager.scene.paused
      }).SetFunc(()=>{
        that.gameobj.renderer.SetAnimation('run');
      }),
      new Edge('attack1').AddCondition(()=>{
        return input.GetAttackCACDown() && !manager.scene.paused
      }),
      new Edge('die').AddCondition(()=>that.life <= 0),
      new Edge('dash').AddCondition(()=>input.GetDashDown() && that.dashCooldown > that.dashMaxCooldown && !manager.scene.paused).SetFunc(()=>{
        that.gameobj.renderer.SetAnimation('run');
      }),
    ]);

    let runNode = new Node('run').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('run', 'nelu_run', 16);

    }).SetStartFunc(()=>{
      //that.gameobj.renderer.SetAnimation('run');
      that.numCombo = 1;

    }).SetUpdateFunc(()=>{
      that.PlayerMove();
      that.PlayerADAttack();
      let camTarget = that.gameobj.transform.GetWorldCenter().Copy().Add(Vec2.Scale(that.leftAxis, that.camOffset));
      manager.scene.camera.camera.target = camTarget;

    }).SetEdges([
      new Edge('idle').AddCondition(()=>that.rawLeftAxis.mod < 0.05),
      new Edge('idle').AddCondition(()=>manager.scene.paused),
      new Edge('attack1').AddCondition(()=>input.GetAttackCACDown()),
      new Edge('dash').AddCondition(()=>input.GetDashDown() && that.dashCooldown > that.dashMaxCooldown),
      new Edge('die').AddCondition(()=>that.life <= 0),
    ]);

    let attack1Node = new Node('attack1').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack1', 'nelu_attack1', that.attack1Speed, false);
      that.particles.renderer.AddAnimation('attack1', 'nelu_particles1', that.attack1Speed, false);
      //
      //that.particles.transform.SetLocalPosition(that.particlePosition);
    }).SetStartFunc(()=>{
      that.gameobj.audioSource.Play("comboSound1");
      that.gameobj.renderer.SetAnimation('attack1');
      that.particles.renderer.SetAnimation('attack1');
      that.particles.SetActive(true);
      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);
      that.attackDir = that.gameobj.renderer.dir.Copy();
      //that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, that.attackImpulse));
      that.particles.renderer.SetDirection(that.attackDir);
      //that.combo = false;

      let displacement = Vec2.Norm(that.attackDir).Scale(that.particleDisplacement+0.5*Math.abs(that.attackDir.x));
      that.particles.transform.SetLocalPosition(Vec2.Add(that.particlePosition, displacement));

      if(this.firePower){
        this.MakeFirePower();
      }

    }).SetUpdateFunc(()=>{
      that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, this.attackImpulse));
    }).SetExitFunc(()=>{
      that.numCombo = 2;
      that.particles.SetActive(false);
    }).SetEdges([
      new Edge('idle').AddCondition(()=>manager.scene.paused),
      new Edge('waitCombo').AddCondition(()=>that.endAttackAnim),
      new Edge('die').AddCondition(()=>that.life <= 0),
    ]);

    let attack2Node = new Node('attack2').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack2', 'nelu_attack2', that.attack2Speed, false);
      that.particles.renderer.AddAnimation('attack2', 'nelu_particles2', that.attack2Speed, false);

    }).SetStartFunc(()=>{
      that.gameobj.audioSource.Play("comboSound2");
      that.gameobj.renderer.SetAnimation('attack2');
      that.particles.renderer.SetAnimation('attack2');
      that.particles.SetActive(true);
      that.endAttackAnim=false;
      that.attackDir = that.gameobj.renderer.dir.Copy();
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);
      //that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, that.attackImpulse));
      let displacement = Vec2.Norm(that.attackDir).Scale(that.particleDisplacement+0.5*Math.abs(that.attackDir.x));
      that.particles.transform.SetLocalPosition(Vec2.Add(that.particlePosition, displacement));
      that.combo = false;
      that.particles.renderer.SetDirection(that.attackDir);
    }).SetUpdateFunc(()=>{
      that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, this.attackImpulse));
    }).SetExitFunc(()=>{
      that.numCombo = 3;
      that.particles.SetActive(false);
    }).SetEdges([
      new Edge('idle').AddCondition(()=>manager.scene.paused),
      new Edge('waitCombo').AddCondition(()=>that.endAttackAnim),
      new Edge('die').AddCondition(()=>that.life <= 0),
    ]);

    let attack3Node = new Node('attack3').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack3', 'nelu_attack3', that.attack3Speed, false);
      that.particles.renderer.AddAnimation('attack3', 'nelu_particles3', that.attack3Speed, false);

    }).SetStartFunc(()=>{
      that.gameobj.audioSource.Play("comboSound3");
      that.gameobj.renderer.SetAnimation('attack3');
      that.particles.renderer.SetAnimation('attack3');
      that.particles.SetActive(true);
      that.attackDir = that.gameobj.renderer.dir.Copy();
      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);

      that.combo = false;
      let displacement = Vec2.Norm(that.attackDir).Scale(that.particleDisplacement+0.5*Math.abs(that.attackDir.x));
      that.particles.transform.SetLocalPosition(Vec2.Add(that.particlePosition, displacement));
      that.particles.renderer.SetDirection(that.attackDir);

    }).SetUpdateFunc(()=>{
      that.gameobj.rigidbody.force.Add(Vec2.Scale(that.attackDir, this.attackImpulse));
    }).SetExitFunc(()=>{
      //that.combo = false;
      that.numCombo = 4;
      that.particles.SetActive(false);
    }).SetEdges([
      new Edge('idle').AddCondition(()=>manager.scene.paused),
      new Edge('waitCombo').AddCondition(()=>that.endAttackAnim),
      new Edge('die').AddCondition(()=>that.life <= 0),
    ]);

    let waitComboNode = new Node("waitCombo").SetStartFunc(()=>{
      that.waitComboTime = 0;
      lighting.motionBlur = 0.0;
    }).SetUpdateFunc(()=>{
      that.waitComboTime += manager.delta;
      that.combo = (that.combo || input.GetAttackCACDown()) && that.numCombo <= 3;
      let axis = this.leftAxis.Copy();
      this.gameobj.renderer.SetDirection(axis);
    }).SetEdges([
      new Edge('idle').AddCondition(()=>manager.scene.paused),
      new Edge('idle').AddCondition(()=>!that.combo && that.rawLeftAxis.mod < 0.05 && that.waitComboTime > that.waitComboMaxTime),
      new Edge('run').AddCondition(()=>!that.combo &&that.rawLeftAxis.mod > 0.05 && that.waitComboTime > that.waitComboMaxTime).SetFunc(()=>{
        that.gameobj.renderer.SetAnimation('run');
      }),
      new Edge('attack2').AddCondition(()=>that.combo && that.numCombo == 2),
      new Edge('attack3').AddCondition(()=>that.combo && that.numCombo == 3),
      new Edge('die').AddCondition(()=>that.life <= 0),
    ]);

    let dashNode = new Node("dash").SetStartFunc(()=>{

      //that.gameobj.rigidbody.force.Add(dir.Scale(that.dashImpulse));
      that.gameobj.renderer.paused = true;
      that.gameobj.audioSource.Play("dashSound");
      //this.dashMaxTime = 0.2;
      this.dashTime = 0.0;
      this.dashing = true;
      let dir = that.gameobj.renderer.dir.Copy();
      that.gameobj.rigidbody.force.Add(dir.Scale(that.dashInitImpulse));
    }).SetUpdateFunc(()=>{
      this.dashTime += manager.delta;
      let dir = that.gameobj.renderer.dir.Copy();
      that.gameobj.rigidbody.force.Add(dir.Scale(that.dashImpulse));
    }).SetExitFunc(()=>{
      this.dashing = false;
      that.gameobj.renderer.paused = false;
      that.dashCooldown = 0.0;
    }).SetEdges([
      new Edge('idle').AddCondition(()=>manager.scene.paused),
      new Edge('idle').AddCondition(()=>that.rawLeftAxis.mod < 0.05 && that.dashTime > that.dashMaxTime),
      new Edge('run').AddCondition(()=>that.rawLeftAxis.mod > 0.05 && that.dashTime > that.dashMaxTime),
      new Edge('attack1').AddCondition(()=>{
        return input.GetAttackCACDown() && !manager.scene.paused
      }),
    ]);

    let dieNode = new Node("die").SetOnCreate(()=>{

      that.gameobj.renderer.AddAnimation('die', 'nelu_die', that.dieSpeed, false);
    }).SetStartFunc(()=>{
      this.gameobj.audioSource.Play("neluDied");
      that.gameobj.renderer.SetAnimation('die');
      that.gameobj.renderer.endAnimEvent.AddListener(this, ()=>{
        that.PlayerDead();
      }, true);
    });

    this.playerFSM = new FSM([idleNode, runNode, dashNode, waitComboNode, attack1Node, attack2Node, attack3Node, dieNode]).Start('idle');
  }

  PlayerDead(){
    if(user && user.isHost){
      SendEndGame(false);
    } else {
      manager.LoadScene("connectionFailed");
      manager.SetInMenu(true);
      var text=document.getElementById("ConnectionTitle");
      text.innerHTML=manager.english? "Game over":"Fin del juego";
    }
  }

  MakeFirePower(){
    this.fire.SetActive(true);
    this.fire.renderer.SetDirection(this.gameobj.renderer.dir);
    this.fire.renderer.tile.x = 0;
    this.fire.transform.SetWorldPosition(Vec2.Add(this.gameobj.transform.GetWorldFloor(), Vec2.Norm(this.gameobj.renderer.dir).Scale(this.fireDisplacement)));
    let force = Vec2.Norm(this.gameobj.renderer.dir).Scale(this.fireImpulse);
    this.fire.rigidbody.velocity.Set(0,0);
    this.fire.rigidbody.force.Set(force.x, force.y);
  }

  TakeDamage(damage){
    if(this.canTakeDamage && !this.dashing){
      if (this.gameobj.audioSource)this.gameobj.audioSource.Play("neluDamage");
      this.life -= damage;
      if(this.life <= 0){
        this.life = 0;
      } else if(damage > 0) {
        this.gameobj.renderer.SetTint(1.0,0.0,0.0);
        this.damageTime = 0.0;
        this.canTakeDamage = false;
      }
      this.AdjustLifeUnits();

      //var text=document.getElementById("LifeText");
      //text.innerHTML=this.life + "HP";
      //this.lifeText.textBox.SetText(this.life + "HP");
    }

  }

  AdjustLifeUnits(){
    if(this.lifeUnits){
      let pct;
      for(var i = 0; i < this.lifeUnits.length; i++){
        pct = this.life - i*10;
        if(pct <0.1){
          this.lifeUnits[i].renderer.tile.x = 17;
        } else if(pct > 9.9){
          this.lifeUnits[i].renderer.tile.x = 19;
        } else {
          this.lifeUnits[i].renderer.tile.x = 18;
        }
      }
    }
  }

  GainLife(life){
    this.gameobj.audioSource.Play("healSound");
    this.life += life;
    if(this.life > this.maxLife){
      this.life = this.maxLife;
    }
    this.AdjustLifeUnits();

    //var text=document.getElementById("LifeText");
    //text.innerHTML=this.life + "HP";
  }

  ActivateFirePower(){
    let battle=finder.FindObjectsByType("BattleManager");
    if(this.gameobj.audioSource.Playing("powerupFireSound"))
      this.gameobj.audioSource.Stop("powerupFireSound");

    if(battle[0] && battle[0].audioSource.Playing("monkeyHouseSound"))
      battle[0].audioSource.Stop("monkeyHouseSound");
    this.gameobj.audioSource.Play("powerupFireSound");
    manager.singleGameMusic.PauseAll();
    let music=finder.FindObjectsByType("PauseFromMultiGame");
    if(music[0]){
      music[0].audioSource.Pause("arenaMusic");
    }
    this.firePower = true;
    this.firePowerTime = 0.0;

    if(this.canTakeDamage){
      this.gameobj.renderer.SetTint(this.fireTint[0], this.fireTint[1], this.fireTint[2]);
    }

    Log("activate fire power");
  }

  DeactivateFirePower(){
    let battle=finder.FindObjectsByType("BattleManager");
    this.gameobj.audioSource.Stop("powerupFireSound");
    if(battleController && battle[0]){
      if(!manager.singleGameMusic.Playing("levelSound") && !battleController.inBattle){
        manager.singleGameMusic.LoopAll(true);
        manager.singleGameMusic.PlayAll();
      }
      else if(battleController.inBattle){
        battle[0].audioSource.LoopAll(true);
        battle[0].audioSource.Play("monkeyHouseSound");
      }
    }
    let music=finder.FindObjectsByType("PauseFromMultiGame");
    if(music[0] && !music[0].audioSource.Playing("arenaMusic")){
      music[0].audioSource.Play("arenaMusic");
    }

    if(this.canTakeDamage){
      let aux = this.gameobj.renderer.realTint;
      this.gameobj.renderer.SetTint(aux[0], aux[1], aux[2]);
    }

    this.firePower = false;
    Log("deactivate fire power");
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.playerController = this;



    this.particles = prefabFactory.CreateObj("neluParticles", new Vec2(/*1.5*/0.0,-1), 1);
    this.particles.SetParent(this.gameobj);
    //this.particles.transform.height = 1.0;
    this.particles.SetActive(false);

    this.colibri = prefabFactory.CreateObj("Colibri", new Vec2(), 1);
    this.colibri.colibriController.player = this.gameobj;
    this.colibri.SetActive(false);

    this.FillBeePool();

    this.fire = prefabFactory.CreateObj("neluFire", new Vec2(), 1);
    var that = this;
    this.fire.renderer.endAnimEvent.AddListener(this, ()=>{
      that.fire.SetActive(false);
    });
    //this.fire.SetParent(this.gameobj);
    this.fire.transform.SetWorldPosition(this.gameobj.transform.GetWorldFloor());
    this.fire.SetActive(false);

    this.CreateFSM();
    manager.scene.players.add(this.gameobj);

    if(!(user && user.isClient)){
      this.CreateLifeUnitUI();
    }

    //this.lifeText = prefabFactory.CreateObj("lifeText", new Vec2(0.15,-0.1));
    this.TakeDamage(0);

  }

  CreateLifeUnitUI(){
    let displacement = 0.08;
    let start = 0.2;
    this.lifeUnits = [];
    let obj;
    for(var i = 0; i < 5; i++){
      obj = prefabFactory.CreateObj("LifeUnitUI", new Vec2(start+displacement*i, -0.07));
      this.lifeUnits.push(obj);
    }
  }

  FillBeePool(){
    let obj
    for(var i = 0; i < this.maxBees; i++){
      obj = prefabFactory.CreateObj("Bee", new Vec2(), 0.5);
      obj.SetActive(false);
      obj.beeController.player = this.gameobj;
      this.beesPool.push(obj)
      this.allBees.push(obj);
    }
  }

  BeePoolPop(){
    let obj
    if(this.beesPool.length > 0){
      obj = this.beesPool.pop();
      obj.SetActive(true);
    }
    return obj;
  }

  BeePoolAdd(obj){

    obj.beeController.lifeTime = 0.0;
    this.beesPool.push(obj);
    if(this.beesPool.length==this.maxBees) {
      this.allBeesDiedEvent.Dispatch();
      //Log("DESPACHANDO");
    }
    obj.SetActive(false);
  }
}
