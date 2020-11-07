prefabFactory.AddPrototype("PauseFromMultiGame", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("pause",true);
      manager.lastGame="multiGame";
    }),
    new TextBox(null, "Pausa", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MultiLifeText", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("LifeText", "XHP", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MultiTextBox", new Vec2(14,5), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
  ]
});
prefabFactory.AddPrototype("Chronometer", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("chronometer", "", new Vec2(0.3,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      obj.totalTime=120;
      obj.chronometer=document.getElementById("chronometer");
    }).SetOnUpdate((obj)=>{
      obj.totalTime-=manager.delta;
      let time= Math.trunc(obj.totalTime);
      let mins= Math.trunc(time/60);
      let seconds= time%60;
      seconds=seconds<10 ? "0"+seconds : seconds;
      mins=mins<10 ? "0"+mins : mins;
      obj.chronometer.innerHTML=""+mins+":"+seconds;
      if(obj.totalTime<=0){
        Log("holi")
        user.SetUserWinner(true);
      }
    })
  ]
});
