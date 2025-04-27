/**
 * Conversion Configuration
 * Defines the available conversion types and their settings
 */

import { ConversionPair, FileFormat } from '../converters/types';

export type ConversionMode = 
  | 'heicToJpg' | 'jpgToHeic'
  | 'pngToJpg' | 'jpgToPng'
  | 'webpToJpg' | 'jpgToWebp'
  | 'avifToJpg' | 'jpgToAvif'
  
  | 'mp4ToWebm' | 'webmToMp4'
  | 'movToMp4' | 'mp4ToMov'
  | 'aviToMp4' | 'mp4ToAvi'
  | 'mkvToMp4' | 'mp4ToMkv';

export interface ConversionModeSettings {
  name: string;
  description: string;
  inputFormat: FileFormat;
  outputFormat: FileFormat;
  acceptedFileTypes: string[];
  outputMimeType: string;
  defaultQuality: number;
  icon?: string;
}

export const conversionModes: Record<ConversionMode, ConversionModeSettings> = {
  heicToJpg: {
    name: 'HEIC to JPG',
    description: 'Convert HEIC images to widely-compatible JPG format',
    inputFormat: 'heic',
    outputFormat: 'jpg',
    acceptedFileTypes: ['.heic'],
    outputMimeType: 'image/jpeg',
    defaultQuality: 90
  },
  jpgToHeic: {
    name: 'JPG to HEIC',
    description: 'Convert JPG images to compact HEIC format',
    inputFormat: 'jpg',
    outputFormat: 'heic',
    acceptedFileTypes: ['.jpg', '.jpeg'],
    outputMimeType: 'image/heic',
    defaultQuality: 80
  },
  pngToJpg: {
    name: 'PNG to JPG',
    description: 'Convert PNG images to JPG format',
    inputFormat: 'png',
    outputFormat: 'jpg',
    acceptedFileTypes: ['.png'],
    outputMimeType: 'image/jpeg',
    defaultQuality: 90
  },
  jpgToPng: {
    name: 'JPG to PNG',
    description: 'Convert JPG images to lossless PNG format',
    inputFormat: 'jpg',
    outputFormat: 'png',
    acceptedFileTypes: ['.jpg', '.jpeg'],
    outputMimeType: 'image/png',
    defaultQuality: 100
  },
  webpToJpg: {
    name: 'WebP to JPG',
    description: 'Convert WebP images to JPG format',
    inputFormat: 'webp',
    outputFormat: 'jpg',
    acceptedFileTypes: ['.webp'],
    outputMimeType: 'image/jpeg',
    defaultQuality: 90
  },
  jpgToWebp: {
    name: 'JPG to WebP',
    description: 'Convert JPG images to efficient WebP format',
    inputFormat: 'jpg',
    outputFormat: 'webp',
    acceptedFileTypes: ['.jpg', '.jpeg'],
    outputMimeType: 'image/webp',
    defaultQuality: 80
  },
  avifToJpg: {
    name: 'AVIF to JPG',
    description: 'Convert AVIF images to JPG format',
    inputFormat: 'avif',
    outputFormat: 'jpg',
    acceptedFileTypes: ['.avif'],
    outputMimeType: 'image/jpeg',
    defaultQuality: 90
  },
  jpgToAvif: {
    name: 'JPG to AVIF',
    description: 'Convert JPG images to efficient AVIF format',
    inputFormat: 'jpg',
    outputFormat: 'avif',
    acceptedFileTypes: ['.jpg', '.jpeg'],
    outputMimeType: 'image/avif',
    defaultQuality: 70
  },
  
  mp4ToWebm: {
    name: 'MP4 to WebM',
    description: 'Convert MP4 videos to WebM format for web',
    inputFormat: 'mp4',
    outputFormat: 'webm',
    acceptedFileTypes: ['.mp4'],
    outputMimeType: 'video/webm',
    defaultQuality: 80
  },
  webmToMp4: {
    name: 'WebM to MP4',
    description: 'Convert WebM videos to widely-compatible MP4 format',
    inputFormat: 'webm',
    outputFormat: 'mp4',
    acceptedFileTypes: ['.webm'],
    outputMimeType: 'video/mp4',
    defaultQuality: 80
  },
  movToMp4: {
    name: 'MOV to MP4',
    description: 'Convert QuickTime MOV videos to MP4 format',
    inputFormat: 'mov',
    outputFormat: 'mp4',
    acceptedFileTypes: ['.mov'],
    outputMimeType: 'video/mp4',
    defaultQuality: 80
  },
  mp4ToMov: {
    name: 'MP4 to MOV',
    description: 'Convert MP4 videos to QuickTime MOV format',
    inputFormat: 'mp4',
    outputFormat: 'mov',
    acceptedFileTypes: ['.mp4'],
    outputMimeType: 'video/quicktime',
    defaultQuality: 80
  },
  aviToMp4: {
    name: 'AVI to MP4',
    description: 'Convert AVI videos to MP4 format',
    inputFormat: 'avi',
    outputFormat: 'mp4',
    acceptedFileTypes: ['.avi'],
    outputMimeType: 'video/mp4',
    defaultQuality: 80
  },
  mp4ToAvi: {
    name: 'MP4 to AVI',
    description: 'Convert MP4 videos to AVI format',
    inputFormat: 'mp4',
    outputFormat: 'avi',
    acceptedFileTypes: ['.mp4'],
    outputMimeType: 'video/x-msvideo',
    defaultQuality: 80
  },
  mkvToMp4: {
    name: 'MKV to MP4',
    description: 'Convert MKV videos to MP4 format',
    inputFormat: 'mkv',
    outputFormat: 'mp4',
    acceptedFileTypes: ['.mkv'],
    outputMimeType: 'video/mp4',
    defaultQuality: 80
  },
  mp4ToMkv: {
    name: 'MP4 to MKV',
    description: 'Convert MP4 videos to MKV format',
    inputFormat: 'mp4',
    outputFormat: 'mkv',
    acceptedFileTypes: ['.mp4'],
    outputMimeType: 'video/x-matroska',
    defaultQuality: 80
  }
};

export function getConversionPair(mode: ConversionMode): ConversionPair {
  const settings = conversionModes[mode];
  return {
    inputFormat: settings.inputFormat,
    outputFormat: settings.outputFormat
  };
}

export function getConversionMode(inputFormat: FileFormat, outputFormat: FileFormat): ConversionMode | null {
  for (const [mode, settings] of Object.entries(conversionModes)) {
    if (settings.inputFormat === inputFormat && settings.outputFormat === outputFormat) {
      return mode as ConversionMode;
    }
  }
  return null;
}
