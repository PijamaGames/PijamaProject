class Scene {

  constructor(_name) {
    this.name = _name;
    this.gameObjects = new Map();
    this.camera = this.AddGameObject(new GameObject("camera", null, this, [
      new Transform(),
      new Camera(0.1,/*1000*/30.0,45),
      new FlyController(4.0,5.0)
    ])).components.get('Camera');

    //this.camera.gameObject.transform.pz = 5;
    //this.camera.LookAt([0,0,0]);
    //this.components = {};
  }

  Update() {
    var modelMat = glMatrix.mat4.identity(new Float32Array(16));
    for(let [key, gameObj] of this.gameObjects){
      gameObj.Update();
      gameObj.CheckModelMat(modelMat, false);
    }
    /*for(var key in this.gameObjects){
      this.gameObjects[key].Update();
      this.gameObjects[key].CheckModelMat(modelMat, false);
    }*/
  }

  //AddComponent(component) {
    /*var type = component.type;
    if (!this.components[type]) {
      this.components[type] = [];
    }
    this.components[type].push(component);*/
  //}

  AddGameObject(gameObject) {
    this.gameObjects.set(gameObject.name, gameObject);
    return gameObject;
  }
}
