import { describe, it, expect, jest } from "@jest/globals";
import { convertMarkdownToDocx } from "../src/index";
import { Options } from "../src/types";
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
        heading1Alignment: "CENTER", // Test heading alignment with image
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
        heading1Alignment: "CENTER",
        heading2Alignment: "LEFT",
        codeBlockSize: 20,
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

  it("should convert full markdown to docx with various alignments", async () => {
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
        // Test different alignments
        heading1Alignment: "CENTER",
        heading2Alignment: "RIGHT",
        paragraphAlignment: "JUSTIFIED",
        blockquoteAlignment: "CENTER",
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

  it("should handle TOC and Page Break markers", async () => {
    const markdown = `
[TOC]

# Section 1

This is the first section.

## Subsection 1.1

Content for subsection 1.1.

\\pagebreak

# Section 2

This is the second section, appearing after a page break.

### Subsection 2.1.1

More content here.

- List item 1
- List item 2
`;

    const options: Options = {
      documentType: "document" as const,
      style: {
        // Use default or slightly modified styles for testing
        titleSize: 30,
        paragraphSize: 24,
        lineSpacing: 1.15,
        // Add missing required properties
        headingSpacing: 240, // Default value
        paragraphSpacing: 240, // Default value
      },
    };

    let buffer: Blob | null = null;
    try {
      buffer = await convertMarkdownToDocx(markdown, options);
    } catch (error) {
      // Fail the test if conversion throws an error
      console.error("TOC/Page Break test failed during conversion:", error);
      throw error; // Re-throw to make Jest aware of the failure
    }

    // Verify the buffer is a valid Blob
    expect(buffer).toBeInstanceOf(Blob);
    const size = await buffer.size;
    expect(size).toBeGreaterThan(0);

    // Save the file for manual inspection
    const outputPath = path.join(outputDir, "test-toc-pagebreak.docx");
    const arrayBuffer = await buffer.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log("TOC/Page Break test output saved to:", outputPath);
  });

  it("should handle custom options with specific heading alignments", async () => {
    console.log("Starting custom options test");
    const markdown = `
## 1. Introduction

Brain-Computer Interfaces (BCIs) represent a groundbreaking technology that facilitates direct communication between the human brain and external devices. This emerging field has vast implications for assistive technologies, healthcare, and neuroscience research.

### 1.1 Background

BCIs leverage advancements in cognitive neuroscience, machine learning, and signal processing to decode neural activity and translate it into actionable outputs.

## 2. Methodology

The methodology includes a comprehensive review of existing literature, analysis of technological developments, and a systematic examination of applications.

### 2.1 Research Design

The research design for this seminar report is primarily qualitative, utilizing a systematic literature review approach.

> Key findings suggest that BCIs have significant potential in medical applications.
`;

    const customOptions: Options = {
      documentType: "report" as const,
      style: {
        titleSize: 40,
        paragraphSize: 24,
        headingSpacing: 480,
        paragraphSpacing: 360,
        lineSpacing: 1.5,
        // Test all heading alignment options
        heading1Alignment: "CENTER",
        heading2Alignment: "RIGHT",
        heading3Alignment: "LEFT",
        paragraphAlignment: "JUSTIFIED",
        blockquoteAlignment: "CENTER",
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
