import * as test from "../test/test"
import * as vibra from "../common/vibra"
import { display } from "display";

export function testVibra() {
  display.autoOff = false;
  vibra.playTooSlowSound(); 
  test.assert(display.on, "Display is not on");
  setTimeout(function() {
    vibra.playTooFastSound();  
  }, 3000);
  test.assert(display.on, "Display is not on");
}
