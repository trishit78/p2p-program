export function wrapJavaScriptCode(userCode: string, input: string) {
  return `
let input = "";
process.stdin.on("data", chunk => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const nums = JSON.parse(input.trim());

    // ===== USER CODE START =====
${userCode}
    // ===== USER CODE END =====

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});
`;
}
