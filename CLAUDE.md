# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimalist Chinese static blog website built with pure HTML, CSS, and JavaScript. The site features a clean, responsive design with dark/light theme support and search functionality.

## Architecture

### File Structure
- `index.html` - Main blog homepage with post listings
- `post.html` - Individual blog post template
- `categories.html` - Category listing page
- `tags.html` - Tag cloud and tag-based filtering
- `about.html` - About page with author information
- `style.css` - Complete CSS styling with CSS variables for theming
- `script.js` - JavaScript for theme switching, search, and interactive features

### Key Components

**Theme System**: Uses CSS custom properties with `[data-theme="dark"]` attribute switching. The `ThemeManager` class handles theme persistence via localStorage.

**Search Functionality**: Includes both desktop inline search and mobile modal search with:
- Real-time search across post titles and tags
- Search history management (localStorage)
- Search result highlighting
- Modal overlay for mobile devices

**Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px. Uses CSS Grid and Flexbox for layouts.

## Development Commands

This is a static website with no build process. Development can be done by:

1. **Local Development**: Open HTML files directly in browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using VS Code Live Server extension
   ```

2. **Testing**: Manual testing across different devices and browsers
3. **Deployment**: Copy files to any static hosting service

## Code Conventions

- **CSS**: Uses CSS custom properties for theming, BEM-like naming conventions
- **JavaScript**: ES6+ syntax, class-based architecture for the ThemeManager
- **HTML**: Semantic HTML5 elements, consistent class naming
- **Responsive**: Mobile-first design with progressive enhancement

## Key Features to Maintain

1. **Theme Switching**: Preserve the light/dark theme toggle functionality
2. **Search System**: Maintain both desktop and mobile search experiences
3. **Responsive Layout**: Ensure all pages work across device sizes
4. **Performance**: Keep the site lightweight (no external dependencies)
5. **Chinese Language Support**: Maintain proper Chinese typography and layout

## Styling Notes

- Uses system font stack for Chinese text rendering
- CSS variables enable easy theme customization
- Sticky header with smooth transitions
- Custom back-to-top button with scroll-based visibility
- Tag-based search and filtering system

When making changes, ensure the minimalist aesthetic and Chinese language support are preserved.