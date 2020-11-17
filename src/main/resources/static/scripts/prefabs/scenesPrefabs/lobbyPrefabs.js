prefabFactory.AddPrototype("Create", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("chooseEnviroment");
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Crear","Create", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate(()=>{
      user.isHost=false;
      user.isClient=false;
    }),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("RoomInputField", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new InputField("roomName","Busca una sala", "Search room",new Vec2(0.345,0.1)),
  ]
});

prefabFactory.AddPrototype("SelectRoom", new Vec2(1.5,1.5), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,12), new Vec2(1.5,1.5)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      var inputField=document.getElementById("roomName");
      var room=inputField.value;
      SendWebSocketMsg({
        event:"JOIN_ROOM",
        hostName: room,
      })
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Ir","Go", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("MenuFromLobby", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("LobbyTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Arena","Lobby", new Vec2(0.3,0.07), true),
  ]
});
prefabFactory.AddPrototype("RankingText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,6), new Vec2(7,2)),
    new TextBox(null, "Clasificación","Ranking", new Vec2(0.3,0.07), true),
  ]
});
prefabFactory.AddPrototype("RankingTextBox", new Vec2(7,9), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,0), new Vec2(7,9)),
    new ScrollButton("rankingText", "","", new Vec2(0.4,0.55), false),
    new CustomBehaviour().SetOnCreate((obj)=>{
      //getRanking();
      RequestRanking();
    }),

  ]
});
prefabFactory.AddPrototype("RoomsButtonBox", new Vec2(7,7), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,9), new Vec2(7,7)),
    new ScrollButton("buttonsList", "","", new Vec2(0.4,0.4), true),
    new CustomBehaviour().SetOnCreate((obj)=>obj.cont=9999999).SetOnUpdate((obj)=>{
      obj.cont+=manager.delta;
      if(obj.cont>=1){
        SendWebSocketMsg({
          event:frontendEvents.GET_PUBLIC_ROOMS
        })
        obj.cont=0;
      }
    }).SetOnDestroy((obj)=>{
      let numButtons = roomButtons.length
      roomButtons.splice(0, numButtons);
      roomButtons = [];
    }),
  ]
});
prefabFactory.AddPrototype("RoomsText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,6), new Vec2(7,2)),
    new TextBox(null, "Partidas","Rooms", new Vec2(0.3,0.07), true),
  ]
});
