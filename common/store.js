// Store clock face state to file system in case the application gets terminated

import * as fs from "fs";
let fn = "store.json";

export function load(freshObj) {
  try {
    let stats = fs.statSync(fn);
    console.log("Loaded stats " + JSON.stringify(stats));
  }
  catch(err) {
    fs.writeFileSync(fn, freshObj, "json");
    console.log("New state written " + JSON.stringify(freshObj));
    return obj;
  }

  if(stats) {
    let obj  = fs.readFileSync(fn, "json");
    let test1 = obj.hrMode;
    let test2 = obj.activityMode;
    let test3 = obj.alwaysOn;
    if(test1 != null && test2 != null && test3 != null) {
      console.log("Checked state " + JSON.stringify(obj));
      return obj;
    }
  }
  fs.writeFileSync(fn, freshObj, "json");
  console.log("Wrote new state " + JSON.stringify(freshObj));
  return freshObj;
}

export function write(obj) {
  fs.writeFileSync(fn, obj, "json");
  console.log("write:" + JSON.stringify(obj));
}
