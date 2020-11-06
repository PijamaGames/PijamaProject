var user;
class User{
  constructor(name,points,controlPoint){
    this.entity = {
      id:name,
      points:points,
      controlPoint:controlPoint
    }

    this.isHost = false;
    this.isClient = false;
    this.hostName = "";

    user = this;
  }

  get name(){
    return this.entity.id;
  }

  GetId(){
    return this.entity.id;
  }
  GetPoints(){
    return this.entity.points;
  }
  GetControlPoint(){
    return this.entity.controlPoint;
  }

  SetId(id){
    this.entity.id=id;
  }
  SetId(points){
    this.entity.points=points;
  }
  SetId(controlPoint){
    this.entity.controlPoint=controlPoint;
  }

}
