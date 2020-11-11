prefabFactory.AddPrototype("PauseFromMultiGame", new Vec2(1.5,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11.5,12), new Vec2(1.5,1.5)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      ShowButtons(true, ["PauseTitleMultiGame", "GameFromPauseMultiGame","MenuFromPauseMultiGame"]);
      ShowButtons(false, ["MultiLifeText","Chronometer","PauseFromMultiGame"]);
      manager.lastGame="multiGame";
      if(!input.isDesktop) input.HideVirtualInputs(true);
    }),
  ]
});

prefabFactory.AddPrototype("MultiLifeText", new Vec2(3,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(8.5,12), new Vec2(3,1.5)),
    new TextBox("LifeText", "XHP","XHP", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("Chronometer", new Vec2(3,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(8.5,12), new Vec2(3,1.5)),
    new TextBox("chronometer", "","", new Vec2(0.3,0.07), true),
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
prefabFactory.AddPrototype("ChangeEnemy", new Vec2(8,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(15,4), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc((obj)=>{
      let enemyType=obj.gameobj.scene.masterController.enemyType;
      var text=document.getElementById("changeEnemyBtn");
      if(enemyType==0){
        enemyType=1;
        obj.gameobj.renderer.SetTile(new Vec2(15,2));
        text.innerHTML=manager.english?"Enemy: beekeeper": "Enemigo: apicultor";
      }
      else{
        enemyType=0;
        obj.gameobj.renderer.SetTile(new Vec2(15,4));
        text.innerHTML=manager.english?"Enemy: monkey": "Enemigo: mono";
      }
      obj.gameobj.scene.masterController.enemyType=enemyType;

    }),
    new TextBox("changeEnemyBtn", "Enemigo: mono","Enemy: monkey", new Vec2(0.5,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      if(user.isHost) obj.SetActive(false);
    }),
  ]
});


//PAUSA
prefabFactory.AddPrototype("PauseTitleMultiGame", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox(null, "Pausa","Pause", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
  ]
});

prefabFactory.AddPrototype("GameFromPauseMultiGame", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,4), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      ShowButtons(false, ["PauseTitleMultiGame", "GameFromPauseMultiGame","MenuFromPauseMultiGame"]);
      ShowButtons(true, ["MultiLifeText","Chronometer","PauseFromMultiGame","MultiTextBox"]);
      if(!input.isDesktop) input.HideVirtualInputs(false);
    }),
    new TextBox(null, "Volver al juego","Return to game", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
  ]
});

prefabFactory.AddPrototype("MenuFromPauseMultiGame", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,4), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");
      user.isHost = false;
      user.isClient = false;
      SendWebSocketMsg({
        event:backendEvents.LEAVE_ROOM,
      })

    }),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.07), true),
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
