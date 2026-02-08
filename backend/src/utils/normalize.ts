export const normalize = (output: string) =>
  output
    .trim()
    .replace(/^["']|["']$/g, "") // Remove surrounding quotes
    .replace(/\\n/g, "\n")       // Convert literal \n to newline
    .trim()
    .replace(/\s+/g, " ");
