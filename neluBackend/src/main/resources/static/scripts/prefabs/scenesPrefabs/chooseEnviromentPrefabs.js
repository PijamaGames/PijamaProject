prefabFactory.AddPrototype("SelectionTitle", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox(null, "Diseña tu nivel","Design your level", new Vec2(0.6,0.07), true),
  ]
});
prefabFactory.AddPrototype("RoomFromChoosing", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{

      SendWebSocketMsg({
        event:backendEvents.CREATE_ROOM,
        enviroment:manager.choosenEnviroment,
        lighting: lighting.currentLight,
        private: manager.privateRoom,
      });
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
    new TextBox(null, "Empezar","Start", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("LobbyFromChoosing", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("lobby");
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
    new TextBox(null, "Volver","Return", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("Option1", new Vec2(6,4), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(17,19), new Vec2(6,4)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=1;
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("Option2", new Vec2(6,4), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(17,15), new Vec2(6,4)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=2;
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("Option3", new Vec2(6,4), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(17,11), new Vec2(6,4)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=3;
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("Option4", new Vec2(6,4), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(17,7), new Vec2(6,4)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=4;
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("Lighting", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,13.5), new Vec2(2,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc((obj)=>{
      lighting.SwitchLight(obj.gameobj.renderer);
      lighting.SetCurrentLight(lighting.currentLight);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("PrivacityOption", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc((obj)=>{
      if(manager.privateRoom){
        if(manager.english) obj.gameobj.textBox.SetText("Public");
        else obj.gameobj.textBox.SetText("Pública");
        manager.privateRoom=false;
      }
      else{
        if(manager.english) obj.gameobj.textBox.SetText("Private");
        else obj.gameobj.textBox.SetText("Privada");
        manager.privateRoom=true;
      }
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Pública","Public", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnDestroy((obj)=>{
      manager.privateRoom = false;
    }),
    new AudioSource(["UISound1"]),
  ]
});
