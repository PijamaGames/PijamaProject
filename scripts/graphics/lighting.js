var lighting;
class Lighting{
  constructor(){
    lighting = this;

    this.ambientLight = new Float32Array([0.2, 0.2, 0.6, 1.0]);

    //Sun
    this.sunTemperature = 0.5;
    this.sunStrength = 1.0;
    this.lightBlurChannels = new Float32Array([0.2,3.0,0.0,0.0]);

    //Fog
    this.fogColor = new Float32Array([0.5,0.5,0.8,1.0]);
    this.fogEdges = new Vec2(0.85,0.95);
    this.fogClamp = new Vec2(0.0,0.4);

    //Shadows
    this.shadowBlur = 0.2;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.shadowStrength = 2.5;
    this.shadowLength = -0.3;
    this.minShadowLength = -0.5;
    this.verticalShadowStrength = 0.12;

    //Point lights
    this.lightSources = new Set();
    this.shadowCastersPerLight = 10;
    this.shadowCasters = [];
    this.shadowCastersArr = new Float32Array(this.shadowCastersPerLight*4);
    this.currentLightSource = null;
    this.renderPointLights = true;

    this.cloudDisplacement = new Vec2();
    this.cloudDir = new Vec2(-0.1,-0.1);
    this.cloudMinIntensity = 0.3;
    this.cloudSize = 0.3;
    //this.SetNight();
    this.SetMorning();
  }

  Update(){
    this.cloudDisplacement.Set(
      this.cloudDisplacement.x+this.cloudDir.x*manager.delta,
      this.cloudDisplacement.y+this.cloudDir.y*manager.delta
    )
  }

  SetClouds(dir = new Vec2(-0.1,-0.1),speed = Math.sqrt(0.1*0.1+0.1*0.1), intensity = 0.3, cloudSize = 0.3){
    if(dir.mod === 0){
      this.cloudDir.Set(dir.x,dir.y);
    } else {
      this.cloudDir = Vec2.Norm(dir).Scale(speed);
    }
    this.cloudMinIntensity = intensity;
    this.cloudSize = cloudSize;
  }

  SetDefaultSun(){
    this.renderPointLights = false;
    this.shadowBlur = 0.2;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.shadowStrength = 2.5;
    this.shadowLength = /*-0.5*//*3.0*/-0.3;
    this.minShadowLength = -5.0;
    this.verticalShadowStrength = 0.12;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.2, 0.2, 0.6);
    this.SetLightBlurChannels(0.2,3.0);
    this.SetClouds();
  }

  SetMorning(){
    this.renderPointLights = false;
    this.sunTemperature = 0.48;
    this.shadowBlur = 0.5;
    this.shadowExtraBlur = 0.003;
    this.shadowStrength = 2.8;
    this.shadowLength = 1.2;
    this.sunStrength = 0.8;
    this.shadowBlurE0 = 0.1;
    this.shadowBlurE1 = 1.0;
    this.SetAmbientLight(0.2,0.2,0.4);
    this.SetLightBlurChannels(0.25,3.0);
    this.SetClouds(new Vec2(-0.5,-1), 0.1, 0.85,0.1);
    this.SetFog(0.8,0.8,1.0,0.85,0.95, 0.0, 0.08);
    Log("Morning lighting")
  }

  SetNoon(){
    this.renderPointLights = false;
    this.sunTemperature = 0.55;
    this.shadowBlur = 0.1;
    this.shadowStrength = 2.5;
    this.shadowLength = -0.9;
    this.sunStrength = 0.9;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.22,0.22,0.22);
    this.SetLightBlurChannels(0.2,3.0);
    this.SetClouds(new Vec2(-0.2,-1), 0.05, 1.0, 0.5);
    this.SetFog(1.0,1.0,1.0,0.9,0.95, 0.0, 0.1);
    Log("Noon lighting");
  }

  SetAfterNoon(){
    this.renderPointLights = false;
    this.sunTemperature = 0.7;
    this.shadowBlur = 0.07;
    this.shadowStrength = 2.35;
    this.shadowLength = 2.0;
    this.sunStrength = 0.96;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.225,0.2,0.3);
    this.SetLightBlurChannels(0.2,3.0);
    this.SetClouds(new Vec2(0.05,-1), 0.15, -0.2, 0.3);
    this.SetFog(0.9,0.8,0.8,0.9,1.0, 0.0, 0.05);
    Log("Afternoon lighting");
  }

  SetNight(){
    this.renderPointLights = true;
    this.sunTemperature = 0.0;
    this.shadowBlur = 0.4/*0.0*/;
    this.shadowStrength = 1.0;
    this.shadowLength = 0.0;
    this.sunStrength = 0.3;
    this.shadowBlurE0 = 0.0;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.3,0.3,0.4);
    this.SetLightBlurChannels(0.3,3.0);
    this.SetClouds(new Vec2(-0.2,1), 0.05, 1.0, 0.2);
    this.SetFog(0.5,0.5,0.8,0.9,0.95, 0.0, 0.35);
    Log("Night lighting");
  }

  SetFog(r=1,g=1,b=1,edge0 = 0, edge1 = 1, minFog = 1.0, maxFog = 1.0){
    this.fogColor[0] = r;
    this.fogColor[1] = g;
    this.fogColor[2] = b;
    this.fogEdges.Set(edge0, edge1);
    this.fogClamp.Set(minFog, maxFog);
  }

  SetAmbientLight(r=0.5,g=0.5,b=0.5){
    this.ambientLight[0] = r;
    this.ambientLight[1] = g;
    this.ambientLight[2] = b;
  }

  SetLightBlurChannels(r=0,g=0,b=0){
    this.lightBlurChannels[0] = r;
    this.lightBlurChannels[1] = g;
    this.lightBlurChannels[2] = b;
  }

  SetSunTemperature(temp) {
    if(temp < 0.0) temp = 0.0;
    else if (temp > 1.0) temp = 1.0;
    this.sunTemperature = temp;
  }

  SetShadowLength(shadowLength) {
    this.shadowLength = shadowLength;
    if (this.shadowLength < this.minShadowLength) this.shadowLength = this.minShadowLength;
  }
}
