import { vibration } from "haptics";
import { display } from "display";

static var slowPlay = 0;
static var fastPlay = 0;

// Indicate too low HR by vibrating slowPlay times
function slowPing() {
  slowPlay -= 1;
  if(slowPlay < 0) {
    slowPlay = 0;
  }
  else
  {
    vibration.start("nudge-max");
    setTimeout(slowPing, 450);
  }
}

export function playTooSlowSound()
{
  slowPlay = 5;
  slowPing();
  display.poke();
}

// Indicate too high HR by vibrating fastPlay times
function fastPing() {
  fastPlay -= 1;
  if(fastPlay < 0) {
    fastPlay = 0;
  }
  else
  {
    vibration.start("confirmation-max");
    setTimeout(fastPing, 1000);
  }
}

export function playTooFastSound()
{
  fastPlay = 3;
  fastPing();
  display.poke();
}

export function playOk()
{
    vibration.start("bump");
}