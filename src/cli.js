import fs from "fs";
import chalk from "chalk";
import { parseArgumentsIntoOptions, Schedular } from "@vitwit/js-sdkgen";
import { CodePlusDocGenPlusRedux } from "./main";

export async function cli(args) {
  const { parsedArgs, ...options } = parseArgumentsIntoOptions(args);

  if (!options.jsonFile) {
    console.error("%s --json-file is required", chalk.red.bold("ERROR"));

    process.exit(1);
  }
  const schedular = new Schedular(options,parsedArgs, { pkg: "redux-envelope" });
  schedular.CodeGenToUse = CodePlusDocGenPlusRedux;
  await schedular.generateSDK();
}
