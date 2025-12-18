# Favicon Assets

This folder contains favicon files for the application.

## Favicon Files

Place your favicon files in this directory. The `public` folder is the correct location for static assets in Vite that need to be referenced directly in HTML.

## Current Favicon

- `cyberaran-favicon.png` - Main favicon file

## Usage

The favicon is referenced in `index.html` as:
```html
<link rel="icon" type="image/png" href="/favicon/cyberaran-favicon.png" />
```

Files in the `public` folder are served from the root path (`/`), so `/favicon/cyberaran-favicon.png` will work correctly.

## Additional Favicon Formats (Optional)

For better browser support, you can add:
- `favicon.ico` - Standard favicon (16x16, 32x32, 48x48)
- `favicon-16x16.png` - 16x16 PNG favicon
- `favicon-32x32.png` - 32x32 PNG favicon
- `apple-touch-icon.png` - Apple touch icon (180x180)
- `android-chrome-192x192.png` - Android Chrome icon (192x192)
- `android-chrome-512x512.png` - Android Chrome icon (512x512)

Then reference them in `index.html`:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
```
