import * as hrm from "../common/hrm";
import { display } from "display";

export function checkDisplay(state) {
  // console.log("checkDisplay:" + JSON.stringify(state));
  if(state.alwaysOn && state.hrMode !== hrm.controls.OFF) {
    if(display.autoOff == true) display.autoOff = false;
    if(display.on == false) display.on = true;
  }
  else {
    if(display.autoOff == false) display.autoOff = true;
  }
}