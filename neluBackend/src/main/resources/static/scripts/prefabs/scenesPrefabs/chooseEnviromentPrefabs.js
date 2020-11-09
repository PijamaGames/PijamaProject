prefabFactory.AddPrototype("SelectionTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Selecciona un escenario","Choose an enviroment", new Vec2(0.6,0.1), true),
  ]
});
prefabFactory.AddPrototype("RoomFromChoosing", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{

      SendWebSocketMsg({
        event:backendEvents.CREATE_ROOM,
        enviroment:manager.choosenEnviroment,
        lighting: lighting.currentLight,
        private: manager.privateRoom,
      });
    }),
    new TextBox(null, "Empezar","Start", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LobbyFromChoosing", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("lobby");
    }),
    new TextBox(null, "Volver","Return", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("Option1", new Vec2(5,3), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=1;
    }),
  ]
});
prefabFactory.AddPrototype("Option2", new Vec2(5,3), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=2;
    }),
  ]
});
prefabFactory.AddPrototype("Option3", new Vec2(5,3), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=3;
    }),
  ]
});
prefabFactory.AddPrototype("Option4", new Vec2(5,3), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.choosenEnviroment=4;
    }),
  ]
});
prefabFactory.AddPrototype("Lighting", new Vec2(1,1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      lighting.SwitchLight();
      lighting.SetCurrentLight(lighting.currentLight);
    }),
  ]
});
prefabFactory.AddPrototype("PrivacityOption", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
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
    }),
    new TextBox(null, "Pública","Public", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnDestroy((obj)=>{
      manager.privateRoom = false;
    })
  ]
});
