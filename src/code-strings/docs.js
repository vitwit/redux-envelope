export const markdownStartString = ({ sdkName, operationName }) => `
<details>

<summary>${operationName}</summary>

${operationName}
---
 **Example**

 \`\`\`js
 const  { data, error } = await ${sdkName}.${operationName}({
`;

export const markdownCodeBlockEnd = () => `
})
\`\`\``;

export const appendModalLink = modal => ` [${modal}](###${modal}-modal) `;

export const operationMarkdownEnd = () => `
</details>
`;

export const responseMarkdown = ({ resCode, json }) =>
  `\n> ${resCode}\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\`\n`;
