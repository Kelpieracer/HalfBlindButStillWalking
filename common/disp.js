import { display } from "display";

display.autoOff = true;

export function checkDisplay(state) {
  // console.log("checkDisplay:" + JSON.stringify(state));
  if(state.alwaysOn) {
    display.poke();
  }
  else {
  }
}