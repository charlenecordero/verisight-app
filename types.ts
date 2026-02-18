
export interface AnalysisArtifact {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  isAiGenerated: boolean;
  confidenceScore: number; // 0 to 100
  summary: string;
  artifacts: AnalysisArtifact[];
  verdict: 'REAL' | 'AI_GENERATED' | 'UNCERTAIN';
}

export type MediaFile = {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'audio';
};
