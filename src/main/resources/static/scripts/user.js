var user;
class User{
  constructor(name,points,controlPoint){
    this.entity = {
      id:name,
      points:points,
      controlPoint:controlPoint,
    }
    Log("USER: " + name + " POINTS: " + points + " CONTROLPOINT: " + controlPoint);
    this.isHost = false;
    this.isClient = false;
    this.hostName = "";

    user = this;

  }

  LoadProgress(){
    if(this.entity.controlPoint < 1){
      manager.LoadScene('cutScene1');
    } else {
      let wasSleeping = manager.sleepingScenes.has("singleGame");
      manager.LoadScene('singleGame');
      if(!wasSleeping){
        let player = manager.scene.players.values().next().value;
        let cam = manager.scene.camera;
        let playerPos = player.transform.GetWorldPos();
        let camPos = cam.transform.GetWorldPos();

        if(this.entity.controlPoint >= 2){
          battleController.eventMap.get("t_movimiento").ForceEnd();
          input.HideVirtualInputs(false);
        }

        if(this.entity.controlPoint == 2){
          battleController.battleMap.get("1").ForceEnd();
          playerPos = new Vec2(56,-12);
          camPos = new Vec2(56,-12);
          battleController.eventMap.get("cap1_intro_monos").ForceEnd();
        }
        if(this.entity.controlPoint == 3){
          battleController.battleMap.get("2").ForceEnd();
          playerPos = new Vec2(94,-12);
          camPos = new Vec2(94,-12);
        }
        if(this.entity.controlPoint == 4){
          battleController.battleMap.get("RiverBattle").ForceEnd();
          playerPos = new Vec2(176,-33);
          camPos = new Vec2(176,-33);
        }
        if(this.entity.controlPoint == 5){
          lighting.SetCurrentLight(3);
          battleController.battleMap.get("4").ForceEnd();
          playerPos = new Vec2(152,0);
          camPos = new Vec2(152,0);
        } else {
          lighting.SetCurrentLight(1);
        }

        player.transform.SetWorldPosition(playerPos);
        cam.transform.SetWorldPosition(camPos);
        cam.camera.target = camPos;
      }

    }

  }

  SaveProgress(){
    let saveImage = prefabFactory.CreateObj("SaveImage", new Vec2(0.7,-0.07));
    SendWebSocketMsg({
      event:backendEvents.UPDATE_CONTROLPOINT,
      controlPoint:this.entity.controlPoint
    })
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
