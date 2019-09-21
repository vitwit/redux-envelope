import fs from "fs";
import { reducerStrings } from "./codeStrings";

export const reducerGenerator = (sdkName = "your", initialStateString) => {
  const storeReducerString = [];
  storeReducerString.push(initialStateString);
  storeReducerString.push(reducerStrings({ sdkName }));
  const dir = "sdk";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFile("sdk/reducer.js", storeReducerString.join(""), err => {
    if (err) throw err;
  });
};
