class ColliderGroup extends Component{
  constructor(colliders = []){
    super();
    this.colliders=colliders;
    this.type="colliderGroup";
    this.overDist = false;
  }

  get firstCollider(){
    return this.colliders[0];
  }

  get isTrigger(){
    let t = false;
    for(let c of this.colliders){
      if(c.isTrigger) t = true;
    }
    return t;
  }

  SetScene(scene){
    /*let index = this.gameobj.scene.colliderGroups.indexOf(this);
    if(index >= 0){
      this.gameobj.scene.colliderGroups.splice(index,1);
      scene.colliderGroups.push(this);
    }*/
    for(var c of this.colliders){
      c.ExitAllTriggers();
    }
    this.RemoveColliderGroup();
    this.AddColliderGroup(scene);

    if(!this.gameobj.rigidbody){
      this.gameobj.scene.colliderGroupsSet.delete(this);
      scene.colliderGroupsSet.add(this);
    }
  }

  CheckMaxDist(){
    //if(!this.gameobj.colliderGroup) return;
    let maxDist = physics.staticMaxDist;
    let collider = this.firstCollider;
    let dist;
    if(collider.isCircular){
      dist = Vec2.Distance(this.gameobj.scene.camera.transform.GetWorldPos(),collider.worldCenter) - collider.radius;
    } else {
      let closest;
      [dist, closest] = collider.GetProjection(this.gameobj.scene.camera.transform.GetWorldPos());
    }

    //let dist = Vec2.Distance(this.gameobj.scene.camera.transform.GetWorldPos(), this.firstCollider.worldCenter/*this.gameobj.transform.GetWorldCenter()*/);
    if((dist >= maxDist && !this.overDist)||!this.gameobj.active){
      this.overDist = true;
      this.RemoveColliderGroup();
    } else if(dist < maxDist && this.overDist){
      this.overDist = false;
      this.AddColliderGroup(this.gameobj.scene);
    }
  }

  AddColliderGroup(scene){
    if(!this.gameobj.rigidbody){
      let index = scene.colliderGroups.indexOf(this);
      if(index < 0){
        scene.colliderGroups.push(this);
      }
      if(this.isTrigger){
        scene.triggers.add(this);
      }
      if(DEBUG_PHYSICS){
        let program = manager.graphics.programs.get('collider');
        for(var i = 0; i < this.colliders.length; i++){
          program.renderers.add(this.colliders[i]);
        }
      }
    }
  }

  RemoveColliderGroup(){
    if(!this.gameobj.rigidbody){
      let index = this.gameobj.scene.colliderGroups.indexOf(this);
      if(index >= 0){
        this.gameobj.scene.colliderGroups.splice(index,1);
      }
      if(this.isTrigger){
        this.gameobj.scene.triggers.delete(this);
      }
      if(DEBUG_PHYSICS){
        let program = manager.graphics.programs.get('collider');
        for(var i = 0; i < this.colliders.length; i++){
          program.renderers.delete(this.colliders[i]);
        }
      }
    }
  }

  OnSetActive(active){
    if(active){
      //this.AddColliderGroup(this.gameobj.scene);
      if(!this.gameobj.rigidbody){
        this.gameobj.scene.colliderGroupsSet.add(this);
      }
    } else {
      //this.RemoveColliderGroup();
      for(var c of this.colliders){
        c.ExitAllTriggers();
      }
      if(!this.gameobj.rigidbody){
        this.gameobj.scene.colliderGroupsSet.delete(this);
      }
    }
  }

  Destroy(){
    /*let index = this.gameobj.scene.colliderGroups.indexOf(this);
    this.gameobj.scene.colliderGroups.splice(index,1);*/
    this.RemoveColliderGroup();

    if(!this.gameobj.rigidbody){
      this.gameobj.scene.colliderGroupsSet.delete(this);
    }

    let program = manager.graphics.programs.get('collider');
    for(var i = 0; i < this.colliders.length; i++){
      program.renderers.delete(this.colliders[i]);
    }
  }

  SetGameobj(gameobj){
    for (var c of this.colliders){
      c.colliderGroup = this;
    }

    this.gameobj = gameobj;
    //this.gameobj.scene.colliderGroups.push(this);
    this.gameobj.colliderGroup = this;


    let program = manager.graphics.programs.get('collider');
    for(var i = 0; i < this.colliders.length; i++){
      program.renderers.add(this.colliders[i]);
    }
  }

  OnCreate(){
    this.AddColliderGroup(this.gameobj.scene);
    if(!this.gameobj.rigidbody){
      this.gameobj.scene.colliderGroupsSet.add(this);
    }
  }
}
