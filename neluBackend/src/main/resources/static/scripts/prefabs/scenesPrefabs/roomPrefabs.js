prefabFactory.AddPrototype("RoomTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Sala de espera", "Room", new Vec2(0.6,0.1), true),
  ]
});
prefabFactory.AddPrototype("WaitingMessage", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox("WaitingMessage", "Esperando a otro jugador...","Waiting some player...", new Vec2(1,0.1), true),

  ]
});
prefabFactory.AddPrototype("MultiGameFromRoom", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      SendWebSocketMsg({
        event:backendEvents.START_GAME
      });
    }),
    new TextBox(null, "Comenzar","Start", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=>obj.SetActive(false))
  ]
});
prefabFactory.AddPrototype("ChoosingFromRoom", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      SendWebSocketMsg({
        event:backendEvents.LEAVE_ROOM,
      })
      if(user.isHost){
        manager.LoadScene("chooseEnviroment");
      }
      else
        manager.LoadScene("lobby");

    }),
    new TextBox(null, "Volver","Return", new Vec2(0.3,0.1), true),
  ]
});
