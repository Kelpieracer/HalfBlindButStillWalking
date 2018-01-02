import * as test from "../test/test"
import * as vibra from "../common/vibra"
import { display } from "display";

export function testVibra() {
  display.autoOff = false;
  console.log("- playTooSlowSound");
  vibra.playTooSlowSound(); 
  console.log(JSON.stringify(display.on));
  test.assert(display.on, "Display is not on");
  setTimeout(function() {
    console.log("- playTooFastSound");
    vibra.playTooFastSound();  
  }, 3000);
  test.assert(display.on, "Display is not on");
}
