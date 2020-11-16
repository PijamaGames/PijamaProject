function PrepareCutScene(obj){
  dialogSystem.textBox.transform.SetWorldPosition(new Vec2(0,0.72));
  dialogSystem.textName.transform.SetWorldPosition(new Vec2(-0.3, 0.88));
  dialogSystem.textBox.renderer.SetAlpha(/*0.15*/0.0);
  dialogSystem.textName.renderer.SetAlpha(/*0.15*/0.0);
  dialogSystem.textBox.textBox.element.style.color = "#FFFFFF";
  dialogSystem.textName.textBox.element.style.color ="#FFFFFF";
  dialogSystem.textBox.renderer.tile.Set(16,6);
  dialogSystem.textBox.renderer.numTiles.Set(1,1);
  dialogSystem.textName.renderer.tile.Set(16,6);
  dialogSystem.textName.renderer.numTiles.Set(1,1);
  dialogSystem.textName.transform.scale.y = 1.0;
  obj.color = manager.graphics.colorsPerChannel;
  manager.graphics.colorsPerChannel = 255.0;
  obj.bloom = manager.graphics.config.bloom;
  manager.graphics.config.bloom = false;
  dialogSystem.textBox.textBox.element.className += " strokeText";
  dialogSystem.textName.textBox.element.className += " strokeText";
}

function FinishCutScene(obj){
  manager.graphics.colorsPerChannel = obj.color;
  manager.graphics.config.bloom = obj.bloom;
}

prefabFactory.AddPrototype("SkipCutscene1", new Vec2(4,2), new Vec2(0.85,0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc((obj)=>{
        manager.scene.camera.camera.FadeOut(0.3, ()=>manager.LoadScene("singleGame"), false);
        obj.Destroy();
    }),
    new AudioSource(["UISound1"]),
    new TextBox(null, "Saltar","Skip", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("SkipCutscene2", new Vec2(4,2), new Vec2(0.85,0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc((obj)=>{
        manager.scene.camera.camera.FadeOut(0.3, ()=>manager.LoadScene("credits"), false);
        manager.SetInMenu(true);
        manager.cutScene2Music.StopAll();
        obj.Destroy();
    }),
    new AudioSource(["UISound1"]),
    new TextBox(null, "Saltar","Skip", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("CutScene1", new Vec2(20,15), new Vec2(0.5,0.5), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML).SetOnNextText((obj)=>{
        obj.gameobj.audioSource.Play("dialogSound");
      }).SetOnDialogEnd("interludio_1", ()=>{
        //lighting.BeginTransition(2);
        manager.scene.camera.camera.FadeOut(2, ()=>manager.LoadScene("singleGame"));
      }),
      new AudioSource(["dialogSound", "kinematicSound"]),
      new VideoRenderer("cutScene1", new Vec2(20,15), 8,false, 16),
      new CustomBehaviour().SetOnCreate((obj)=>{
        //dialogSystem.InitDialog("t_movimiento");
        lighting.SetCurrentLight(1);
        PrepareCutScene(obj);
        manager.scene.camera.camera.FadeIn(3.0, ()=>dialogSystem.InitDialog("interludio_1"));
      }).SetOnDestroy((obj)=>{
        FinishCutScene(obj);
      }),
  ];
});

prefabFactory.AddPrototype("CutScene2", new Vec2(20,15), new Vec2(0.5,0.5), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML).SetOnNextText((obj)=>{
        obj.gameobj.audioSource.Play("dialogSound");
      }).SetOnDialogEnd("interludio_2", ()=>{
        //lighting.BeginTransition(2);
        manager.scene.camera.camera.FadeOut(2, ()=>manager.LoadScene("cutScene3"));
      }),
      new AudioSource(["dialogSound"]),
      new VideoRenderer("cutScene2", new Vec2(20,15), 8,false, 16),
      new CustomBehaviour().SetOnCreate((obj)=>{
        //dialogSystem.InitDialog("t_movimiento");
        lighting.SetCurrentLight(1);
        PrepareCutScene(obj);
        manager.scene.camera.camera.FadeIn(3.0, ()=>dialogSystem.InitDialog("interludio_2"));
      }).SetOnDestroy((obj)=>{
        FinishCutScene(obj);
      }),
  ];
});

prefabFactory.AddPrototype("CutScene3", new Vec2(20,15), new Vec2(0.5,0.5), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML).SetOnNextText((obj)=>{
        obj.gameobj.audioSource.Play("dialogSound");
      }).SetOnDialogEnd("interludio_3", ()=>{
        //lighting.BeginTransition(2);
        manager.scene.camera.camera.FadeOut(2, ()=>manager.LoadScene("credits"));
      }),
      new AudioSource(["dialogSound", "kinematicSound"]),
      new VideoRenderer("cutScene1", new Vec2(20,15), 8,false, 16),
      new CustomBehaviour().SetOnCreate((obj)=>{
        //dialogSystem.InitDialog("t_movimiento");
        lighting.SetCurrentLight(1);
        PrepareCutScene(obj);
        manager.scene.camera.camera.FadeIn(3.0, ()=>dialogSystem.InitDialog("interludio_3"));
      }).SetOnDestroy((obj)=>{
        FinishCutScene(obj);
      }),
  ];
});

prefabFactory.AddPrototype("DialogSystem", new Vec2(), new Vec2(), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML).SetOnNextText((obj)=>{
        obj.gameobj.audioSource.PlayAll();
      }).SetOnDialogEnd("cap1_fin", ()=>{
        manager.scene.camera.camera.FadeOut(2.0, ()=>manager.LoadScene("cutScene2"));
        //lighting.BeginTransition(2);
      }).SetOnAnyDialogStart(()=>{
        input.HideVirtualInputs(true);
        let obj=finder.FindObjectsByType("PauseFromSingleGame");
        obj[0].SetActive(false);
      }).SetOnAnyDialogEnd(()=>{
        let obj=finder.FindObjectsByType("PauseFromSingleGame");
        obj[0].SetActive(true);
        input.HideVirtualInputs(false);

      }),
      new AudioSource(["dialogSound"]),
  ];
});

prefabFactory.AddPrototype("PauseFromSingleGame", new Vec2(1.5,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11.5,12), new Vec2(1.5,1.5)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("pause",true);
      manager.lastGame="singleGame";
    }),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("LifeUnitUI", new Vec2(1,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(17,6), new Vec2(1,1)),
  ]
});

/*prefabFactory.AddPrototype("SingleLifeText", new Vec2(3,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(8.5,12), new Vec2(3,1.5)),
    new TextBox("LifeText", "XHP","XHP", new Vec2(0.3,0.07), true,false),
  ]
});*/

prefabFactory.AddPrototype("SingleTextBox", new Vec2(14,5), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,16), new Vec2(14,5)),
    new TextBox(null, "","", new Vec2(0.8,0.25), false),
  ]
});
prefabFactory.AddPrototype("SingleNameText", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)),
    new TextBox(null, "","", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("SaveImage", new Vec2(4,2), new Vec2(0,1), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)),
    new TextBox(null, "Guardando...","Saving...", new Vec2(0.3,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      obj.maxTime=5;
      obj.cont=0;
    }).SetOnUpdate((obj)=>{
      obj.cont+=manager.delta;
      if(obj.cont>=obj.maxTime)
        obj.Destroy();
    })
  ]
});
