var physics;
class Physics {
  constructor() {
    this.steps = 3;
    this.stepPCT = 1.0 / this.steps;
    this.repulsion = 45/this.steps;
  }

  Update() {
    for (var rb of manager.scene.rigidbodies) {
      rb.PrepareVelocity();
    }
    for (var i = 0; i < this.steps; i++) {
      this.PerformStep();
    }
  }

  PerformStep() {
    let cg1;
    let cg2;
    let groups = manager.scene.colliderGroups;

    if(DEBUG){
      for(var cg of groups){
        for(var c of cg.colliders){
          c.SetTint(0.0,1.0,0.0,c.tint[3]);
        }
      }
    }

    for (var i = 0; i < groups.length; i++) {
      cg1 = groups[i];
      for (var j = i+1; j < groups.length; j++) {
        cg2 = groups[j];
        this.ResolveColliderGroups(cg1,cg2);
      }
    }

    for (var rb of manager.scene.rigidbodies) {
      rb.UpdatePhysics();
    }
  }

  ResolveColliderGroups(cg1, cg2){
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
          if(DEBUG){
            if(dir.mod > 0.0){
              c1.SetTint(1.0,0.0,0.0,c1.tint[3]);
              c2.SetTint(1.0,0.0,0.0,c2.tint[3]);
            }
          }
        }
        else{
          c1.CheckTrigger(c2);
          c2.CheckTrigger(c1);
          if(DEBUG){
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
