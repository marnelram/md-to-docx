# Markdown to DOCX Converter

A powerful TypeScript module that converts Markdown text to Microsoft Word (.docx) documents with support for various Markdown features. Perfect for both Node.js and browser environments.

## Github Repo (Open Source)

[https://github.com/MohtashamMurshid/md-to-docx]

## Features

- 🎯 Convert Markdown to DOCX format
- 📝 Support for all heading levels (H1-H5)
- 📋 Bullet points and numbered lists
- 📊 Tables with headers and data
- 🔤 Bold and italic text formatting
- 💬 Blockquotes
- 💡 Comments
- 🎨 Customizable styling
- 📄 Report and document modes
- 🌐 Browser and Node.js support
- 🖼️ Support for embedded images
- 💻 Code blocks (inline and multi-line)
- 🔗 Support for links
- ~~Strikethrough~~ text support
- 📏 Custom font sizes for all elements

## Installation

```bash
npm install @mohtasham/md-to-docx
```

## Usage

### Basic Usage

```typescript
import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";

const markdown = `
# Title
## Subtitle
This is a paragraph with **bold** and *italic* text.

- Bullet point 1
- Bullet point 2
  **Bold text in list**

1. Numbered item 1
2. Numbered item 2

> This is a blockquote

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

# Multi-line Code Block
\`\`\`typescript
function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

const result = hello("World");
console.log(result);
\`\`\`

# Image Test
This is a test with an embedded image.

![Test Image](https://picsum.photos/200/200)

COMMENT: This is a comment

`;

// Convert to DOCX
const blob = await convertMarkdownToDocx(markdown);

// Download in browser
downloadDocx(blob, "output.docx");
```

### With Custom Options

```typescript
const options = {
  documentType: "report", // or 'document'
  style: {
    titleSize: 32,
    headingSpacing: 240,
    paragraphSpacing: 240,
    lineSpacing: 1.15,
    // Custom font sizes for different elements
    heading1Size: 32,
    heading2Size: 28,
    heading3Size: 24,
    heading4Size: 20,
    heading5Size: 18,
    paragraphSize: 24,
    listItemSize: 24,
    codeBlockSize: 20,
    blockquoteSize: 24,
  },
};

const blob = await convertMarkdownToDocx(markdown, options);
```

### In React

```typescript
import { useState } from "react";
import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";

function MarkdownConverter() {
  const [markdown, setMarkdown] = useState("");

  const handleConvert = async () => {
    try {
      const blob = await convertMarkdownToDocx(markdown);
      downloadDocx(blob, "converted.docx");
    } catch (error) {
      console.error("Conversion failed:", error);
    }
  };

  return (
    <div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <button onClick={handleConvert}>Convert to DOCX</button>
    </div>
  );
}
```

## API

### `convertMarkdownToDocx(markdown: string, options?: Options): Promise<Blob>`

Converts Markdown text to a DOCX document.

#### Parameters

- `markdown` (string): The Markdown text to convert
- `options` (object, optional): Configuration options
  - `documentType` (string): Either 'document' or 'report'
  - `style` (object): Styling options
    - `titleSize` (number): Font size for titles
    - `headingSpacing` (number): Spacing before/after headings
    - `paragraphSpacing` (number): Spacing before/after paragraphs
    - `lineSpacing` (number): Line spacing multiplier
    - `heading1Size` (number): Font size for H1 headings
    - `heading2Size` (number): Font size for H2 headings
    - `heading3Size` (number): Font size for H3 headings
    - `heading4Size` (number): Font size for H4 headings
    - `heading5Size` (number): Font size for H5 headings
    - `paragraphSize` (number): Font size for paragraphs
    - `listItemSize` (number): Font size for list items
    - `codeBlockSize` (number): Font size for code blocks
    - `blockquoteSize` (number): Font size for blockquotes

#### Returns

Promise that resolves to a Blob containing the DOCX file.

### `downloadDocx(blob: Blob, filename?: string): void`

Downloads a DOCX file in the browser environment.

#### Parameters

- `blob` (Blob): The Blob containing the DOCX file data
- `filename` (string, optional): The name to save the file as (defaults to "document.docx")

#### Throws

- Error if called outside browser environment
- Error if invalid blob or filename is provided
- Error if file save fails

## Markdown Support

The module supports the following Markdown features:

- Headings: `#`, `##`, `###`, `####`, `#####`
- Lists: `-`, `*`, `1.`, `2.`, etc.
- Bold: `**text**`
- Italic: `*text*`
- Strikethrough: `~~text~~`
- Blockquotes: `> text`
- Tables: `| Header | Header |`
- Comments: `COMMENT: text`
- Images: `![alt text](image-url)`
- Code blocks: \`\`\`code\`\`\`
- Inline code: \`code\`
- Links: `[text](url)`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
