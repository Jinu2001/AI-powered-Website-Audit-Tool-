import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes a URL and extracts raw HTML metrics.
 * @param {string} urlString 
 * @returns {Promise<Object>}
 */
export async function scrapeUrl(urlString) {
  try {
    // Add protocol if missing
    let targetUrl = urlString;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const parsedUrl = new URL(targetUrl);
    const domain = parsedUrl.hostname;

    // Fetch HTML with a standard User-Agent to avoid blocker response
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // 1. Word count (clean text of body excluding scripts, styles, etc.)
    $('script, style, svg, noscript, iframe, nav, footer, header').remove();
    const bodyText = $('body').text() || '';
    const cleanText = bodyText.replace(/\s+/g, ' ').trim();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 2. Heading counts
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;

    // 3. CTA count (buttons + primary action links)
    // Primary action links include class names matching btn/button/cta or specific action-oriented texts.
    let ctaCount = 0;
    const ctaKeywords = /sign\s*up|get\s*started|book|contact|buy|register|download|subscribe|join|demo|try|start\s*free/i;
    
    $('button, input[type="button"], input[type="submit"]').each(() => {
      ctaCount++;
    });

    $('a').each((i, el) => {
      const text = $(el).text().trim();
      const className = $(el).attr('class') || '';
      const idName = $(el).attr('id') || '';
      
      const isCtaClass = /btn|button|cta|action/i.test(className) || /btn|button|cta|action/i.test(idName);
      const isCtaText = ctaKeywords.test(text);

      if (isCtaClass || isCtaText) {
        ctaCount++;
      }
    });

    // 4. Internal vs external link counts
    let internalLinks = 0;
    let externalLinks = 0;

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      // Ignore anchors, mails, phones, javascript
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      try {
        const linkUrl = new URL(href, targetUrl);
        if (linkUrl.hostname === domain) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch (err) {
        // Fallback for relative paths if URL creation fails
        if (href.startsWith('/') || href.startsWith('.')) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      }
    });

    // 5. Total image count + images missing alt text
    const images = $('img');
    const imagesTotal = images.length;
    let imagesMissingAlt = 0;

    images.each((i, el) => {
      const alt = $(el).attr('alt');
      // If alt is missing or is just whitespace/empty (unless decorative but standard marketing pages usually want real alt text)
      if (alt === undefined || alt === null || alt.trim() === '') {
        imagesMissingAlt++;
      }
    });

    const imagesMissingAltPct = imagesTotal > 0 
      ? Math.round((imagesMissingAlt / imagesTotal) * 100) + '%' 
      : '0%';

    // 6. Meta title and meta description
    const metaTitle = $('title').first().text() || $('meta[property="og:title"]').attr('content') || '';
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

    // 7. Content sample (first 800 characters of body text)
    const contentSample = cleanText.substring(0, 800);

    // 8. SPA detection flag (if word count < 50)
    const isSpa = wordCount < 50;

    return {
      wordCount,
      h1Count,
      h2Count,
      h3Count,
      ctaCount,
      internalLinks,
      externalLinks,
      imagesTotal,
      imagesMissingAlt,
      imagesMissingAltPct,
      metaTitle,
      metaDescription,
      contentSample,
      isSpa
    };

  } catch (error) {
    console.error('Error during scraping:', error.message);
    throw new Error(`Failed to scrape the URL: ${error.message}`);
  }
}
