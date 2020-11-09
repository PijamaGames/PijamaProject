prefabFactory.AddPrototype("PauseTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Pausa","Pause", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("GameFromPause", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("singleGame");
    }),
    new TextBox(null, "Volver al juego","Return to game", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("OptionsFromPause", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene('optionMenu');
      manager.lastScene="pause";
    }),
    new TextBox(null, "Configuración","Options", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MenuFromPause", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");
      SendWebSocketMsg({
        event:backendEvents.LEAVE_ROOM,
      })

    }),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.1), true),
  ]
});
