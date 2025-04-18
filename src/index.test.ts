import { describe, it, expect, jest } from "@jest/globals";
import { convertMarkdownToDocx } from "./index";
import { Options } from "./types";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "..", "test-output");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Increase timeout for tests with image processing
jest.setTimeout(30000);

describe("convertMarkdownToDocx", () => {
  it("should handle images correctly", async () => {
    console.log("Starting image test");

    const markdown = `
# Image Test
This is a test with an embedded image.

![Test Image](https://picsum.photos/200/200)
`;

    const options: Options = {
      documentType: "document" as const,
      style: {
        titleSize: 32,
        headingSpacing: 240,
        paragraphSpacing: 240,
        lineSpacing: 1.15,
      },
    };

    console.log("Converting markdown to docx");
    const buffer = await convertMarkdownToDocx(markdown, options);
    console.log("Conversion complete, buffer size:", await buffer.size);

    // Save the file for manual inspection
    const outputPath = path.join(outputDir, "image-test.docx");
    console.log("Saving file to:", outputPath);

    const arrayBuffer = await buffer.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log("File saved successfully");

    // Verify the buffer is not empty
    const size = await buffer.size;
    expect(size).toBeGreaterThan(0);
  });

  it("should handle code blocks correctly", async () => {
    console.log("Starting code block test");

    const markdown = `
# Code Block Test
This is a test with various code blocks.

## Inline Code
This is an example of \`inline code\` in a paragraph.

## Multi-line Code Block
\`\`\`typescript
function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

const result = hello("World");
console.log(result);
\`\`\`

## Code Block with Language
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);
\`\`\`

## Code Block with Multiple Lines
\`\`\`python
def calculate_fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib
\`\`\`
`;

    const options: Options = {
      documentType: "document" as const,
      style: {
        titleSize: 32,
        headingSpacing: 240,
        paragraphSpacing: 240,
        lineSpacing: 1.15,
      },
    };

    console.log("Converting markdown to docx");
    const buffer = await convertMarkdownToDocx(markdown, options);
    console.log("Conversion complete, buffer size:", await buffer.size);

    // Save the file for manual inspection
    const outputPath = path.join(outputDir, "code-block-test.docx");
    console.log("Saving file to:", outputPath);

    const arrayBuffer = await buffer.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log("File saved successfully");

    // Verify the buffer is not empty
    const size = await buffer.size;
    expect(size).toBeGreaterThan(0);
  });

  it("should convert full markdown to docx", async () => {
    const markdown = `
# Test Document
## Subtitle
This is a paragraph with **bold** and *italic* text.

- Bullet point 1
- Bullet point 2
  **Bold text in list**

1. Numbered item 1
2. Numbered item 2

![Test Image](https://raw.githubusercontent.com/microsoft/vscode/main/resources/win32/code_70x70.png)

> This is a blockquote

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

COMMENT: This is a comment
`;

    const options: Options = {
      documentType: "document" as const,
      style: {
        titleSize: 32,
        headingSpacing: 240,
        paragraphSpacing: 240,
        lineSpacing: 1.15,
      },
    };

    const buffer = await convertMarkdownToDocx(markdown, options);

    // Save the file for manual inspection
    const outputPath = path.join(outputDir, "test-output.docx");
    const arrayBuffer = await buffer.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

    // Verify the buffer is not empty
    const size = await buffer.size;
    expect(size).toBeGreaterThan(0);
  });

  it("should handle custom options correctly", async () => {
    console.log("Starting custom options test");
    const markdown = `
# Custom Options Test
## Subtitle
This is a test with custom styling options.

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
`;

    const customOptions = {
      documentType: "report" as const,
      style: {
        titleSize: 40, // Larger than default

        headingSpacing: 480, // Double the default
        paragraphSpacing: 360, // 1.5x the default
        lineSpacing: 1.5, // Increased from default
      },
    };

    console.log("Converting markdown with custom options");
    const buffer = await convertMarkdownToDocx(markdown, customOptions);
    console.log("Conversion complete, buffer size:", await buffer.size);

    // Save the file for manual inspection
    const outputPath = path.join(outputDir, "custom-options-test.docx");
    const arrayBuffer = await buffer.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log("File saved to:", outputPath);

    // Verify the buffer is not empty
    const size = await buffer.size;
    expect(size).toBeGreaterThan(0);
  });
});
