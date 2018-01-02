import * as hrm from "../common/hrm";
import * as activity from "../common/activity";
import * as test from "../test/test"
import { user } from "user-profile";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";

export function testHrm() {
  test.assert(hrm.stop() == null, "HR sensor error when stopping");
  test.assert(hrm.start() == null, "HR sensor error when starting");
  test.assert(hrm.heartRate() == 0, "HR sensor value not 0 when starting");
  test.assert(30 < hrm.heartRate() < 200, "HR sensor value is 0 for second reading");
  test.assert(!hrm._isCustomHR("cardio"), "IsCustomHR detects custom");
  test.assert(hrm._isCustomHR("above-custom"), "IsCustomHR doesn't detect custom");
  
  // export function _controlHR(state, hr, zone, displayOn, restingHeartRate, sensor) {

  let sensor = new HeartRateSensor();
  let result = hrm._controlHR({hrMode: hrm.controls.OFF, activityMode: activity.modes.STEPS, alwaysOn: false}, 100, "", false, 60, sensor);
  test.assert(!result.start && result.vibra == "no", "ERR: starting when controls are off 1");

  let result = hrm._controlHR({hrMode: hrm.controls.OFF, activityMode: activity.modes.STEPS, alwaysOn: false}, 100, "", true, 60, sensor);
  test.assert(!result.start && result.vibra == "no", "ERR: starting when controls are off 1");
  
  let result = hrm._controlHR({hrMode: hrm.controls.FAT, activityMode: activity.modes.STEPS, alwaysOn: false}, 0, "", false, 60, sensor);
  console.log(JSON.stringify(result));
  test.assert(result.start && result.vibra == "no", "ERR: starting when HR is 0");
  
}