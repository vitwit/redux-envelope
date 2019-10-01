import fs from "fs";
import { CodePlusDocGen } from "@vitwit/js-sdkgen";
import {
  initialStateStartString,
  initialStateKeyValuesString,
  initialStateEndString,
  reducerStrings,
  actionCreatorSignature,
  stringOneWithActions
} from "./code-strings/reduce-strings";

// sorry for this name
export class CodePlusDocGenPlusRedux extends CodePlusDocGen {
  constructor(...a) {
    super(...a);
    this.reducerFileStrings = [];
    this.initialStateStrings = [];
    // just overide the default apiMethodSignature as we also need operationName for our tiny reducer to work.
    this.apiMethodSignatureString = actionCreatorSignature;
    this.sdkClassStartString =stringOneWithActions;
  }

  justBeforeLoopingOverJson() {
    super.justBeforeLoopingOverJson();
    this.initialStateStrings.push(initialStateStartString);
  }
  whileLoopinOverJson(a) {
    super.whileLoopinOverJson(a);
    this.initialStateStrings.push(
      initialStateKeyValuesString({ operationName: a.operationName })
    );
  }
  justAfterLoopingOverJson() {
    super.justAfterLoopingOverJson();
    this.initialStateStrings.push(initialStateEndString);

    this.reducerFileStrings.push(this.initialStateStrings.join(""));

    this.reducerFileStrings.push(reducerStrings({ sdkName: this.name }));
  }

  generateCode() {
    super.generateCode();
    if (!fs.existsSync(this.dirPathForGeneratedSdk)) {
      fs.mkdirSync(this.dirPathForGeneratedSdk);
    }

    fs.writeFile(
      this.dirPathForGeneratedSdk + "/reducer.js",
      this.reducerFileStrings.join(""),
      err => {
        if (err) throw err;
      }
    );
  }
}
