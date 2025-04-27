/**
 * Converter Types and Interfaces
 * This file defines the core types and interfaces for the modular converter system.
 */

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'heic' | 'avif' | 'webp';
export type VideoFormat = 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv';
export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'psd';
export type FileFormat = ImageFormat | VideoFormat | DocumentFormat;

export interface ConversionPair {
  inputFormat: FileFormat;
  outputFormat: FileFormat;
}

export interface ConversionOptions {
  quality?: number;  // 0-100 for images, bitrate for videos
  resize?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
  advanced?: Record<string, any>; // For format-specific options
}

export interface ConversionResult {
  success: boolean;
  data?: Blob;
  error?: string;
  metadata?: {
    originalSize: number;
    convertedSize: number;
    conversionTime: number;
    compressionRatio?: number;
  };
}

export interface ProgressUpdate {
  progress: number; // 0-100
  stage?: string;
  file?: number;
  totalFiles?: number;
}

export interface Converter {
  supportedInputFormats: FileFormat[];
  supportedOutputFormats: FileFormat[];
  
  canConvert(from: FileFormat, to: FileFormat): boolean;
  
  convert(
    file: File, 
    outputFormat: FileFormat, 
    options?: ConversionOptions,
    onProgress?: (update: ProgressUpdate) => void
  ): Promise<ConversionResult>;
  
  convertBatch(
    files: File[], 
    outputFormat: FileFormat, 
    options?: ConversionOptions,
    onProgress?: (update: ProgressUpdate) => void
  ): Promise<ConversionResult>;
}
