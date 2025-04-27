/**
 * Video Converter
 * Handles conversion between video formats using FFmpeg
 */

import { BaseFFmpegConverter } from '../base-ffmpeg-converter';
import { 
  ConversionOptions, 
  FileFormat,
  VideoFormat
} from '../types';

export class VideoConverter extends BaseFFmpegConverter {
  supportedInputFormats: VideoFormat[] = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  supportedOutputFormats: VideoFormat[] = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  
  /**
   * Override the FFmpeg command builder for video-specific options
   */
  protected buildFFmpegCommand(
    inputFileName: string,
    outputFileName: string,
    outputFormat: FileFormat,
    options?: ConversionOptions
  ): string[] {
    const command = ['-i', inputFileName];
    
    if (options?.quality !== undefined) {
      if (outputFormat === 'mp4') {
        const crf = Math.round(35 - ((options.quality / 100) * 18));
        command.push('-c:v', 'libx264', '-crf', crf.toString());
      }
      else if (outputFormat === 'webm') {
        const crf = Math.round(45 - ((options.quality / 100) * 25));
        command.push('-c:v', 'libvpx-vp9', '-crf', crf.toString(), '-b:v', '0');
      }
      else if (outputFormat === 'mov') {
        const crf = Math.round(35 - ((options.quality / 100) * 18));
        command.push('-c:v', 'libx264', '-crf', crf.toString());
      }
      else if (outputFormat === 'avi') {
        const qscale = Math.round(31 - ((options.quality / 100) * 29));
        command.push('-c:v', 'mjpeg', '-q:v', qscale.toString());
      }
      else if (outputFormat === 'mkv') {
        const crf = Math.round(35 - ((options.quality / 100) * 18));
        command.push('-c:v', 'libx264', '-crf', crf.toString());
      }
    } else {
      if (outputFormat === 'mp4' || outputFormat === 'mov' || outputFormat === 'mkv') {
        command.push('-c:v', 'libx264', '-crf', '23'); // Medium quality
      } else if (outputFormat === 'webm') {
        command.push('-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0');
      } else if (outputFormat === 'avi') {
        command.push('-c:v', 'mjpeg', '-q:v', '10');
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
    
    command.push('-c:a', 'aac', '-b:a', '128k');
    
    if (outputFormat === 'mp4') {
      command.push('-movflags', '+faststart'); // Optimize for web streaming
      command.push('-pix_fmt', 'yuv420p'); // Ensure compatibility
    } else if (outputFormat === 'webm') {
      command.push('-deadline', 'good'); // Balance between speed and quality
      command.push('-cpu-used', '2');
    } else if (outputFormat === 'mov') {
      command.push('-movflags', '+faststart');
      command.push('-pix_fmt', 'yuv420p');
    } else if (outputFormat === 'mkv') {
    }
    
    command.push(outputFileName);
    
    return command;
  }
}
