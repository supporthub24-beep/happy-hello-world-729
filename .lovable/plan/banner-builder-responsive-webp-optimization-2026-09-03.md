# Banner Builder responsive WebP optimization

## Changes
- Serve built-in Banner Builder images through responsive WebP `srcset` while retaining JPG fallbacks and uploaded-image support.
- Export generated banners as exact 1920×1080 WebP files independent of the mobile preview width.
- Keep the existing templates, controls, and visual design unchanged.

## Verification
- Run the focused type checker/test command available in the project.
- Verify in the mobile preview that responsive WebP assets load and downloaded output uses WebP at full resolution.
