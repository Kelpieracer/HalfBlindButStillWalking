import * as testVibra from "../test/vibra";
import * as testHrm from "../test/hrm";

export function unitTests() {
  console.log("UNIT TESTS STARTED");
  testHrm.testHrm();
  testVibra.testVibra();
  console.log("UNIT TESTS ENDED");
}

export function assert(condition, message) {
    console.log(JSON.stringify(condition));

    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}