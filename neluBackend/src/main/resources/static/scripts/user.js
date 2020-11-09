var user;
class User{
  constructor(name,points,controlPoint){
    this.entity = {
      id:name,
      points:points,
      controlPoint:controlPoint
    }

    this.isHost = false;
    this.isClient = false;
    this.hostName = "";

    user = this;
  }

  SetUserWinner(winner){
    this.isHost = false;
    this.isClient = false;
    this.hostName = "";
    gameStarted = false;
    manager.LoadScene("connectionFailed");
    var text=document.getElementById("ConnectionTitle");
    if(winner){
      text.innerHTML=manager.english? "¡Congratulations! ¡You win!":"¡Enhorabuena! ¡Has ganado!";
    }
    else{
      text.innerHTML=manager.english? "You lose...try again":"Has sido derrotado...otra vez será";
    }
  }

  get name(){
    return this.entity.id;
  }

  GetId(){
    return this.entity.id;
  }
  GetPoints(){
    return this.entity.points;
  }
  GetControlPoint(){
    return this.entity.controlPoint;
  }

  SetId(id){
    this.entity.id=id;
  }
  SetId(points){
    this.entity.points=points;
  }
  SetId(controlPoint){
    this.entity.controlPoint=controlPoint;
  }

}
