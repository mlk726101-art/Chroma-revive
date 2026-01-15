
export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  progressMessage: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
