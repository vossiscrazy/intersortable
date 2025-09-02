# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a Next.js 15.5.2 application using the App Router architecture with TypeScript and Tailwind CSS v4:

- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono from next/font/google
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to `./`)
- **Build Tool**: Turbopack (Next.js built-in bundler)

### Project Structure

- `app/` - Next.js App Router directory containing pages and layouts
  - `layout.tsx` - Root layout with font configuration and global CSS
  - `page.tsx` - Homepage component 
  - `globals.css` - Global Tailwind styles
- Configuration files use modern ES modules (`.mjs`, `.ts`)
- Path alias `@/*` configured to reference root directory

### Key Technologies

- **React 19.1.0** - Latest React version
- **Next.js 15.5.2** - App Router with Turbopack integration
- **TypeScript 5** - Strict type checking enabled
- **Tailwind CSS 4** - Latest major version with PostCSS integration
- **ESLint** - Next.js recommended configuration with TypeScript support

### Development Notes

- Turbopack is enabled for both dev and build commands for faster compilation
- ESLint configuration extends `next/core-web-vitals` and `next/typescript`
- No test framework is currently configured