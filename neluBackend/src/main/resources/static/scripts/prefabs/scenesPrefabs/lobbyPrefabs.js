prefabFactory.AddPrototype("Create", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("chooseEnviroment");
    }),
    new TextBox(null, "Crear","Create", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate(()=>{
      user.isHost=false;
      user.isClient=false;
    })
  ]
});

prefabFactory.AddPrototype("RoomInputField", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new InputField("roomName","Busca una partida", "Search room",new Vec2(0.34,0.1)),
  ]
});

prefabFactory.AddPrototype("SelectRoom", new Vec2(1,1.5), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      var inputField=document.getElementById("roomName");
      var room=inputField.value;
      SendWebSocketMsg({
        event:"JOIN_ROOM",
        hostName: room,
      })
    }),
    new TextBox(null, "Ir","Go", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MenuFromLobby", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");
    }),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LobbyTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Arena","Lobby", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("RankingText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Clasificación","Ranking", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("RankingTextBox", new Vec2(7,9), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new ScrollButton("rankingText", "","", new Vec2(0.4,0.55), false),
    new CustomBehaviour().SetOnCreate((obj)=>{
      getRanking();
    }),

  ]
});
prefabFactory.AddPrototype("RoomsButtonBox", new Vec2(7,7), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
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
    })
  ]
});
prefabFactory.AddPrototype("RoomsText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Partidas","Rooms", new Vec2(0.3,0.1), true),
  ]
});
