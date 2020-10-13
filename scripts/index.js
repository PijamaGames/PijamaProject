"use strict;"
const DEBUG = true;
const EDITOR_MODE = true;
var fsm;
var manager;
function Main(){
  Log("Main")
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));

  /*var node2=new Node('nodo2',
    function(){
      Log("Nodo2: Hola");
    },
    function(){
      Log("Nodo2: Aqui estoy");
    },
    function(){
      Log("Nodo2: Adios");
    }
  );

  var node1=new Node('nodo1',
    function(){
      Log("Nodo1: Hola");
    },
    function(){
      Log("Nodo1: Aqui estoy");
    },
    function(){
      Log("Nodo1: Adios");
    },
    [new Edge (node2, [function(){ return input.GetKeyPressed("KeyA");}])]
  );

  var node3=new Node('nodo3',
    function(){
      Log("Nodo3: Hola");
    },
    function(){
      Log("Nodo3: Aqui estoy");
    },
    function(){
      Log("Nodo3: Adios");
    },
    [new Edge (node1, [function(){ return input.GetKeyPressed("KeyD");}])]
  );



  fsm=new FSM([node1, node2, node3]);
  fsm.Start('nodo3');*/

  manager.Start();



}

function Log(text){
  if(DEBUG) console.log(text);
}
