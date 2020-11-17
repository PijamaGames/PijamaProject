class Destructible extends Component{
  constructor(life = 1, damageSound, destructSound){
    super();
    this.type = "destructible";
    this.onDestruct = function(){};
    this.onTakeDamage = function(){};
    this.life = life;
    this.damageSound=damageSound;
    this.destructSound=destructSound;
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
      this.gameobj.audioSource.Play(this.damageSound);
      this.onTakeDamage(this.gameobj);
    }
  }

  Destruct(){
    this.gameobj.audioSource.Play(this.destructSound);
    this.onDestruct(this.gameobj);
    this.gameobj.Destroy();
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.destructible = this;
  }
}
