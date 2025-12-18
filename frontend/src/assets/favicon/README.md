# Favicon Assets

This folder contains favicon files for the application.

## Favicon Files

Place your favicon files in this directory. Common favicon formats include:
- `favicon.ico` - Standard favicon (16x16, 32x32, 48x48)
- `favicon-16x16.png` - 16x16 PNG favicon
- `favicon-32x32.png` - 32x32 PNG favicon
- `apple-touch-icon.png` - Apple touch icon (180x180)
- `android-chrome-192x192.png` - Android Chrome icon (192x192)
- `android-chrome-512x512.png` - Android Chrome icon (512x512)

## Usage

To use the favicon in your HTML, add the following to your `index.html`:

```html
<link rel="icon" type="image/x-icon" href="/src/assets/favicon/favicon.ico" />
```

Or if using Vite, you can import it in your code:

```javascript
import favicon from '@/assets/favicon/favicon.ico';
```

For better browser support, you can also add multiple sizes:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/src/assets/favicon/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/src/assets/favicon/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/src/assets/favicon/apple-touch-icon.png" />
```
