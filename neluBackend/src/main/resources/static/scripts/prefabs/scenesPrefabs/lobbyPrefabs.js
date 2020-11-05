prefabFactory.AddPrototype("Create", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("chooseEnviroment");
    }),
    new TextBox(null, "Crear", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("RoomInputField", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new InputField("roomName","Busca una partida", new Vec2(0.34,0.1)),
  ]
});

prefabFactory.AddPrototype("SelectRoom", new Vec2(1,1.5), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      //Mandar al jugador a la sala elegida
    }),
    new TextBox(null, "Ir", new Vec2(0.3,0.1), true),
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
    new TextBox(null, "Menu", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LobbyTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Partidas", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("RankingText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Clasificación", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("RankingTextBox", new Vec2(7,9), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Jugador 1 100 Jugador 2 99 Jugador 4 80 Jugador 5 75 Jugador 6 69 Jugador 7 60 Jugador 8 30 Jugador 9 25 Jugador 10 10 Jugador 11 5 Jugador 10 10 Jugador 11 5", new Vec2(0.3,0.6), true),
  ]
});
prefabFactory.AddPrototype("RoomsText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Partidas", new Vec2(0.3,0.1), true),
  ]
});
