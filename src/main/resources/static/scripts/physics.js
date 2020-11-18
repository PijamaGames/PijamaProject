var physics;
class Physics {
  constructor() {
    this.steps = 1;
    this.stepPCT = 1.0 / this.steps;
    this.rawRepusltion = 45.0;
    this.repulsion = this.rawRepusltion/this.steps;
    this.timer = 0.0;
    this.fpsCount = 0;
    this.timeCount = 0.0;
    this.rigidbodyMaxDist = 7.7;
    this.staticMaxDist = 6.8;
    this.checkCollidersInBoundsInterval = 0.2;
    this.CheckCollidersInBoundsLoop();
  }

  SetSteps(steps){
    this.steps = steps;
    this.stepPCT = 1.0 / this.steps;
    this.repulsion = this.rawRepusltion/this.steps;
    Log("PHYSICS STEPS: "+this.steps);
  }

  MovileSettings(){
    this.rigidbodyMaxDist = 5.5;
    this.staticMaxDist = 3.7;
    this.checkCollidersInBoundsInterval = 0.25;
  }

  CheckCollidersInBoundsLoop(){
    var that = this;
    setTimeout(()=>{
      if(!(user && user.isClient) && manager.scene && manager.scene != null){
        for (var rb of manager.scene.rigidbodies) {
          rb.CheckMaxDist();
        }
        for (var col of manager.scene.colliderGroupsSet){
          col.CheckMaxDist();
        }
      }
      that.CheckCollidersInBoundsLoop();
    },that.checkCollidersInBoundsInterval*1000);
  }

  Update() {
    if(DEBUG_PHYSICS){
      this.timer += manager.delta;
      var init = Date.now();
      this.fpsCount += 1;
      if(this.timer >= 1.0){
        Log("FPS: "+this.fpsCount+" Average physics time per frame: " + Math.round(this.timeCount / this.fpsCount) + " ms");
        this.fpsCount = 0;
        this.timeCount = 0;
        this.timer = 0;
        this.logStep = true;
      }

    }

    //if(user && user.isClient) return;
    /*for (var rb of manager.scene.rigidbodies) {
      rb.CheckMaxDist();
    }
    for (var col of manager.scene.colliderGroupsSet){
      col.CheckMaxDist();
    }*/
    for (var rb of manager.scene.rigidbodies) {
      rb.PrepareVelocity();
    }
    for (var i = 0; i < this.steps; i++) {
      this.PerformStep();
    }
    if(DEBUG_PHYSICS){
      this.timeCount += (Date.now()-init);
      this.logStep = false;
    }

  }

  PerformStep() {
    let cg1;
    let cg2;
    let groups = manager.scene.colliderGroups;
    let groupsWithRb = manager.scene.colliderGroupsWithRb;
    let triggers = manager.scene.triggers;

    if(DEBUG_VISUAL){
      for(let cg of groups){
        for(let c of cg.colliders){
          c.SetTint(0.0,1.0,0.0,c.tint[3]);
        }
      }
      for(let cg of groupsWithRb){
        for(let c of cg.colliders){
          c.SetTint(0.0,1.0,0.0,c.tint[3]);
        }
      }
      for(let cg of triggers){
        for(let c of cg.colliders){
          c.SetTint(0.0,1.0,0.0,c.tint[3]);
        }
      }
    }
    let resolveColNotRb = 0;
    for(var i = 0; i < groups.length; i++){
      cg1 = groups[i];
      for(var j = 0; j < groupsWithRb.length; j++){
        cg2 = groupsWithRb[j];
        this.ResolveColliderGroups(cg1,cg2);
        resolveColNotRb+=1;
      }
      for(let t of triggers){
        cg2 = t;
        if(cg1 == cg2) continue;
        this.ResolveColliderGroups(cg1, cg2);
        resolveColNotRb+=1;
      }
    }

    let resolveColWithRb = 0;
    for (var i = 0; i < groupsWithRb.length; i++) {
      cg1 = groupsWithRb[i];
      for (var j = i+1; j < groupsWithRb.length; j++) {
        cg2 = groupsWithRb[j];
        this.ResolveColliderGroups(cg1,cg2);
        resolveColWithRb+=1;
      }
    }

    for(var t of triggers){
      for(let c of t.colliders){
        if(c.isTrigger){
          c.CheckNonActiveTriggers();
        }
      }
    }

    if(DEBUG_PHYSICS && this.logStep){
      Log("ColStaticNum: "+ groups.length + " | ColRbNum: " + groupsWithRb.length + " | Triggers: " + triggers.size + " | StaticIter: " + resolveColNotRb + " | RbIter: " + resolveColWithRb);
    }

    for (var rb of manager.scene.rigidbodies) {
      rb.UpdatePhysics();
    }
  }

  ResolveColliderGroups(cg1, cg2){
    //if(!cg1.gameobj.rigidbody && !cg2.gameobj.rigidbody) return;
    let dir;
    for(var c1 of cg1.colliders){
      //if(c1.gameobj.transform.height > 0.0) continue;
      for(var c2 of cg2.colliders){
        //if(c2.gameobj.transform.height > 0.0) continue;
        dir = c1.CheckCollision(c2);
        dir.Scale(this.repulsion);
        if(!c1.isTrigger && !c2.isTrigger){
          if(c1.gameobj.rigidbody ){
            c1.gameobj.rigidbody.AddForce(dir);
          }
          if(c2.gameobj.rigidbody){
            c2.gameobj.rigidbody.AddForce(dir.Opposite());
          }
          if(DEBUG_VISUAL){
            if(dir.mod > 0.0){
              c1.SetTint(1.0,0.0,0.0,c1.tint[3]);
              c2.SetTint(1.0,0.0,0.0,c2.tint[3]);
            }
          }
        }
        else{
          c1.CheckTrigger(c2);
          c2.CheckTrigger(c1);
          if(DEBUG_VISUAL){
            //c1.isColliding && c2.isColliding
            if(c1.isColliding){
              c1.SetTint(0.0,0.0,1.0,c1.tint[3]);
              c2.SetTint(0.0,0.0,1.0,c2.tint[3]);
            }
          }
        }
      }
    }
  }

}
