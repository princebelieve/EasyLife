# Google Merchant Center Setup Guide

## What Changed

✅ Fixed JSON-LD product schema with all required fields:

- Multiple image URLs (cover + gallery)
- Proper SKU field (unique identifier)
- Correct availability format
- Full description instead of missing field
- Seller organization info

✅ Created dedicated product feed at: `/api/products-feed.csv`

## Steps to Get Products Approved in Merchant Center

### Step 1: Update Your Sitemap (Already Done ✓)

Your sitemap at `/sitemap.xml` lists all product URLs with lastmod timestamps.

### Step 2: Submit Product Feed to Google Merchant Center

**Option A: Using the CSV Feed (Recommended)**

1. Go to [Google Merchant Center](https://merchantcenter.google.com)
2. Sign in and select your Newbrend store
3. Go to **Products** → **Feeds**
4. Click **Create Feed** or **Upload Product Data**
5. Select **Upload a file**
6. Choose "Schedule" or one-time upload
7. For URL: `https://newbrend.vercel.app/api/products-feed.csv`
8. Set schedule to daily automatic refresh
9. Click **Create**

**Option B: Manual CSV Upload**

- Download from: `https://newbrend.vercel.app/api/products-feed.csv`
- Upload directly to Merchant Center

### Step 3: Verify Products Show Up

1. After uploading, go to **Products** → **All Products**
2. Wait 5-30 minutes for indexing
3. You should see all your products listed
4. Check for any error messages about missing required fields
5. Fix any warnings

### Step 4: Verify Schema on Product Pages

1. Go to any product page, e.g.: `/product/[product-id]`
2. Right-click → **View Page Source**
3. Search for `"@type": "Product"`
4. You should see the complete JSON-LD schema with:
   - name
   - description
   - image array
   - price
   - availability
   - sku
   - brand
   - seller

### Step 5: Submit Sitemap to Search Console (Optional but Recommended)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (newbrend.vercel.app)
3. Go to **Sitemaps**
4. Add new sitemap: `https://newbrend.vercel.app/sitemap.xml`
5. Google will crawl and index your products

### Step 6: Resubmit for Review

1. In Merchant Center, if you previously submitted and got denied:
2. Go to **Settings** → **Review issues**
3. Fix any issues listed
4. Click **Resubmit for review**

## Troubleshooting

### Problem: "No Products Found"

- ✅ **Solution**: Now that we've fixed the schema, upload the CSV feed from `/api/products-feed.csv`

### Problem: "Products Rejected - Missing Fields"

- Check that `fullDescription` is filled for each product
- Ensure all products have `sku` values (should be auto-generated)
- Verify prices are > 0

### Problem: "Availability Issues"

- Make sure `inStock` and `stock` fields are properly set
- Current schema marks as "in stock" only if `inStock === true AND stock > 0`

### Problem: Images Not Loading

- Ensure images are hosted on a public CDN (not blocked by robots.txt)
- URLs should start with `https://`
- Merchant Center requires images to be PNG, JPEG, or GIF

## Files Updated

1. **`/client/src/utils/metaTags.js`** - Enhanced product schema
2. **`/client/src/pages/ProductDetails.jsx`** - Fixed description field mapping
3. **`/client/api/products-feed.csv`** - New CSV feed endpoint

## Testing Before Submission

### Test 1: Check Sitemap

```
curl https://newbrend.vercel.app/sitemap.xml
```

Should show all product URLs with proper format.

### Test 2: Check Product Feed

```
curl https://newbrend.vercel.app/api/products-feed.csv
```

Should return CSV with all products and their details.

### Test 3: Check JSON-LD Schema

1. Visit any product page
2. Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
3. Paste the URL
4. Should show "Product" structured data with all fields ✓

### Test 4: Check Robots.txt

```
curl https://newbrend.vercel.app/robots.txt
```

Make sure it allows Googlebot to crawl `/product/` pages.

## Next Steps

1. ✅ **Immediate**: Upload CSV feed to Merchant Center
2. ✅ **Monitor**: Check Merchant Center for any warnings
3. ✅ **Optimize**: Add product ratings if available
4. ✅ **Maintain**: Feed updates automatically daily

## Performance Impact

- Minimal - feeds are generated server-side and cached
- CSV feed updates once daily (configurable)
- JSON-LD schema is client-side and already optimized

## Google Merchant Center Requirements Met

✅ Product ID (using SKU or MongoDB ID)  
✅ Title (product name)  
✅ Description (fullDescription or shortDescription)  
✅ Link (product page URL)  
✅ Image Link (cover image)  
✅ Price (in NGN)  
✅ Currency (NGN)  
✅ Availability (in stock / out of stock)  
✅ Brand (Newbrend Furniture)
