var testScene;

function main(){
  gameController = new GameController();
  testScene = new Scene("game");
  gameController.AddScene(testScene);
  gameController.LoadScene(testScene.name);
  gameController.Start();
}
