prefabFactory.AddPrototype("RoomTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Sala de espera", new Vec2(0.6,0.1), true),
  ]
});
prefabFactory.AddPrototype("MultiGameFromRoom", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("multiGame");
    }),
    new TextBox(null, "Comenzar", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("ChoosingFromRoom", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      if(user.hostName==user.name){
        SendWebSocketMsg({
          event:backendEvents.LEAVE_ROOM,
        })
        manager.LoadScene("chooseEnviroment");
      }
      else
        manager.LoadScene("lobby");

    }),
    new TextBox(null, "Volver", new Vec2(0.3,0.1), true),
  ]
});
