prefabFactory.AddPrototype("RoomTitle", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox(null, "Sala de espera", "Room", new Vec2(0.6,0.07), true),
  ]
});
prefabFactory.AddPrototype("WaitingMessage", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("WaitingMessage", "Esperando a otro jugador...","Waiting for a player...", new Vec2(1,0.07), true),

  ]
});
prefabFactory.AddPrototype("MultiGameFromRoom", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      SendWebSocketMsg({
        event:backendEvents.START_GAME
      });
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Comenzar","Start", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=>obj.SetActive(false)),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("ChoosingFromRoom", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      SendWebSocketMsg({
        event:backendEvents.LEAVE_ROOM,
      })
      if(user.isHost){
        manager.LoadScene("chooseEnviroment");
      }
      else
        manager.LoadScene("lobby");

    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Volver","Return", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("Publi1", new Vec2(6,7), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,0), new Vec2(6,7)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();

      /*TEST*/
      var win = window.open("https://pijamagames.github.io/", '_blank');
      if(win && win!=null){
        win.focus();
      }
    }).SetTexture("ad2"),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("Publi2", new Vec2(6,7), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,0), new Vec2(6,7)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();

      /*TEST*/
      var win = window.open("https://pijamagames.github.io/", '_blank');
      if(win && win!=null){
        win.focus();
      }
    }).SetTexture("ad3"),
    new AudioSource(["UISound1"]),
  ]
});
