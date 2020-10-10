"use strict;"
const DEBUG = false;

var manager;
function Main(){
  Log("Main")
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));
  //manager.LoadScene(testScene.name);
  manager.Start();

  //let p = new Vec2(-2, -5);
  //let v1 = new Vec2(-1,0);
  //let v2 = new Vec2(-1,5);
  //Log(Vec2.ProjectOnRect(p, v1, v2).toString('Projection'));

  /*let v1 = new Vec2(1,3);
  let v2 = new Vec2(4,2);

  let v3 = Vec2.Plus(v1,v2);
  v2.Add(v1);
  Log(v1);
  Log(v2);
  Log(v3);*/

  /*let v1 = new Vec2(1,0);
  let v2 = new Vec2(2,0);
  let v3 = new Vec2(6,-6);
  v3.Norm();
  Log(v3);*/
  /*v2.RotAround(Math.PI/2.0,v1);
  Log(v2);
  Log(Vec2.RotAround(v2,Math.PI/2.0,v1));*/

}

function Log(text){
  if(DEBUG) console.log(text);
}
