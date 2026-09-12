# 🖼️ Next.js Image Configuration Guide

## Issue Fixed
**Error:** `Invalid src prop on next/image, hostname "via.placeholder.com" is not configured`

## What Was Changed

### 1. ✅ Added Hostname to Next.js Config
**File:** `frontend/next.config.ts`

Added `via.placeholder.com` to the allowed image hostnames:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'via.placeholder.com' }, // ✅ Added
    // ... other hostnames
  ],
}
```

### 2. ✅ Improved ProductCard Error Handling
**File:** `frontend/src/components/product/ProductCard.tsx`

- Added `imgError` state for fallback handling
- Changed default placeholder from `/placeholder-product.jpg` to `/images/plant-placeholder.svg`
- Added `onError` handler to switch to placeholder on image load failure

```typescript
const [imgError, setImgError] = useState(false);

<Image
  src={imgError ? '/images/plant-placeholder.svg' : (product.thumbnail || '/images/plant-placeholder.svg')}
  onError={() => setImgError(true)}
  // ... other props
/>
```

## How Next.js Image Works

Next.js requires you to configure external image domains for security reasons. This prevents:
- Unauthorized image sources
- Potential XSS attacks
- Bandwidth abuse

### Currently Configured Domains:
- ✅ `res.cloudinary.com` - Your primary image CDN
- ✅ `via.placeholder.com` - Placeholder images
- ✅ `images.unsplash.com` - Stock photos
- ✅ `picsum.photos` - Random placeholder images
- ✅ `i.pravatar.cc` - Avatar placeholders
- And more...

## Adding New Image Domains

If you need to add more external image sources:

**Edit:** `frontend/next.config.ts`

```typescript
images: {
  remotePatterns: [
    // ... existing patterns
    { protocol: 'https', hostname: 'your-new-domain.com' },
  ],
}
```

**Then restart the dev server:**
```bash
cd frontend
npm run dev
```

## Image Best Practices

### 1. **Always Provide Fallback**
```tsx
<Image 
  src={product.thumbnail || '/images/plant-placeholder.svg'}
  alt={product.name}
/>
```

### 2. **Add Error Handling**
```tsx
const [imgError, setImgError] = useState(false);

<Image
  src={imgError ? '/fallback.jpg' : product.image}
  onError={() => setImgError(true)}
/>
```

### 3. **Use Proper Sizes Prop**
```tsx
<Image
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  // This helps Next.js optimize image loading
/>
```

### 4. **Use Local Images for Placeholders**
Store placeholders in `/public` folder:
- `/public/images/plant-placeholder.svg` ✅
- `/public/images/product-fallback.jpg` ✅

### 5. **Optimize for Different Screens**
```typescript
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
```

## Testing Image Configuration

### Test 1: Valid External URL
```tsx
<Image src="https://via.placeholder.com/400" alt="Test" />
```
✅ Should work now

### Test 2: Invalid URL
```tsx
<Image 
  src="https://broken-url.com/image.jpg" 
  onError={() => console.log('Image failed')}
/>
```
✅ Should fallback to placeholder

### Test 3: Local Placeholder
```tsx
<Image src="/images/plant-placeholder.svg" alt="Fallback" />
```
✅ Always works (local file)

## Common Errors & Solutions

### Error: "Hostname not configured"
**Solution:** Add hostname to `next.config.ts` remotePatterns

### Error: "Failed to load image"
**Solution:** 
1. Check URL is correct
2. Add `onError` handler with fallback
3. Ensure placeholder exists in `/public`

### Error: "Image optimization error"
**Solution:**
1. Check image format (JPEG, PNG, WebP, AVIF supported)
2. Check file size (default max: 10MB)
3. Check if external server allows hotlinking

## Production Considerations

### 1. Use CDN for Images
Store product images on Cloudinary (already configured):
```
https://res.cloudinary.com/your-cloud/image/upload/products/image.jpg
```

### 2. Enable Image Formats
Already configured in `next.config.ts`:
```typescript
formats: ['image/avif', 'image/webp']
```

### 3. Set Cache TTL
```typescript
minimumCacheTTL: 60, // seconds
```

### 4. Monitor Image Performance
- Use Next.js Image Analytics
- Check Lighthouse scores
- Monitor Core Web Vitals (LCP)

## After Changes

**Restart the development server:**
```bash
cd frontend
npm run dev
```

The error should now be resolved! ✅

## Related Files
- `frontend/next.config.ts` - Image configuration
- `frontend/src/components/product/ProductCard.tsx` - Product card with image
- `frontend/public/images/plant-placeholder.svg` - Fallback image

---

**Note:** Always restart the Next.js dev server after modifying `next.config.ts` for changes to take effect.
