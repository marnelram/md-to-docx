import { saveAs } from "file-saver";

export function downloadDocx(
  blob: Blob,
  filename: string = "document.docx"
): void {
  try {
    saveAs(blob, filename);
  } catch (error) {
    console.error("Failed to save file:", error);
  }
}
