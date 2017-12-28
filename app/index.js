'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var userProfile = require('user-profile');
var heartRate = require('heart-rate');
var fs = require('fs');
var clock = _interopDefault(require('clock'));
var document = _interopDefault(require('document'));
var userSettings = require('user-settings');
var userActivity = require('user-activity');
var power = require('power');
var display = require('display');
var haptics = require('haptics');

function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function spacePad(i) {
    if (i < 10) {
        i = " " + i;
    }
    return i;
}
function formatDate(hh, clock$$1, str) {
    var dd = "AM";
    var h = hh;
    if (clock$$1 == "12h") {
        if (h >= 12) {
            h = hh - 12;
            dd = "PM";
        }
        if (h == 0) {
            h = 12;
        }
        str = dd;
    }
    return { hour: h, str: str };
}
function distanceRounded(dist, unit) {
    var distVal = dist / 1000;
    if (unit == "us")
        distVal *= 0.621371;
    var str = distVal.toString();
    str = decimalAdjust("round", distVal, -3).toString();
    if (str.length > 5)
        str = decimalAdjust("round", distVal, -2).toString();
    if (str.length > 5)
        str = decimalAdjust("round", distVal, -1).toString();
    if (str.length > 5)
        str = decimalAdjust("round", distVal, 0).toString();
    return str;
}
function decimalAdjust(type, value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    if (value < 0) {
        return -decimalAdjust(type, -value, exp);
    }
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

var hrm = new heartRate.HeartRateSensor();
var first = true;
function start() {
    hrm.start();
}
function stop() {
    first = true;
    hrm.stop();
}
function heartRate$1() {
    hrm.start();
    if (first) {
        first = false;
        return 0;
    }
    return hrm.heartRate;
}
function isCustomHR() {
    if (userProfile.user.heartRateZone(100).indexOf("custom") > -1)
        return true;
    else
        return false;
}

var fn = "store.json";
function load(obj) {
    try {
        var stats = fs.statSync(fn);
    }
    catch (err) {
        fs.writeFileSync(fn, obj, "json");
        return obj;
    }
    if (stats) {
        obj = fs.readFileSync(fn, "json");
        return obj;
    }
    else {
        fs.writeFileSync(fn, obj, "json");
        return obj;
    }
    console.log("load:" + JSON.stringify(obj));
}
function write(obj) {
    fs.writeFileSync(fn, obj, "json");
    console.log("write:" + JSON.stringify(obj));
}

console.log(userSettings.units.distance);
var dayTexts = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var activityModes = { STEPS: 1, CALS: 2, DISTANCE: 3, DURATION: 4 };
var hrControls = { OFF: 0, CUSTOM: 1, FAT: 2, CARDIO: 3, PEAK: 4 };
var vault = { hrMode: hrControls.OFF, activityMode: activityModes.STEPS };
var easyCol = "white";
var okCol = "lawngreen";
var warnCol = "yellow";
var hotCol = "fb-red";
var offCol = "black";
var customCol = "aqua";
clock.granularity = "seconds";
var myLabelTime = document.getElementById("myLabelTime");
var myActivityButton = document.getElementById("myActivityButton");
var myHRButton = document.getElementById("myHRButton");
var myLabelActivity = document.getElementById("myLabelActivity");
var myLabelActivityUnit = document.getElementById("myLabelActivityUnit");
var myLabelBatt = document.getElementById("myLabelBatt");
var myLabelHR = document.getElementById("myLabelHR");
var myLabelDay = document.getElementById("myLabelDay");
var myLabelDayText = document.getElementById("myLabelDayText");
var secondsFromDisplayOn = 0;
function updateClock() {
    var distUnit = userSettings.units.distance;
    var dateToday = new Date();
    var mins = zeroPad(dateToday.getMinutes());
    var day = dateToday.getDate();
    var dayNum = dateToday.getDay();
    var myBatt = power.battery.chargeLevel;
    var timePreference = formatDate(dateToday.getHours(), userSettings.preferences.clockDisplay, dayTexts[dayNum]);
    var hours = spacePad(timePreference.hour);
    myLabelTime.text = hours + ":" + mins;
    myLabelBatt.text = myBatt + "%";
    myLabelDay.text = day;
    myLabelDayText.text = timePreference.str;
    secondsFromDisplayOn += 1;
    if (myBatt < 25 && secondsFromDisplayOn >= 5) {
        display.display.on = false;
    }
    if (myBatt < 20)
        myLabelBatt.style.fill = hotCol;
    else if (myBatt < 50)
        myLabelBatt.style.fill = warnCol;
    else
        myLabelBatt.style.fill = easyCol;
    var val = activityVal(vault.activityMode, distUnit);
    if (val.now < val.goal * 0.7) {
        myLabelActivity.style.fill = hotCol;
    }
    else if (val.now < val.goal) {
        myLabelActivity.style.fill = warnCol;
    }
    else {
        myLabelActivity.style.fill = okCol;
    }
    myLabelActivityUnit.style.fill = myLabelActivity.style.fill;
    myLabelActivity.text = (vault.activityMode == activityModes.DISTANCE ? distanceRounded(val.now, distUnit) : val.now);
    myLabelActivityUnit.text = val.unit;
    if (val.unit.length >= 6) {
        myLabelActivityUnit.style.fontFamily = "Fabrikat-Bold";
        myLabelActivityUnit.style.fontSize = 40;
    }
    else {
        myLabelActivityUnit.style.fontFamily = "Colfax-Medium";
        myLabelActivityUnit.style.fontSize = 45;
    }
    var hr = heartRate$1();
    myLabelHR.text = hr ? hr : "";
    if (hr && hr > 0) {
        var zone = userProfile.user.heartRateZone(hr);
        var hrcol = easyCol;
        if (zone == "out-of-range" || zone == "below-custom")
            hrcol = easyCol;
        else if (zone == "fat-burn")
            hrcol = okCol;
        else if (zone == "custom")
            hrcol = customCol;
        else if (zone == "cardio")
            hrcol = warnCol;
        else if (zone == "peak" || zone == "above-custom")
            hrcol = hotCol;
        myLabelHR.style.fill = hrcol;
    }
}
function displayChange() {
    if (display.display.on) {
        console.log("Display on event");
        start();
        console.log("HRM started");
        secondsFromDisplayOn = 0;
    }
    else {
        console.log("Display off event");
        if (vault.hrMode == hrControls.OFF) {
            stop();
            console.log("HRM stopped");
        }
        secondsFromDisplayOn = 0;
    }
}
function activityVal(mode, distUnit) {
    if (mode == activityModes.STEPS)
        return { now: userActivity.today.local.steps, goal: userActivity.goals.steps, unit: " steps" };
    if (mode == activityModes.CALS) {
        var dateToday = new Date();
        var dayPart = (dateToday.getHours() * 60 + dateToday.getMinutes()) / (24 * 60);
        var bmr = userProfile.user.bmr;
        var caloriesGoal = userActivity.goals.calories;
        var bmrCalsUntilNow = Math.round(bmr * dayPart);
        console.log("cal now:" + userActivity.today.local.calories + " day%:" + dayPart + " bmr:" + bmr + " cal goal:" + caloriesGoal);
        return { now: Math.max(0, userActivity.today.local.calories - bmrCalsUntilNow), goal: caloriesGoal - bmr, unit: " kcal" };
    }
    if (mode == activityModes.DISTANCE)
        return { now: userActivity.today.local.distance, goal: userActivity.goals.distance, unit: (distUnit == "us" ? " mi" : " km") };
    if (mode == activityModes.DURATION)
        return { now: userActivity.today.local.activeMinutes, goal: userActivity.goals.activeMinutes, unit: " min" };
}
function changeHRMode(add) {
    if (isCustomHR()) {
        if (vault.hrMode !== hrControls.OFF) {
            vault.hrMode = hrControls.OFF;
            myHRButton.style.fill = offCol;
        }
        else {
            vault.hrMode = hrControls.CUSTOM;
            myHRButton.style.fill = customCol;
        }
    }
    else {
        vault.hrMode = (vault.hrMode + add) % 5;
        if (vault.hrMode == hrControls.CUSTOM) {
            vault.hrMode += 1;
        }
        if (vault.hrMode == hrControls.OFF)
            myHRButton.style.fill = offCol;
        if (vault.hrMode == hrControls.FAT)
            myHRButton.style.fill = okCol;
        if (vault.hrMode == hrControls.CARDIO)
            myHRButton.style.fill = warnCol;
        if (vault.hrMode == hrControls.PEAK)
            myHRButton.style.fill = hotCol;
    }
    console.log("New HR control mode:" + vault.hrMode);
    write(vault);
}
var slowPlay = 0;
var fastPlay = 0;
function slowPing() {
    slowPlay -= 1;
    if (slowPlay < 0) {
        slowPlay = 0;
    }
    else {
        haptics.vibration.start("nudge-max");
        setTimeout(slowPing, 450);
    }
}
function playTooSlowSound() {
    console.log("Slow");
    slowPlay = 5;
    slowPing();
    display.display.on = true;
}
function fastPing() {
    fastPlay -= 1;
    if (fastPlay < 0) {
        fastPlay = 0;
    }
    else {
        haptics.vibration.start("confirmation-max");
        setTimeout(fastPing, 1000);
    }
}
function playTooFastSound() {
    console.log("Fast");
    fastPlay = 3;
    fastPing();
    display.display.on = true;
}
function controlHR() {
    var hr = heartRate$1();
    console.log("HR check:" + hr);
    if (vault.hrMode !== hrControls.OFF) {
        start();
        console.log("HRM on");
    }
    else if (display.display.on == false) {
        stop();
        console.log("HRM off");
        return;
    }
    if (!hr || hr <= 0 || vault.hrMode == hrControls.OFF)
        return;
    var zone = userProfile.user.heartRateZone(hr);
    var hrCheckLowLimit = userProfile.user.restingHeartRate * (vault.hrMode == hrControls.FAT ? 1.15 : 1.2);
    console.log("HR:" + hr + " LowLimit:" + Math.round(hrCheckLowLimit) + " Mode:" + vault.hrMode);
    if (hr > hrCheckLowLimit && vault.hrMode !== hrControls.OFF) {
        if (isCustomHR()) {
            console.log("custom");
            if (zone == "below-custom")
                playTooSlowSound();
            else if (zone == "above-custom")
                playTooFastSound();
            else
                haptics.vibration.start("bump");
        }
        else {
            console.log("standard");
            if (vault.hrMode == hrControls.FAT) {
                console.log("fat " + zone);
                if (zone == "out-of-range")
                    playTooSlowSound();
                else if (zone == "cardio" || zone == "peak")
                    playTooFastSound();
                else
                    haptics.vibration.start("bump");
            }
            if (vault.hrMode == hrControls.CARDIO) {
                console.log("cardio " + zone);
                if (zone == "out-of-range" || zone == "fat-burn")
                    playTooSlowSound();
                else if (zone == "peak")
                    playTooFastSound();
                else
                    haptics.vibration.start("bump");
            }
            if (vault.hrMode == hrControls.PEAK) {
                console.log("peak " + zone);
                if (zone !== "peak")
                    playTooSlowSound();
                else
                    haptics.vibration.start("bump");
            }
            
        }
    }
}
myActivityButton.onactivate = function (evt) {
    haptics.vibration.start("bump");
    vault.activityMode = (vault.activityMode) % 4 + 1;
    write(vault);
    updateClock();
};
myHRButton.onactivate = function (evt) {
    haptics.vibration.start("bump");
    changeHRMode(1);
};
vault = load(vault);
display.display.autoOff = true;
changeHRMode(0);
display.display.onchange = function () { return displayChange(); };
clock.ontick = function () { return updateClock(); };
start();
controlHR();
setInterval(controlHR, 20000);
