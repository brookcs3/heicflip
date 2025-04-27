/**
 * Image Converter
 * Handles conversion between image formats using FFmpeg
 */

import { BaseFFmpegConverter } from '../base-ffmpeg-converter';
import { 
  ConversionOptions, 
  FileFormat,
  ImageFormat
} from '../types';

export class ImageConverter extends BaseFFmpegConverter {
  supportedInputFormats: ImageFormat[] = ['jpg', 'jpeg', 'png', 'heic', 'avif', 'webp'];
  supportedOutputFormats: ImageFormat[] = ['jpg', 'jpeg', 'png', 'heic', 'avif', 'webp'];
  
  /**
   * Override the FFmpeg command builder for image-specific options
   */
  protected buildFFmpegCommand(
    inputFileName: string,
    outputFileName: string,
    outputFormat: FileFormat,
    options?: ConversionOptions
  ): string[] {
    const command = ['-i', inputFileName];
    
    if (options?.quality !== undefined) {
      if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
        const ffmpegQuality = Math.round(31 - ((options.quality / 100) * 29));
        command.push('-q:v', ffmpegQuality.toString());
      }
      else if (outputFormat === 'png') {
        const pngCompression = Math.round((options.quality / 100) * 9);
        command.push('-compression_level', pngCompression.toString());
      }
      else if (outputFormat === 'webp') {
        command.push('-quality', options.quality.toString());
      }
      else if (outputFormat === 'avif') {
        const avifQuality = Math.round(63 - ((options.quality / 100) * 63));
        command.push('-crf', avifQuality.toString());
      }
      else if (outputFormat === 'heic') {
        const heicQuality = Math.round(51 - ((options.quality / 100) * 51));
        command.push('-crf', heicQuality.toString());
      }
    }
    
    if (options?.resize) {
      const { width, height, maintainAspectRatio } = options.resize;
      
      if (width && height) {
        if (maintainAspectRatio !== false) {
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
    
    if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
      command.push('-pix_fmt', 'yuvj420p');
    } else if (outputFormat === 'png') {
      command.push('-pix_fmt', 'rgba');
    } else if (outputFormat === 'webp') {
      command.push('-preset', 'photo');
      command.push('-lossless', '0');
    } else if (outputFormat === 'avif') {
      command.push('-pix_fmt', 'yuv420p');
      command.push('-c:v', 'libaom-av1');
    } else if (outputFormat === 'heic') {
      command.push('-pix_fmt', 'yuv420p');
      command.push('-c:v', 'libx265');
      command.push('-tag:v', 'hvc1');
    }
    
    command.push(outputFileName);
    
    return command;
  }
}
