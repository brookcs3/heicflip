/**
 * Converter Factory
 * Creates and manages converter instances based on file types
 */

import { Converter, FileFormat } from './types';
import { ImageConverter } from './image/image-converter';
import { VideoConverter } from './video/video-converter';

export class ConverterFactory {
  private static instance: ConverterFactory;
  private converters: Map<string, Converter> = new Map();
  
  private constructor() {
    this.registerConverter('image', new ImageConverter());
    this.registerConverter('video', new VideoConverter());
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): ConverterFactory {
    if (!ConverterFactory.instance) {
      ConverterFactory.instance = new ConverterFactory();
    }
    return ConverterFactory.instance;
  }
  
  /**
   * Register a new converter
   */
  public registerConverter(type: string, converter: Converter): void {
    this.converters.set(type, converter);
  }
  
  /**
   * Get a converter that can handle the specified conversion
   */
  public getConverter(inputFormat: FileFormat, outputFormat: FileFormat): Converter | null {
    for (const converter of this.converters.values()) {
      if (converter.canConvert(inputFormat, outputFormat)) {
        return converter;
      }
    }
    
    return null;
  }
  
  /**
   * Get all registered converters
   */
  public getAllConverters(): Map<string, Converter> {
    return this.converters;
  }
  
  /**
   * Check if a conversion is supported
   */
  public isConversionSupported(inputFormat: FileFormat, outputFormat: FileFormat): boolean {
    return this.getConverter(inputFormat, outputFormat) !== null;
  }
  
  /**
   * Get all supported input formats
   */
  public getSupportedInputFormats(): FileFormat[] {
    const formats = new Set<FileFormat>();
    
    for (const converter of this.converters.values()) {
      converter.supportedInputFormats.forEach(format => formats.add(format));
    }
    
    return Array.from(formats);
  }
  
  /**
   * Get all supported output formats for a given input format
   */
  public getSupportedOutputFormats(inputFormat: FileFormat): FileFormat[] {
    const formats = new Set<FileFormat>();
    
    for (const converter of this.converters.values()) {
      if (converter.supportedInputFormats.includes(inputFormat)) {
        converter.supportedOutputFormats.forEach(format => formats.add(format));
      }
    }
    
    return Array.from(formats);
  }
}

export const converterFactory = ConverterFactory.getInstance();
