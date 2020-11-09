prefabFactory.AddPrototype("PauseFromMultiGame", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      ShowButtons(true, ["PauseTitleMultiGame", "GameFromPauseMultiGame","MenuFromPauseMultiGame"]);
      ShowButtons(false, ["MultiLifeText","Chronometer","PauseFromMultiGame"]);
      manager.lastGame="multiGame";
    }),
    new TextBox(null, "Pausa","Pause", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MultiLifeText", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("LifeText", "XHP","XHP", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("Chronometer", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("chronometer", "","", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      obj.totalTime=120;
      obj.chronometer=document.getElementById("chronometer");
    }).SetOnUpdate((obj)=>{
      if(user.isHost){
        obj.totalTime-=manager.delta;
        let time= Math.trunc(obj.totalTime);
        let mins= Math.trunc(time/60);
        let sec= time%60;
        sec=sec<10 ? "0"+sec : sec;
        mins=mins<10 ? "0"+mins : mins;
        minutes=mins;
        seconds=sec;
        obj.chronometer.innerHTML=""+mins+":"+sec;
        if(obj.totalTime<=0){
          SendEndGame(true);
          //user.SetUserWinner(true);
        }
      }
    })
  ]
});
prefabFactory.AddPrototype("ChangeEnemy", new Vec2(1,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc((obj)=>{
      let enemyType=obj.gameobj.scene.masterController.enemyType;
      if(enemyType==0) enemyType=1;
      else enemyType=0;

      obj.gameobj.scene.masterController.enemyType=enemyType;
    }),
    new TextBox(null, "E","E", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      if(user.isHost) obj.SetActive(false);
    }),
  ]
});


//PAUSA
prefabFactory.AddPrototype("PauseTitleMultiGame", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Pausa","Pause", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
  ]
});

prefabFactory.AddPrototype("GameFromPauseMultiGame", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      ShowButtons(false, ["PauseTitleMultiGame", "GameFromPauseMultiGame","MenuFromPauseMultiGame"]);
      ShowButtons(true, ["MultiLifeText","Chronometer","PauseFromMultiGame","MultiTextBox"]);
    }),
    new TextBox(null, "Volver al juego","Return to game", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
  ]
});

prefabFactory.AddPrototype("MenuFromPauseMultiGame", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");
      user.isHost = false;
      user.isClient = false;
      SendWebSocketMsg({
        event:backendEvents.LEAVE_ROOM,
      })

    }),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
  ]
});

function ShowButtons(show, buttons){
  var obj;
  for (var button of buttons){
    obj=finder.FindObjectsByType(button);
    if(obj.length>0) obj[0].SetActive(show);
  }
}
