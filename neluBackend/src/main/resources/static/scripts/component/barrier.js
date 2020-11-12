class Barrier extends Component {
  static barriers = new Map();

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
    Barrier.barriers.delete(this.GetKey());
  }

  GetKey(){
    let wp = this.gameobj.transform.GetWorldPos();
    return ""+wp.x+"|"+wp.y;
  }

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
    Barrier.barriers.set(this.GetKey(), this);
  }
}
