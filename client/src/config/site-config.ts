/**
 * Site Configuration
 * This file contains site-specific settings that change based on which
 * domain/brand is being displayed.
 */

import { ConversionMode } from './conversion-config';

export interface SiteConfig {
  siteName: string;
  defaultConversionMode: ConversionMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoText: string;
  domain: string;
  description?: string;
  keywords?: string[];
  showAdvancedOptions?: boolean;
}

const heicFlipConfig: SiteConfig = {
  siteName: 'HEICFlip',
  defaultConversionMode: 'heicToJpg',
  primaryColor: '#DD7230',    // Pantone 16-1255 Amberglow 
  secondaryColor: '#B85A25',  // Darker shade
  accentColor: '#F39C6B',     // Lighter accent
  logoText: 'HEICFlip',
  domain: 'heicflip.com',
  description: 'Convert HEIC images to JPG format in your browser',
  keywords: ['HEIC', 'JPG', 'image conversion', 'browser-based'],
  showAdvancedOptions: false
};

const jpgFlipConfig: SiteConfig = {
  siteName: 'JPGFlip',
  defaultConversionMode: 'jpgToHeic',
  primaryColor: '#10b981',
  secondaryColor: '#059669',
  accentColor: '#34d399',
  logoText: 'JPGFlip',
  domain: 'jpgflip.com',
  description: 'Convert JPG images to HEIC format in your browser',
  keywords: ['JPG', 'HEIC', 'image conversion', 'browser-based'],
  showAdvancedOptions: false
};

const aviFlipConfig: SiteConfig = {
  siteName: 'AVIFlip',
  defaultConversionMode: 'aviToMp4',
  primaryColor: '#3b82f6',    // Blue
  secondaryColor: '#2563eb',  // Darker blue
  accentColor: '#60a5fa',     // Lighter blue
  logoText: 'AVIFlip',
  domain: 'aviflip.com',
  description: 'Convert AVI videos to MP4 format in your browser',
  keywords: ['AVI', 'MP4', 'video conversion', 'browser-based'],
  showAdvancedOptions: true
};

export function getSiteConfig(): SiteConfig {
  const urlParams = new URLSearchParams(window.location.search);
  const forceSite = urlParams.get('site')?.toLowerCase();
  
  if (forceSite === 'jpgflip') {
    console.log('USING JPGFLIP CONFIG: URL site parameter override');
    return jpgFlipConfig;
  }
  
  if (forceSite === 'aviflip') {
    console.log('USING AVIFLIP CONFIG: URL site parameter override');
    return aviFlipConfig;
  }
  
  if (forceSite === 'heicflip') {
    console.log('USING HEICFLIP CONFIG: URL site parameter override');
    return heicFlipConfig;
  }
  
  if (urlParams.has('jpgflip')) {
    console.log('USING JPGFLIP CONFIG: Direct URL parameter override');
    return jpgFlipConfig;
  }
  
  if (urlParams.has('aviflip')) {
    console.log('USING AVIFLIP CONFIG: Direct URL parameter override');
    return aviFlipConfig;
  }
  
  if (urlParams.has('heicflip')) {
    console.log('USING HEICFLIP CONFIG: Direct URL parameter override');
    return heicFlipConfig;
  }
  
  const mode = urlParams.get('mode')?.toLowerCase();
  if (mode === 'jpgflip') {
    console.log('USING JPGFLIP CONFIG: URL mode parameter override');
    return jpgFlipConfig;
  }
  
  if (mode === 'aviflip') {
    console.log('USING AVIFLIP CONFIG: URL mode parameter override');
    return aviFlipConfig;
  }
  
  if (mode === 'heicflip') {
    console.log('USING HEICFLIP CONFIG: URL mode parameter override');
    return heicFlipConfig;
  }
  
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname === 'jpgflip.com' || hostname === 'www.jpgflip.com') {
    console.log('USING JPGFLIP CONFIG: Hostname match');
    return jpgFlipConfig;
  }
  
  if (hostname === 'aviflip.com' || hostname === 'www.aviflip.com') {
    console.log('USING AVIFLIP CONFIG: Hostname match');
    return aviFlipConfig;
  }
  
  if (hostname === 'heicflip.com' || hostname === 'www.heicflip.com') {
    console.log('USING HEICFLIP CONFIG: Hostname match');
    return heicFlipConfig;
  }
  
  console.log('USING HEICFLIP CONFIG: Default fallback for testing');
  return heicFlipConfig;
}

export const siteConfig = getSiteConfig();
