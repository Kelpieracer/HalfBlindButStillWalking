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
  let result = hrm._controlHR({hrMode: hrm.controls.OFF, alwaysOn: false}, 100, "", false, 60, sensor);
  test.assert(!result.start && result.vibra == "no", "ERR: starting when controls are off 1");

  let result = hrm._controlHR({hrMode: hrm.controls.OFF, alwaysOn: false}, 100, "", true, 60, sensor);
  test.assert(!result.start && result.vibra == "no", "ERR: starting when controls are off 1");
  
  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 0, "", false, 60, sensor);
  test.assert(result.start && result.vibra == "no", "ERR: starting when HR is 0");
  
  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 68, "", false, 60, sensor);
  test.assert(result.start && result.vibra == "no", "ERR: vibra when HR is low");

  let result = hrm._controlHR({hrMode: hrm.controls.CUSTOM, alwaysOn: false}, 70, "", false, 60, sensor);
  test.assert(result.start && result.vibra == "no", "ERR: vibra when HR is low");

  let result = hrm._controlHR({hrMode: hrm.controls.CUSTOM, alwaysOn: false}, 80, "below-custom", false, 60, sensor);
  test.assert(result.start && result.vibra == "slow", "ERR: vibra when HR is below custom");

  let result = hrm._controlHR({hrMode: hrm.controls.CUSTOM, alwaysOn: false}, 90, "custom", false, 60, sensor);
  test.assert(result.start && result.vibra == "bump", "ERR: vibra when HR is at custom");
  
  let result = hrm._controlHR({hrMode: hrm.controls.CUSTOM, alwaysOn: false}, 100, "above-custom", false, 60, sensor);
  test.assert(result.start && result.vibra == "fast", "ERR: vibra when HR is above custom");

  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 60, "out-of-range", false, 60, sensor);
  test.assert(result.start && result.vibra == "no", "ERR: vibra when HR is low");

  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 80, "out-of-range", false, 60, sensor);
  test.assert(result.start && result.vibra == "slow", "ERR: vibra when HR is below fat");

  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 100, "fat-burn", false, 60, sensor);
  test.assert(result.start && result.vibra == "bump", "ERR: vibra when HR is at fat-burn");
  
  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 130, "cardio", false, 60, sensor);
  test.assert(result.start && result.vibra == "fast", "ERR: vibra when HR is above fat-burn");

  let result = hrm._controlHR({hrMode: hrm.controls.FAT, alwaysOn: false}, 130, "peak", false, 60, sensor);
  test.assert(result.start && result.vibra == "fast", "ERR: vibra when HR is above fat-burn");
  console.log(JSON.stringify(result));
  
}