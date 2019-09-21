import fs from "fs";
import {
  markdownStartString,
  markdownCodeBlockEnd,
  responseMarkdown,
  operationMarkdownEnd,
  appendModalLink
} from "./codeStrings";
import {
  getDefinitionKey,
  removeKeys,
  toCamelCase,
  stringifyObj,
  isSwaggerJson
} from "./utils";

export const bodyParamsDocGenerators = (
  operationName,
  name,
  params,
  definitions
) => {
  const storeMarkdown = [];
  const thisOperationBodyParamsModals = [];
  // lets group body/formData params,path params and query params together
  const body = params.filter(param =>
    ["body", "formData"].includes(param.in) ? param : false
  );
  const pathParams = params.filter(param => param.in === "path");
  const qparams = params.filter(param => param.in === "query");

  storeMarkdown.push(
    markdownStartString({ operationName, sdkName: toCamelCase(name) })
  );

  body.forEach(({ name, schema, type, ...other }) => {
    // can't destruct "in" bcoz a reserved keyword;

    // name==="body" indicates it has a params for which a modal exist in definitions
    //  so we just comment meta info here and link to that modal below example code
    // else just name: type of param, stringify other info and comment
    // if there is a object in other info just JSON.stringify

    if (name === "body") {
      const definition = definitions[getDefinitionKey(schema)];
      storeMarkdown.push(
        `  /** ${getDefinitionKey(schema)} modal,${
          schema.type ? "type - " + schema.type + "," : ""
        } ${stringifyObj(removeKeys(other, "in"))} */`
      );
      thisOperationBodyParamsModals.push(getDefinitionKey(schema));
    } else {
      storeMarkdown.push(
        ` ${name}:${type}, /** ${stringifyObj({
          ...removeKeys(other, "in")
        })} */\n`
      );
    }
  });
  if (pathParams.length) {
    storeMarkdown.push(`  _pathParams: {\n`);
    pathParams.forEach(({ name, type, ...other }) => {
      storeMarkdown.push(
        `   ${name}:${type}, /** ${stringifyObj({
          ...removeKeys(other, "in")
        })} */ \n`
      );
    });
    storeMarkdown.push(`  }`);
  }
  if (qparams.length) {
    storeMarkdown.push(`  _params: {\n`);
    qparams.forEach(({ name, type, ...other }) => {
      storeMarkdown.push(
        `   ${name}:${type}, /** ${stringifyObj({
          ...removeKeys(other, "in")
        })} */ \n`
      );
    });
    storeMarkdown.push(`  }`);
  }
  storeMarkdown.push(markdownCodeBlockEnd());
  return {
    bodyModals: thisOperationBodyParamsModals.join(""),
    bodyString: storeMarkdown.join("")
  };
};

export const responsesDocsGenerators = responses => {
  const twoXX = {};
  const fourXX = {};
  const fiveXX = {};
  const defaultResponse = {};
  const storeMarkdown = [];
  const thisOperationResponesModals = [];

  Object.keys(responses).forEach(key => {
    if (responses[key] && responses[key].schema) {
      thisOperationResponesModals.push(getDefinitionKey(responses[key].schema));
    }
    if (key.includes("20")) {
      twoXX[key] = responses[key];
    }
    if (key.includes("40")) {
      fourXX[key] = responses[key];
    }
    if (key.includes("50")) {
      fiveXX[key] = responses[key];
    }
    if (key.includes("default")) {
      defaultResponse[key] = responses[key];
    }
  });
  storeMarkdown.push(
    `\n**Responses**\n
      `
  );
  if (Object.keys(defaultResponse).length) {
    storeMarkdown.push(
      responseMarkdown({ resCode: "Default", json: defaultResponse })
    );
  }
  if (Object.keys(twoXX).length) {
    storeMarkdown.push(
      responseMarkdown({ resCode: "Success 2XX", json: twoXX })
    );
  }
  if (Object.keys(fourXX).length) {
    storeMarkdown.push(
      responseMarkdown({ resCode: "Error 4XX", json: fourXX })
    );
  }
  if (Object.keys(fiveXX).length) {
    storeMarkdown.push(responseMarkdown({ resCode: "Error 5XX", json: fivXX }));
  }

  return {
    responseString: storeMarkdown.join(""),
    responseModals: thisOperationResponesModals.join("")
  };
};

export const modalsLinkMarkdown = (a = [], b = []) => {
  const modals = [...a, ...b];
  const storeMarkdown = [];
  storeMarkdown.push(`\n###### `);
  modals.forEach(a => storeMarkdown.push(appendModalLink(a)));
  storeMarkdown.push(operationMarkdownEnd());
  return { modalsString: storeMarkdown.join("") };
};

export const docGenerator = ({ jsonFile, name }) => {
  let _jsonFile;
  if (jsonFile) {
    _jsonFile = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  }
  const generateModalsReadMeForSwagger = json => {
    const definitions = json.definitions;
    storeMarkdown.push(`\n# Modal Definations\n`);
    Object.keys(definitions).forEach(key => {
      storeMarkdown.push(
        `\n ### ${key}-modal\n \`\`\`json\n${JSON.stringify(
          definitions[key],
          null,
          2
        )}\n\`\`\`\n`
      );
    });
  };

  let storeMarkdown = [];

  if (isSwaggerJson(_jsonFile)) {
    const pathsData = _jsonFile.paths;
    const definitions = _jsonFile.definitions;
    Object.entries(pathsData).map(path => {
      const url = path[0];
      Object.entries(path[1]).forEach(method => {
        const methodData = method[1];
        const operationName = methodData.operationId;
        const { bodyString, bodyModals } = bodyParamsDocGenerators(
          operationName,
          name,
          methodData.parameters,
          definitions
        );
        const { responseString, responseModals } = responsesDocsGenerators(
          methodData.responses
        );
        const { modalsString } = modalsLinkMarkdown(bodyModals, responseModals);
        storeMarkdown.push(bodyString);
        storeMarkdown.push(responseString);
        storeMarkdown.push(modalsString);
      });
    });
    generateModalsReadMeForSwagger(_jsonFile);
  }
  const dir = "sdk";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFile("sdk/README.md", storeMarkdown.join(""), err => {
    if (err) throw err;
  });
};
