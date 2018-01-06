// --- Clockface for Fitbit Ionic
// --- HALF BLIND BUT STILL WALKING
// ---
// --- For those of us who need spectacles for reading: large fonts, essential info
// --- 
// --- Shows current time, and of cours day of week and month
// --- Shows activity of today: steps, calories, distance and duration, and indicates achievements with colors
// --- Shows heart rate and indicates heart rate zone with colors
// --- Shows battery level, indicates low battery with colors
// --- Indicates heart rate with colors
// --- Controls heart rate: alerts if heart rate is out of the zone you chose
// ---
// --- Developed by Kelpieracer during Christmas 2017
// --- https://github.com/Kelpieracer/HalfBlindButStillWalking
// --- MIT license

import * as util from "../common/utils";
import * as hrm from "../common/hrm";
import * as store from "../common/store";
import * as activity from "../common/activity";
import * as disp from "../common/disp";
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import { display } from "display";
import { user } from "user-profile";
import { vibration } from "haptics";
import { units } from "user-settings";

// Unit Tests
import * as test from "../test/test"
//test.unitTests(); // Comment this out for production

var dayTexts = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var state = {hrMode: hrm.controls.OFF, activityMode: activity.modes.STEPS, alwaysOn: false};

let normalCol = "white";
let easyCol = "white";
let okCol = "lawngreen";
let warnCol = "yellow";
let hotCol = "fb-red";
let offCol = "black";
let customCol = "aqua";

// Update the clock every second when dispay is on
clock.granularity = "seconds";

// Get a handle on the <text> element
let myLabelTime = document.getElementById("myLabelTime");
let myActivityButton = document.getElementById("myActivityButton");
let myHRButton = document.getElementById("myHRButton");
let myBattButton = document.getElementById("myBattButton");
let myLabelActivity = document.getElementById("myLabelActivity");
let myLabelActivityUnit = document.getElementById("myLabelActivityUnit");
let myLabelBatt = document.getElementById("myLabelBatt");
let myLabelHR = document.getElementById("myLabelHR");
let myLabelDay = document.getElementById("myLabelDay");
let myLabelDayText = document.getElementById("myLabelDayText");

// Update the <text> element with the current time
function updateClock() {
  let distUnit = units.distance;
  let dateToday = new Date();
  let mins = util.zeroPad(dateToday.getMinutes());
  let day = dateToday.getDate();
  let dayNum = dateToday.getDay();
  let myBatt = battery.chargeLevel;
  let timePreference = util.formatDate(dateToday.getHours(), preferences.clockDisplay, dayTexts[dayNum]);
  let hours = util.spacePad(timePreference.hour);

  myLabelTime.text = `${hours}:${mins}`;
  myLabelBatt.text = myBatt + "%";
  myLabelDay.text = day;
  myLabelDayText.text = timePreference.str;

  if(myBatt < 20)
    myLabelBatt.style.fill = hotCol;
  else if(myBatt < 50)
    myLabelBatt.style.fill = warnCol;
  else
    myLabelBatt.style.fill = easyCol;
  if(myBatt >= 100)
    myLabelBatt.style.fontFamily = "Fabrikat-Bold";
  else
    myLabelBatt.style.fontFamily = "Colfax-Medium";
    

  // Show activity value in the middle
  //   Color of the value has a meaning:
  //   - green: over the goal
  //   - yellow: within 70% of the goal
  //   - read: less than 70% of the goal
  let val = activity.value(state.activityMode, distUnit);
  if(val.now < val.goal * 0.7) {
    myLabelActivity.style.fill = hotCol;
  }
  else if(val.now < val.goal) {
    myLabelActivity.style.fill = warnCol;
  }
  else {
    myLabelActivity.style.fill = okCol;
  }
  myLabelActivityUnit.style.fill = myLabelActivity.style.fill;
  myLabelActivity.text = (state.activityMode == activity.modes.DISTANCE ? util.distanceRounded(val.now, distUnit) : val.now);
  myLabelActivityUnit.text = val.unit;
 
  // Unit needs some adjustment in order to fit
  if(val.unit.length >= 6)  {
    myLabelActivityUnit.style.fontFamily = "Fabrikat-Bold";
    myLabelActivityUnit.style.fontSize = 40;
  }
  else {
    myLabelActivityUnit.style.fontFamily = "Colfax-Medium";
    myLabelActivityUnit.style.fontSize = 45;
  }
  
  // Show current heart rate zone by color
  var hr = hrm.heartRate();
  myLabelHR.text = hr ? hr : "";
  if(hr && hr > 0) {
    var zone = user.heartRateZone(hr);
    var hrcol = easyCol;
    if(zone == "out-of-range" || zone == "below-custom") 
      hrcol = easyCol;
    else if(zone == "fat-burn") 
      hrcol = okCol;
    else if(zone == "custom") 
      hrcol = customCol;
    else if(zone == "cardio") 
      hrcol = warnCol;
    else if(zone == "peak" || zone == "above-custom") 
      hrcol = hotCol;
    myLabelHR.style.fill = hrcol;
  }
  disp.checkDisplay(state);
}

// When display wakes up or switches off
function displayChange() {
  if (display.on) {
    console.log("Display on event");
    hrm.start();
    console.log("HRM started");
  }
  else {
    console.log("Display off event");
    if(state.hrMode == hrm.controls.OFF) {
      hrm.stop();
      console.log("HRM stopped");
    }
  }
}


// Toggles the heart-rate control mode
function changeHRMode(add) {
  if(hrm.isCustomHR()) {
    if(state.hrMode !== hrm.controls.OFF) {
      state.hrMode = hrm.controls.OFF;
      myHRButton.style.fill = offCol;
    }
    else {
      state.hrMode = hrm.controls.CUSTOM;
      myHRButton.style.fill = customCol;
    }
  }
  else {
    state.hrMode = (state.hrMode + add) % 5;
    if(state.hrMode == hrm.controls.CUSTOM) {
      state.hrMode += 1;
    }
    if(state.hrMode == hrm.controls.OFF) myHRButton.style.fill = offCol;
    if(state.hrMode == hrm.controls.FAT) myHRButton.style.fill = okCol;
    if(state.hrMode == hrm.controls.CARDIO) myHRButton.style.fill = warnCol;
    if(state.hrMode == hrm.controls.PEAK) myHRButton.style.fill = hotCol;
  }
  console.log("New HR control mode:" + state.hrMode)
  if(state.hrMode == hrm.controls.OFF) {
    myBattButton.style.visibility = "hidden";
    state.alwaysOn = false;
  }
  else {
    myBattButton.style.visibility = "visible";
  }
  store.write(state);
}

function changeDispMode(change) {
  if(change) {
    state.alwaysOn = !state.alwaysOn;
    store.write(state);
  }
  if(state.alwaysOn) {
    myBattButton.style.fill = normalCol;
  }
  else {
    myBattButton.style.fill = offCol;
  }
  disp.checkDisplay(state);
}

//Activity button for toggling shown activity in the middle of the screen
myActivityButton.onactivate = function(evt) {
  vibration.start("bump");
  state.activityMode = (state.activityMode) % 4 + 1;
  store.write(state);
  updateClock();
}

//Heart-rate control button to toggle the heart-rate activity mode
myHRButton.onactivate = function(evt) {
  vibration.start("bump");
  changeHRMode(1);
}

//Battery button changes display always on or off
myBattButton.onactivate = function(evt) {
  vibration.start("bump");
  changeDispMode(true);
}

// Main
display.on = false;
display.autoOff = true;
display.poke();
state = store.load(state);
changeHRMode(0);
changeDispMode(false);
display.onchange = () => displayChange();
clock.ontick = () => updateClock();
hrm.start();
hrm.controlHR(state);
setInterval(function() { hrm.controlHR(state); }, 20000);
