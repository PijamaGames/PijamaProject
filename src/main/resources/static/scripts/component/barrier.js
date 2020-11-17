class Barrier extends Component {
  //static barriers = new Map();
  static barriers = new Set();

  constructor(permitCount = 1){
    super();
    this.type = "barrier";
    this.permits = permitCount;
    var that = this;
    this.onBarrier = function(){
      that.gameobj.Destroy();
    };
  }

  Destroy(){
    Barrier.barriers.delete(this);
  }

  static GetClosestBarrier(pos){
    let closest = null;
    let minDist = 9999999999999999;
    let dist;
    for(let b of Barrier.barriers){
      dist = Vec2.Distance(pos, b.gameobj.transform.GetWorldCenter());
      if(dist < minDist){
        closest = b;
        minDist = dist;
      }
    }
    return closest;
  }

  /*Destroy(){
    Barrier.barriers.delete(this.GetKey());
  }*/

  /*GetKey(){
    let wp = this.gameobj.transform.GetWorldPos();
    return ""+wp.x+"|"+wp.y;
  }*/

  SetOnBarrier(func){
    this.onBarrier = func;
    return this;
  }

  Release(permits = 1){
    this.permits -= permits;
    if(this.permits <= 0){
      this.onBarrier(this.gameobj);
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.barrier = this;
  }

  OnCreate(){
    Barrier.barriers.add(this);
  }

  /*OnCreate(){
    Barrier.barriers.set(this.GetKey(), this);
  }*/
}
