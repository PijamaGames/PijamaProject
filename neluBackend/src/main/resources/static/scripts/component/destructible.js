class Destructible extends Component{
  constructor(life = 1){
    super();
    this.onDestruct = function(){};
    this.onTakeDamage = function(){};
    this.life = life;
  }

  SetOnDestruct(func){
    this.onDestruct = func;
    return this;
  }

  SetOnTakeDamage(func){
    this.onTakeDamage = func;
    return this;
  }

  TakeDamage(){
    this.life -= 1;
    if(this.life <= 0){
      this.Destruct();
    } else {
      this.onTakeDamage(this.gameobj);
    }
  }

  Destruct(){
    this.onDestruct(this.gameobj);
    this.gameobj.Destroy();
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.destructible = this;
  }
}
