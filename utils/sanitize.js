/**
 * A lightweight, highly efficient, and dependency-free HTML sanitizer for server-side
 * and client-side HTML rendering. Removes potentially harmful elements like scripts,
 * iframes, event handlers, and javascript: links to prevent XSS.
 *
 * @param {string} html The raw HTML string to sanitize
 * @returns {string} The sanitized HTML string
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  
  // 1. Remove script tags and their inner content
  let sanitized = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  
  // 2. Remove inline event handlers (e.g., onclick, onerror, onload)
  sanitized = sanitized.replace(/on\w+\s*=\s*(['"])(.*?)\1/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*([^>\s]+)/gi, '');
  
  // 3. Remove javascript: protocol links
  sanitized = sanitized.replace(/href\s*=\s*(['"])javascript:(.*?)\1/gi, 'href="#"');
  sanitized = sanitized.replace(/href\s*=\s*javascript:([^>\s]+)/gi, 'href="#"');
  
  // 4. Remove potentially dangerous/unwanted active tags (iframe, object, embed, form, input, button, textarea, style)
  sanitized = sanitized.replace(/<(iframe|object|embed|form|input|button|textarea|style)[^>]*>([\s\S]*?)<\/\1>/gi, '');
  sanitized = sanitized.replace(/<(iframe|object|embed|form|input|button|textarea|style)[^>]*\/>/gi, '');
  
  return sanitized;
}
