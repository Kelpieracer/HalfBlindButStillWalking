import { today } from "user-activity";
import { goals } from "user-activity";
import { user } from "user-profile";

export var modes = {STEPS: 1, CALS: 2, DISTANCE: 3, DURATION: 4};

// Returns the activity value, goal and unit
// Calories are the activity calories, and target is to have 50% of BMR calories per day
export function value(mode, distUnit) {
  if(mode == modes.STEPS)
    return { now: today.local.steps, goal: goals.steps, unit: " steps" };
  if(mode == modes.CALS) {
    let dateToday = new Date();
    let dayPart = (dateToday.getHours() * 60 + dateToday.getMinutes()) / (24 * 60);
    let bmr = user.bmr;
    let caloriesGoal = goals.calories;
    let bmrCalsUntilNow = Math.round(bmr * dayPart);
    //console.log("cal now:" + today.local.calories + " day%:" + dayPart + " bmr:" + bmr + " cal goal:" + caloriesGoal);
    return { now: Math.max(0, today.local.calories - bmrCalsUntilNow), goal: caloriesGoal - bmr, unit: " kcal" };
  }
  if(mode == modes.DISTANCE)
    return { now: today.local.distance, goal: goals.distance, unit: (distUnit == "us" ? " mi" : " km" )};
  if(mode == modes.DURATION)
    return { now: today.local.activeMinutes, goal: goals.activeMinutes, unit: " min" };
}

