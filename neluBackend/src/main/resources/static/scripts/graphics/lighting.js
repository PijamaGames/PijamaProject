var lighting;
class Lighting{
  constructor(){
    lighting = this;

    this.ambientLight = new Float32Array([0.2, 0.2, 0.6, 1.0]);
    this.backgroundColor = new Float32Array([1.0,0.0,0.0,1.0]);

    //Motion blur
    this.motionBlur = 0.0;

    //Sun
    this.sunTemperature = 0.5;
    this.sunStrength = 1.0;

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
    this.lightBlurChannels = new Float32Array([0.2,3.0,0.0,0.0]);

    //Point lights
    this.lightSources = new Set();
    this.shadowCastersPerLight = 10;
    this.shadowCasters = [];
    this.shadowCastersArr = new Float32Array(this.shadowCastersPerLight*4);
    this.currentLightSource = null;
    this.renderPointLights = true;

    //Clouds
    this.cloudDisplacement = new Vec2();
    this.cloudDir = new Vec2(-0.1,-0.1);
    this.cloudMinIntensity = 0.3;
    this.cloudSize = 0.3;
    //this.SetNight();

    //Bloom
    this.bloomThreshold = 4.0;
    this.bloomBlur = 0.01;
    this.bloomStrength = 0.5;

    this.currentLight=1;
    this.nextLight=1;

    this.SetCurrentLight(1);
  }

  SwitchLight(rend){
    switch(this.nextLight){
      case 1:
        this.currentLight=1;
        rend.SetTile(new Vec2(7,13.5));
        this.nextLight=2;
      break;
      case 2:
        this.currentLight=2;
        rend.SetTile(new Vec2(9,13.5));
        this.nextLight=3;
      break;
      case 3:
        this.currentLight=3;
        rend.SetTile(new Vec2(11,13.5));
        this.nextLight=1;
      break;
    }
  }

  SetCurrentLight(light) {
    switch(light){
      case 1: this.SetMorning();
      break;
      case 2: this.SetAfterNoon();
      break;
      case 3: this.SetNight();
      break;
    }
  }

  Lerp(a,b,l){
    return a*(1.0-l)+b*l;
  }

  BlendParams(src, dst, lerp){
    this.sunTemperature = this.Lerp(src.sunTemperature, dst.sunTemperature, lerp);
    this.sunStrength = this.Lerp(src.sunStrength, dst.sunStrength, lerp);
    this.shadowBlur = this.Lerp(src.shadowBlur, dst.shadowBlur, lerp);
    this.shadowExtraBlur = this.Lerp(src.shadowExtraBlur, dst.shadowExtraBlur, lerp);
    this.shadowStrength = this.Lerp(src.shadowStrength, dst.shadowStrength, lerp);
    this.shadowLength = this.Lerp(src.shadowLength, dst.shadowLength, lerp);
    this.shadowBlurE0 = this.Lerp(src.shadowBlurE0, dst.shadowBlurE0, lerp);
    this.shadowBlurE1 = this.Lerp(src.shadowBlurE1, dst.shadowBlurE1, lerp);
    this.ambientLight[0] = this.Lerp(src.ambientLight[0], dst.ambientLight[0], lerp);
    this.ambientLight[1] = this.Lerp(src.ambientLight[1], dst.ambientLight[1], lerp);
    this.ambientLight[2] = this.Lerp(src.ambientLight[2], dst.ambientLight[2], lerp);
    this.lightBlurChannels[0] = this.Lerp(src.lightBlurChannels[0], dst.lightBlurChannels[0], lerp);
    this.lightBlurChannels[1] = this.Lerp(src.lightBlurChannels[1], dst.lightBlurChannels[1], lerp);
    this.lightBlurChannels[2] = this.Lerp(src.lightBlurChannels[2], dst.lightBlurChannels[2], lerp);
    this.cloudDir.x = this.Lerp(src.cloudDir.x, dst.cloudDir.x, lerp);
    this.cloudDir.y = this.Lerp(src.cloudDir.y, dst.cloudDir.y, lerp);
    this.cloudMinIntensity = this.Lerp(src.cloudMinIntensity, dst.cloudMinIntensity, lerp);
    this.cloudSize = this.Lerp(src.cloudSize, dst.cloudSize, lerp);
    this.fogColor[0] = this.Lerp(src.fogColor[0], dst.fogColor[0], lerp);
    this.fogColor[1] = this.Lerp(src.fogColor[1], dst.fogColor[1], lerp);
    this.fogColor[2] = this.Lerp(src.fogColor[2], dst.fogColor[2], lerp);
    this.fogEdges.x = this.Lerp(src.fogEdges.x, dst.fogEdges.x, lerp);
    this.fogEdges.y = this.Lerp(src.fogEdges.y, dst.fogEdges.y, lerp);
    this.fogClamp.x = this.Lerp(src.fogClamp.x, dst.fogClamp.x, lerp);
    this.fogClamp.y = this.Lerp(src.fogClamp.y, dst.fogClamp.y, lerp);
    this.bloomThreshold = this.Lerp(src.bloomThreshold, dst.bloomThreshold, lerp);
    this.bloomBlur = this.Lerp(src.bloomBlur, dst.bloomBlur, lerp);
    this.bloomStrength = this.Lerp(src.bloomStrength, dst.bloomStrength, lerp);
  }

  Update(){
    this.cloudDisplacement.Set(
      this.cloudDisplacement.x+this.cloudDir.x*manager.delta,
      this.cloudDisplacement.y+this.cloudDir.y*manager.delta
    )
    if(this.transitioning){
      this.time+=manager.delta;
      if(this.time < this.transitionTime){
        let lerp = this.time / this.transitionTime;
        lerp = lerp * lerp * (3.0-2.0*lerp);
        this.BlendParams(this.originalParams, this.targetParams, lerp);
      } else {
        Log("END TRANSITION");
        this.transitioning = false;
        let params = this.SaveCurrentParams();
        Log(params);
        this.SetCurrentLight(this.targetLight);
        params = this.SaveCurrentParams();
        Log(params);
      }
    }
  }

  SetBloom(threshold = 3.1, blur = 0.015, strength = 0.7){
    this.bloomStrength = strength;
    this.bloomThreshold = threshold;
    this.bloomBlur = blur;
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

  BeginTransition(targetLighting, time = 1.0){
    if(this.transitioning && targetLighting == this.targetLight) return;
    //if(this.transitioning) return;
    this.originalParams = this.SaveCurrentParams();
    let light = this.currentLight;
    this.targetLight = targetLighting;
    this.SetCurrentLight(targetLighting);
    this.targetParams = this.SaveCurrentParams();
    this.SetCurrentLight(light);
    this.transitioning = true;
    this.transitionTime = time;
    this.time = 0.0;
  }

  SaveCurrentParams(){
    var params = {
      sunTemperature:this.sunTemperature,
      shadowBlur:this.shadowBlur,
      shadowExtraBlur:this.shadowExtraBlur,
      shadowStrength:this.shadowStrength,
      shadowLength:this.shadowLength,
      sunStrength:this.sunStrength,
      shadowBlurE0:this.shadowBlurE0,
      shadowBlurE1:this.shadowBlurE1,
      ambientLight:new Float32Array(this.ambientLight),
      lightBlurChannels:new Float32Array(this.lightBlurChannels),
      cloudDir:this.cloudDir.Copy(),
      cloudMinIntensity:this.cloudMinIntensity,
      cloudSize:this.cloudSize,
      fogColor:new Float32Array(this.fogColor),
      fogEdges:this.fogEdges.Copy(),
      fogClamp:this.fogClamp.Copy(),
      bloomThreshold:this.bloomThreshold,
      bloomBlur:this.bloomBlur,
      bloomStrength:this.bloomStrength,
    }
    return params;
  }

  SetDefaultSun(){
    this.renderPointLights = false;
    this.sunTemperature = 0.48;
    this.shadowBlur = 0.15;
    this.shadowExtraBlur = 0.003;
    this.shadowStrength = 2.8;
    this.shadowLength = 1.2;
    this.sunStrength = 0.8;
    this.shadowBlurE0 = 0.1;
    this.shadowBlurE1 = 1.0;
    this.SetAmbientLight(0.2,0.2,0.4);
    this.SetLightBlurChannels(0.25,3.0);
    this.SetClouds(new Vec2(-0.5,-1), 0.1, 0.85,0.1);
    this.SetFog(0.8,0.8,1.0,0.85,0.95, 0.0, 0.05);
    this.SetBloom();
  }

  SetMorning(){
    //this.renderPointLights = false;
    this.sunTemperature = 0.48;
    this.shadowBlur = 0.15;
    this.shadowExtraBlur = 0.003;
    this.shadowStrength = 2.8;
    this.shadowLength = 1.2;
    this.sunStrength = 0.8;
    this.shadowBlurE0 = 0.1;
    this.shadowBlurE1 = 1.0;
    this.SetAmbientLight(0.2,0.2,0.4);
    this.SetLightBlurChannels(0.25,3.0);
    this.SetClouds(new Vec2(-0.5,-1), 0.1, 0.85,0.1);
    this.SetFog(0.8,0.8,1.0,0.85,0.95, 0.0, 0.05);
    this.SetBloom();
    Log("Morning lighting")
  }

  /*SetNoon(){
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
    this.SetBloom(5.0,0.01,0.3);
    Log("Noon lighting");
  }*/

  SetAfterNoon(){
    //this.renderPointLights = false;
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
    this.SetBloom(3.0,0.01,0.7);
    Log("Afternoon lighting");
  }

  SetNight(){
    //this.renderPointLights = true;
    this.sunTemperature = 0.0;
    this.shadowBlur = 0.08/*0.0*/;
    this.shadowStrength = 1.0;
    this.shadowLength = 0.0;
    this.sunStrength = 0.3;
    this.shadowBlurE0 = 0.0;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.3,0.3,0.4);
    this.SetLightBlurChannels(0.3,3.0);
    this.SetClouds(new Vec2(-0.2,1), 0.05, 1.0, 0.2);
    this.SetFog(0.5,0.5,0.8,0.9,0.95, 0.1, 0.32);
    this.SetBloom(2.5,0.01,0.8);
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
