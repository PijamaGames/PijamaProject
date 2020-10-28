prefabFactory.AddPrototype("GalleryText", new Vec2(4.0,2), new Vec2(0.5,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.3),
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "Gallery"),
  ]
});
prefabFactory.AddPrototype("GoToGallery", new Vec2(5.5,2), new Vec2(1.0,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
      mapEditor.hoverGallery = true;
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
      mapEditor.hoverGallery = false;
    }).SetUpFunc((obj)=>{
      manager.LoadScene("gallery", true);
      obj.gameobj.SetScene(manager.scene);
      //obj.gameobj.SetActive(false);
    }),
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "Ver galería"),
  ]
});

prefabFactory.AddPrototype("ReturnFromGallery", new Vec2(5.5,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc((obj)=>{
      manager.LoadScene(mapEditor.currentScene);
    }),
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "Volver"),
  ]
});
