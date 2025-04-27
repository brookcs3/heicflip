/**
 * Base FFmpeg Converter
 * This class provides a foundation for all FFmpeg-based converters.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { 
  Converter, 
  ConversionOptions, 
  ConversionResult, 
  ProgressUpdate,
  FileFormat
} from './types';
import JSZip from 'jszip';

export abstract class BaseFFmpegConverter implements Converter {
  protected ffmpeg: FFmpeg;
  protected loaded: boolean = false;
  
  abstract supportedInputFormats: FileFormat[];
  abstract supportedOutputFormats: FileFormat[];
  
  constructor() {
    this.ffmpeg = new FFmpeg();
  }
  
  /**
   * Initialize FFmpeg if not already loaded
   */
  protected async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.ffmpeg.load();
      this.loaded = true;
    }
  }
  
  /**
   * Check if this converter supports a specific conversion
   */
  canConvert(from: FileFormat, to: FileFormat): boolean {
    return (
      this.supportedInputFormats.includes(from) && 
      this.supportedOutputFormats.includes(to)
    );
  }
  
  /**
   * Convert a single file using FFmpeg
   */
  async convert(
    file: File, 
    outputFormat: FileFormat, 
    options?: ConversionOptions,
    onProgress?: (update: ProgressUpdate) => void
  ): Promise<ConversionResult> {
    try {
      await this.ensureLoaded();
      
      const startTime = performance.now();
      
      if (onProgress) {
        onProgress({ progress: 0 });
      }
      
      const inputFileName = `input_${Date.now()}.${file.name.split('.').pop()}`;
      const outputFileName = `output_${Date.now()}.${outputFormat}`;
      
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(file));
      
      this.ffmpeg.on('progress', (progress) => {
        if (onProgress) {
          onProgress({ 
            progress: Math.round(progress.progress * 100),
            stage: 'processing'
          });
        }
      });
      
      const ffmpegCommand = this.buildFFmpegCommand(
        inputFileName,
        outputFileName,
        outputFormat,
        options
      );
      
      await this.ffmpeg.exec(ffmpegCommand);
      
      const outputData = await this.ffmpeg.readFile(outputFileName);
      
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);
      
      const endTime = performance.now();
      const conversionTime = endTime - startTime;
      const originalSize = file.size;
      const convertedSize = outputData.byteLength;
      const compressionRatio = originalSize / convertedSize;
      
      const mimeType = this.getMimeType(outputFormat);
      const resultBlob = new Blob([outputData], { type: mimeType });
      
      if (onProgress) {
        onProgress({ progress: 100 });
      }
      
      return {
        success: true,
        data: resultBlob,
        metadata: {
          originalSize,
          convertedSize,
          conversionTime,
          compressionRatio
        }
      };
    } catch (error) {
      console.error('Conversion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown conversion error'
      };
    }
  }
  
  /**
   * Convert multiple files (with optional ZIP packaging)
   */
  async convertBatch(
    files: File[], 
    outputFormat: FileFormat, 
    options?: ConversionOptions,
    onProgress?: (update: ProgressUpdate) => void
  ): Promise<ConversionResult> {
    try {
      if (files.length === 1) {
        return this.convert(files[0], outputFormat, options, onProgress);
      }
      
      const startTime = performance.now();
      
      const zip = new JSZip();
      const totalFiles = files.length;
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        
        if (onProgress) {
          onProgress({ 
            progress: Math.round((i / totalFiles) * 100),
            file: i + 1,
            totalFiles,
            stage: 'processing'
          });
        }
        
        const result = await this.convert(
          file, 
          outputFormat, 
          options,
          (update) => {
            if (onProgress) {
              onProgress({
                progress: Math.round((i + update.progress / 100) / totalFiles * 100),
                file: i + 1,
                totalFiles,
                stage: update.stage
              });
            }
          }
        );
        
        if (!result.success || !result.data) {
          throw new Error(`Failed to convert file ${file.name}`);
        }
        
        const outputName = file.name.replace(
          /\.[^.]+$/, 
          `.${outputFormat}`
        );
        
        zip.file(outputName, result.data);
      }
      
      if (onProgress) {
        onProgress({ 
          progress: 90,
          stage: 'creating zip'
        });
      }
      
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      });
      
      const endTime = performance.now();
      const conversionTime = endTime - startTime;
      const originalSize = files.reduce((total, file) => total + file.size, 0);
      const convertedSize = zipBlob.size;
      
      if (onProgress) {
        onProgress({ progress: 100 });
      }
      
      return {
        success: true,
        data: zipBlob,
        metadata: {
          originalSize,
          convertedSize,
          conversionTime,
          compressionRatio: originalSize / convertedSize
        }
      };
    } catch (error) {
      console.error('Batch conversion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown batch conversion error'
      };
    }
  }
  
  /**
   * Build FFmpeg command based on options
   * This should be overridden by subclasses for format-specific options
   */
  protected buildFFmpegCommand(
    inputFileName: string,
    outputFileName: string,
    outputFormat: FileFormat,
    options?: ConversionOptions
  ): string[] {
    const command = ['-i', inputFileName];
    
    if (options?.quality !== undefined) {
      command.push('-q:v', options.quality.toString());
    }
    
    if (options?.resize) {
      const { width, height, maintainAspectRatio } = options.resize;
      
      if (width && height) {
        if (maintainAspectRatio) {
          command.push('-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease`);
        } else {
          command.push('-vf', `scale=${width}:${height}`);
        }
      } else if (width) {
        command.push('-vf', `scale=${width}:-1`);
      } else if (height) {
        command.push('-vf', `scale=-1:${height}`);
      }
    }
    
    command.push(outputFileName);
    
    return command;
  }
  
  /**
   * Get MIME type for a file format
   */
  protected getMimeType(format: FileFormat): string {
    const mimeTypes: Record<FileFormat, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      heic: 'image/heic',
      avif: 'image/avif',
      webp: 'image/webp',
      
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      mkv: 'video/x-matroska',
      
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      psd: 'image/vnd.adobe.photoshop'
    };
    
    return mimeTypes[format] || 'application/octet-stream';
  }
}
