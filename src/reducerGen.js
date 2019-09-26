import fs from "fs";
import { reducerStrings } from "./code-strings/reduxCodeStrings";

export const reducerGenerator = (sdkName = "your", initialStateString) => {
  const storeReducerString = [];
  storeReducerString.push(initialStateString);
  storeReducerString.push(reducerStrings({ sdkName }));
  const dir = "src/sdk";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFile("src/sdk/reducer.js", storeReducerString.join(""), err => {
    if (err) throw err;
  });
};
