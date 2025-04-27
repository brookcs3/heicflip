# HEICFlip

A browser-based image converter that transforms photos between HEIC and JPG formats with complete privacy. All processing happens locally in your browser—no uploads required.

## Features

- **Local Processing**: All conversion happens in your browser. Your images never leave your device.
- **Batch Conversion**: Convert multiple files at once with drag-and-drop simplicity.
- **Bidirectional Conversion**: 
  - Convert HEIC to JPG (default mode)
  - Convert JPG to HEIC (alternative mode)
- **No Installation Required**: Works directly in your browser, no software to install.
- **Privacy-First Design**: No tracking, no cookies, no data collection.

## Technology

HEICFlip is built with modern web technologies:

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn UI
- **Image Processing**: FFMPEG.wasm
- **File Handling**: React Dropzone

## Development

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Project Structure

The project uses a simplified structure with all core files in the `client` directory:

- `client/src/components`: UI components
- `client/src/hooks`: Custom React hooks
- `client/src/lib`: Utility functions and configuration
- `client/src/pages`: Page components
- `client/src/workers`: Web workers for image processing

## Deployment

HEICFlip is deployed to both Vercel and Cloudflare Pages:

- Main site: [heicflip.com](https://heicflip.com)
- GitHub repository: [brookcs3/heicflip](https://github.com/brookcs3/heicflip)

## License

MIT License