
// Heart Rate Monitor controls

import { vibration } from "haptics";
import * as vibra from "../common/vibra";
import { user } from "user-profile";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";

export let controls = {OFF: 0, CUSTOM: 1, FAT:2, CARDIO: 3, PEAK: 4};

let sensor = new HeartRateSensor();
let hr = sensor.HeartRateSensorReading;

export static let first = true;

export function start() {
  sensor.start();
}

export function stop() {
  first = true;
  sensor.stop();
}

// Return HR value
export function heartRate() {
  start();
  if(first) {
    first = false;
    return 0;         // Reject the first reading because it is not reliable
  }
  return sensor.heartRate;
}

// returns true if custom HR is in use
export function isCustomHR() {
  _isCustomHR(user.heartRateZone(100))
}
export function _isCustomHR(zone) {
  if(zone.indexOf("custom") > -1)
    return true;
  else
    return false;
}

// Heart-rate control
// Monitors the target HR zone, and alerts if HR is too low or too high
// If HR is near resting HR, then monitoring is off, since probably user's intention is then not to excercise.
export function controlHR(state) {
  let hr = heartRate();
  let zone = user.heartRateZone(hr);
  let test = _controlHR(state, hr, zone, display.on, user.restingHeartRate, sensor);
  //console.log("controlHR: "+hr+" "+JSON.stringify(test));
}

export function _controlHR(state, hr, zone, displayOn, restingHeartRate, sensor) {
  let test = {start: false, vibra: "no"};
  //console.log(JSON.stringify(state)+" "+hr+" "+zone+" "+displayOn+" "+restingHeartRate+" "+JSON.stringify(sensor));
  if(state.hrMode !== controls.OFF) {
    sensor.start();
    test.start = true;
  }
  else if(displayOn == false) {
    sensor.stop();
    test.start = false;
    return test;
  }
  
  if(!hr || hr <= 0 || state.hrMode == controls.OFF) {
    return test;
  }

  let hrCheckLowLimit = restingHeartRate * (state.hrMode == controls.FAT ? 1.15 : 1.2);
  //console.log("HR:" + hr + " LowLimit:" + Math.round(hrCheckLowLimit) + " Mode:" + state.hrMode);
  
  if(hr > hrCheckLowLimit && state.hrMode !== controls.OFF) {
    if(_isCustomHR(zone)) {
      if(zone == "below-custom") {
        vibra.playTooSlowSound();
        test.vibra = "slow";
      }
      else if(zone == "above-custom") {
        vibra.playTooFastSound();
        test.vibra = "fast";
      }
      else {
        vibra.playOk();
        test.vibra = "bump";
      }
    }
    else {
      if(state.hrMode == controls.FAT) {
        if(zone == "out-of-range") {
          vibra.playTooSlowSound();
          test.vibra = "slow";
        }
        else if(zone == "cardio" || zone == "peak") {
          vibra.playTooFastSound();
          test.vibra = "fast";
        }
        else {
          vibra.playOk();
          test.vibra = "bump";
        }
      }
      if(state.hrMode == controls.CARDIO) {
        if(zone == "out-of-range" || zone == "fat-burn") {
          vibra.playTooSlowSound();
          test.vibra = "slow";
        }
        else if(zone == "peak") {
          vibra.playTooFastSound();
          test.vibra = "fast";
        }
        else {
          vibra.playOk();
          test.vibra = "bump";
        }
      }
      if(state.hrMode == controls.PEAK) {
        if(zone !== "peak") {
          vibra.playTooSlowSound();
          test.vibra = "slow";
        }
        else {
          vibra.playOk();
          test.vibra = "bump";
        }
      }
    }
  }
  return test;
}

