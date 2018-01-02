
// Heart Rate Monitor controls

import * as vibra from "../common/vibra";
import { user } from "user-profile";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";

export let controls = {OFF: 0, CUSTOM: 1, FAT:2, CARDIO: 3, PEAK: 4};

let sensor = new HeartRateSensor();
let hr = sensor.HeartRateSensorReading;

static var first = true;

export function start() {
  sensor.start();
}

export function stop() {
  first = true;
  sensor.stop();
}

// Return HR value
export function heartRate() {
  sensor.start();
  if(first) {
    first = false;
    return 0;         // Reject the first reading because it is not reliable
  }
  return sensor.heartRate;
}

// returns true if custom HR is in use
export function isCustomHR() {
  if(user.heartRateZone(100).indexOf("custom") > -1)
    return true;
  else
    return false;
}

// Heart-rate control
// Monitors the target HR zone, and alerts if HR is too low or too high
// If HR is near resting HR, then monitoring is off, since probably user's intention is then not to excercise.
export function controlHR(state) {
  let hr = sensor.heartRate;
  console.log("HR check:" + hr);
  if(state.hrMode !== controls.OFF) {
    sensor.start();
    console.log("HRM on");
  }
  else if(display.on == false) {
    sensor.stop();
    console.log("HRM off");
    return;
  }
  
  if(!hr || hr <= 0 || state.hrMode == controls.OFF)
    return;

  let zone = user.heartRateZone(hr);
  let hrCheckLowLimit = user.restingHeartRate * (state.hrMode == controls.FAT ? 1.15 : 1.2);
  console.log("HR:" + hr + " LowLimit:" + Math.round(hrCheckLowLimit) + " Mode:" + state.hrMode);

  
  if(hr > hrCheckLowLimit && state.hrMode !== controls.OFF) {
    if(isCustomHR()) {
      console.log("custom");
      if(zone == "below-custom") vibra.playTooSlowSound();
      else if(zone == "above-custom") vibra.playTooFastSound();
      else vibration.start("bump");
    }
    else {
      console.log("standard");
      if(state.hrMode == controls.FAT) {
        console.log("fat " + zone);
        if(zone == "out-of-range") vibra.playTooSlowSound();
        else if(zone == "cardio" || zone == "peak") vibra.playTooFastSound();
        else vibration.start("bump");
      }
      if(state.hrMode == controls.CARDIO) {
        console.log("cardio " + zone);
        if(zone == "out-of-range" || zone == "fat-burn") vibra.playTooSlowSound();
        else if(zone == "peak") vibra.playTooFastSound();
        else vibration.start("bump");
      }
      if(state.hrMode == controls.PEAK) {
        console.log("peak " + zone);
        if(zone !== "peak") vibra.playTooSlowSound();
        else vibration.start("bump");
      }
    }
  }
}

