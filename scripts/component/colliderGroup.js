class ColliderGroup extends Component{
  constructor(colliders = []){
    super();
    this.colliders=[];
    this.type="colliderGroup";
    for (var c of colliders){
      this.colliders.push(c);
      c.colliderGroup = this;
    }

  }

  Destroy(){
    let index = this.gameobj.scene.colliderGroups.indexOf(this);
    this.gameobj.scene.colliderGroups.splice(index,1);
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.scene.colliderGroups.push(this);
    this.gameobj.colliderGroup = this;


    if(DEBUG){
      let program = manager.graphics.programs.get('collider');
      for(var i = 0; i < this.colliders.length; i++){
        program.renderers.set(this.gameobj.key+'_col'+i, this.colliders[i]);
      }
    }
  }
}
