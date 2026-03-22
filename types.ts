
export interface SynthesisImage {
  id: string;
  dataUrl: string;
  file: File;
  type: 'IDENTITY' | 'POSE';
}

export enum SynthesisStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SynthesisResult {
  imageUrl: string;
  metadata: {
    timestamp: number;
    model: string;
  };
}
