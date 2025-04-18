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
## 1. Introduction

Brain-Computer Interfaces (BCIs) represent a groundbreaking technology that facilitates direct communication between the human brain and external devices. This emerging field has vast implications for assistive technologies, healthcare, and neuroscience research. BCIs leverage advancements in cognitive neuroscience, machine learning, and signal processing to decode neural activity and translate it into actionable outputs. The capabilities of BCIs extend beyond mere communication; they hold the potential to revolutionize how individuals interact with technology, thereby enhancing autonomy for those with physical disabilities.

The concept of BCIs, though relatively modern, has its roots in the mid-20th century, evolving significantly with the advent of sophisticated imaging and computational tools. Early developments laid the groundwork for contemporary applications by demonstrating the feasibility of interpreting neural signals to control external devices. As such, BCIs enable individuals with severe physical disabilities to regain independence by providing alternative communication and control methods. Beyond assistive technologies, BCIs are also being explored in diverse fields such as gaming, education, and mental health monitoring, showcasing their versatile potential.

This seminar report aims to provide an in-depth exploration of the evolution, components, applications, challenges, and future prospects of Brain-Computer Interfaces. It will analyze how technological advancements have influenced the development of BCIs while addressing ethical considerations that accompany this innovative technology. By examining these facets comprehensively, this report seeks to contribute to a greater understanding of BCIs' significance within both scientific discourse and practical application contexts.

## 3. Methodology

This section outlines the methodology employed in the exploration of Brain-Computer Interfaces (BCIs) within this seminar report. The methodology includes a comprehensive review of existing literature, analysis of technological developments, and a systematic examination of applications and implications associated with BCIs. By synthesizing diverse sources of information, the report aims to present a cohesive understanding of the current state of BCIs and their future prospects.

### 3.1 Research Design

The research design for this seminar report is primarily qualitative, utilizing a systematic literature review approach to gather and analyze relevant scholarly articles, technical reports, and industry publications pertaining to BCIs. This approach allows for an in-depth exploration of both historical developments and contemporary advancements in the field. The selection criteria for literature included peer-reviewed journal articles, conference papers, and reputable books published within the last two decades to ensure that the information is both relevant and current.

The research process involved the identification of key themes related to BCIs, including signal acquisition methods, signal processing techniques, output devices, applications across various sectors, challenges faced by the technology, and ethical considerations. Following this thematic categorization, a detailed analysis was conducted to evaluate how these elements interact within the broader context of BCI advancements.



`;

    const customOptions = {
      documentType: "report" as const,
      style: {
        titleSize: 40, // Larger than default
        paragraphSize: 24,
        headingSpacing: 480, // Double the default
        paragraphSpacing: 360, // 1.5x the default
        lineSpacing: 1.5, // Increased from default
        headingAlignment: "CENTER" as const,
        paragraphAlignment: "JUSTIFIED" as const,
        blockquoteAlignment: "CENTER" as const,
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

describe("Text Alignment Tests", () => {
  test("should apply different alignments to various elements", async () => {
    const markdown = `# Centered Title

## Right-Aligned Subtitle

This is a justified paragraph that demonstrates how text can be spread evenly across the width of the page. This creates a clean, professional look with straight edges on both the left and right margins.

> This is a centered blockquote that stands out from the regular text.

This is a left-aligned paragraph (default alignment) that shows the standard text positioning. It's easy to read and follows traditional document formatting.

### Center-Aligned Heading

This is another justified paragraph to show consistency in formatting. When you have longer paragraphs of text, justified alignment can make them look more organized and professional in formal documents.`;

    const options: Options = {
      documentType: "document",
      style: {
        // Font sizes
        titleSize: 32,
        paragraphSize: 24,
        headingSpacing: 240,
        paragraphSpacing: 240,
        lineSpacing: 1.15,
        // Alignment settings - using new implementation
        paragraphAlignment: "JUSTIFIED" as const,
        blockquoteAlignment: "CENTER" as const,
        // Note: headingAlignment not needed as it's handled by headingConfigs
      },
    };

    const buffer = await convertMarkdownToDocx(markdown, options);

    // Save the file for manual inspection
    const outputPath = path.join(outputDir, "alignment-test.docx");
    const arrayBuffer = await buffer.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

    // Verify the buffer is not empty
    expect(buffer).toBeInstanceOf(Blob);
    expect(await buffer.size).toBeGreaterThan(0);
  });

  test("should handle mixed alignments in a complex document", async () => {
    const markdown = `# Center Title

This paragraph will be justified across the page width.

## Right Heading

> Left-aligned blockquote with some meaningful text.

### Another Center Heading

1. First list item
2. Second list item
3. Third list item

This is the final paragraph with justified text alignment.`;

    const options = {
      documentType: "report" as const,
      style: {
        // Basic styling
        titleSize: 28,
        paragraphSize: 22,
        headingSpacing: 240,
        paragraphSpacing: 200,
        lineSpacing: 1.2,

        // Mixed alignments
        headingAlignment: "CENTER" as const,
        paragraphAlignment: "JUSTIFIED" as const,
        blockquoteAlignment: "LEFT" as const,
      },
    };

    const result = await convertMarkdownToDocx(markdown, options);
    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBeGreaterThan(0);
  });

  test("should apply default left alignment when not specified", async () => {
    const markdown = `# Title

## Subtitle

Regular paragraph text.

> A blockquote.

### Another Heading

Final paragraph.`;

    const options = {
      documentType: "document" as const,
      style: {
        titleSize: 32,
        paragraphSize: 24,
        headingSpacing: 240,
        paragraphSpacing: 240,
        lineSpacing: 1.15,
        // No alignment specified - should default to LEFT
      },
    };

    const result = await convertMarkdownToDocx(markdown, options);
    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBeGreaterThan(0);
  });
});
