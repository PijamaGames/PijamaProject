prefabFactory.AddPrototype("PauseFromMultiGame", new Vec2(1.5,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11.5,12), new Vec2(1.5,1.5)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      ShowButtons(true, ["PauseTitleMultiGame", "GameFromPauseMultiGame","MenuFromPauseMultiGame"]);
      ShowButtons(false, ["Chronometer","PauseFromMultiGame","MonkeyButton","BeekeeperButton","LifeUnitUI"]);
      manager.lastGame="multiGame";
      if(!input.isDesktop && user.isHost) input.HideVirtualInputs(true);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.Play("UISound1");
    }),
    new AudioSource(["UISound1","putEnemy","arenaMusic"]),
  ]
});

prefabFactory.AddPrototype("Chronometer", new Vec2(3,1.5), new Vec2(1.0,1.0), false, ()=>{
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
    }),
  ]
});
prefabFactory.AddPrototype("MonkeyButton", new Vec2(7,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(15,4), new Vec2(7,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      if(obj.gameobj.scene.masterController.enemyType != 0){
        obj.gameobj.renderer.MultiplyTint(0.8);
      }
    }).SetHoverOutFunc((obj)=>{
      if(obj.gameobj.scene.masterController.enemyType != 0){
        let tint=obj.gameobj.renderer.realTint;
        obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
      }
    }).SetUpFunc((obj)=>{
      if(obj.gameobj.scene.masterController.enemyType != 0){
        let selectedTint = obj.gameobj.scene.masterController.selectedTint;
        obj.gameobj.renderer.SetTint(selectedTint[0],selectedTint[1],selectedTint[2]);
        let tint=obj.gameobj.scene.masterController.beekeeperButton.renderer.realTint;
        obj.gameobj.scene.masterController.beekeeperButton.renderer.SetTint(tint[0], tint[1], tint[2]);
        obj.gameobj.scene.masterController.enemyType = 0;
      }
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("monkeyText", "Monos: X/Y","Monkeys: X/Y", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("BeekeeperButton", new Vec2(7,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(15,2), new Vec2(7,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      if(obj.gameobj.scene.masterController.enemyType != 1){
        obj.gameobj.renderer.MultiplyTint(0.8);
      }
    }).SetHoverOutFunc((obj)=>{
      if(obj.gameobj.scene.masterController.enemyType != 1){
        let tint=obj.gameobj.renderer.realTint;
        obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
      }
    }).SetUpFunc((obj)=>{
      if(obj.gameobj.scene.masterController.enemyType != 1){
        let selectedTint = obj.gameobj.scene.masterController.selectedTint;
        obj.gameobj.renderer.SetTint(selectedTint[0],selectedTint[1],selectedTint[2]);
        let tint=obj.gameobj.scene.masterController.monkeyButton.renderer.realTint;
        obj.gameobj.scene.masterController.monkeyButton.renderer.SetTint(tint[0], tint[1], tint[2]);
        obj.gameobj.scene.masterController.enemyType = 1;
      }
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("beekeeperText", "Apicultores: X/Y","Beekeepers: X/Y", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

//PAUSA
prefabFactory.AddPrototype("PauseTitleMultiGame", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox(null, "Pausa","Pause", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
    new AudioSource(["UISound1"]),
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
      ShowButtons(true, ["Chronometer","PauseFromMultiGame","MonkeyButton","BeekeeperButton","LifeUnitUI"]);
      if(!input.isDesktop  && user.isHost) input.HideVirtualInputs(false);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Volver al juego","Return to game", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=> {
      obj.SetActive(false);

    }),
    new AudioSource(["UISound1"]),
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

    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=> obj.SetActive(false)),
    new AudioSource(["UISound1"]),
  ]
});

function ShowButtons(show, buttons){
  var obj;
  for (var button of buttons){
    objs=finder.FindObjectsByType(button);
    for(let obj of objs){
      obj.SetActive(show);
    }
  }
}
