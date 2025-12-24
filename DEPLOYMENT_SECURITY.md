# 🔒 SECURE DEPLOYMENT GUIDE
## Enterprise-Grade Security & Compliance Standards

> **Last Updated**: December 24, 2025  
> **Security Level**: Enterprise Grade  
> **Compliance Standards**: GDPR, SOC 2, CCPA Ready

---

## 📋 Table of Contents
1. [Security Overview](#security-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Deployment Instructions](#deployment-instructions)
5. [Security Best Practices](#security-best-practices)
6. [Monitoring & Auditing](#monitoring--auditing)
7. [Incident Response](#incident-response)

---

## 🛡️ Security Overview

This application implements enterprise-grade security measures:

- ✅ **No Hardcoded Secrets**: All sensitive data in environment variables
- ✅ **Input Sanitization**: XSS protection on all user inputs
- ✅ **Rate Limiting**: Client-side request throttling
- ✅ **Secure Logging**: Error logs sanitize sensitive data
- ✅ **CSP Headers**: Content Security Policy configured
- ✅ **HTTPS Only**: Enforced in production
- ✅ **Environment Validation**: Runtime checks for required variables

---

## ✅ Pre-Deployment Checklist

### 1. Security Audit
- [ ] All API keys moved to environment variables
- [ ] No credentials in source code
- [ ] `.env` file added to `.gitignore`
- [ ] `.env.example` contains NO real credentials
- [ ] All dependencies updated to latest secure versions
- [ ] Security utilities implemented and tested

### 2. API Key Security
- [ ] YouTube API key restricted to production domain
- [ ] WalletConnect Project ID configured
- [ ] Rate limits configured in Google Cloud Console
- [ ] Quota alerts set up

### 3. Code Review
- [ ] No console.log with sensitive data in production
- [ ] Error messages don't expose system information
- [ ] All external URLs validated
- [ ] Input sanitization implemented

### 4. Compliance
- [ ] Privacy Policy added
- [ ] Terms of Service created
- [ ] Cookie consent implemented (if applicable)
- [ ] Data retention policy documented

---

## 🔐 Environment Variables Setup

### Required Variables

Create a `.env` file in your project root with these variables:

```env
# ⚠️ CRITICAL: Never commit this file to version control

# YouTube API Configuration
# Get from: https://console.cloud.google.com/apis/credentials
VITE_YOUTUBE_API_KEY=AIzaSy...your_actual_key_here

# YouTube Channel ID
# Get from: https://studio.youtube.com/channel/advanced
VITE_YOUTUBE_CHANNEL_ID=UCx...your_channel_id_here

# WalletConnect Project ID
# Get from: https://cloud.walletconnect.com/
VITE_WALLETCONNECT_PROJECT_ID=8e281161f038ae9e0afa0dc1569bfdf4

# Application URL (must match your deployment domain)
VITE_APP_URL=https://yourdomain.com
```

### Environment Variable Security Rules

1. **Naming Convention**: All Vite env vars must start with `VITE_`
2. **No Defaults in Production**: Remove fallback values before deployment
3. **Rotation Policy**: Rotate API keys every 90 days
4. **Access Control**: Limit who can view production environment variables

---

## 🚀 Deployment Instructions

### Option 1: Vercel (Recommended)

Vercel provides enterprise-grade infrastructure with automatic HTTPS, CDN, and edge functions.

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Configure Environment Variables
```bash
# Add environment variables through Vercel dashboard or CLI
vercel env add VITE_YOUTUBE_API_KEY
vercel env add VITE_YOUTUBE_CHANNEL_ID
vercel env add VITE_WALLETCONNECT_PROJECT_ID
vercel env add VITE_APP_URL
```

#### Step 4: Deploy
```bash
# Production deployment
vercel --prod

# Preview deployment (for testing)
vercel
```

#### Step 5: Configure Security Headers

Create `vercel.json` in project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://i.ytimg.com; font-src 'self' data:; connect-src 'self' https://www.googleapis.com https://www.youtube.com; frame-src https://www.youtube.com; media-src 'self' https://www.youtube.com;"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login and Deploy
```bash
netlify login
netlify init
netlify deploy --prod
```

#### Step 3: Set Environment Variables
```bash
netlify env:set VITE_YOUTUBE_API_KEY "your_key_here"
netlify env:set VITE_YOUTUBE_CHANNEL_ID "your_channel_id"
netlify env:set VITE_WALLETCONNECT_PROJECT_ID "your_project_id"
netlify env:set VITE_APP_URL "https://yourdomain.com"
```

### Option 3: Custom Server (Advanced)

#### Prerequisites
- Node.js 18+ installed
- Nginx or Apache configured
- SSL certificate (Let's Encrypt recommended)
- Firewall configured

#### Build and Deploy
```bash
# Build production bundle
npm run build

# Copy dist folder to server
scp -r dist/ user@yourserver:/var/www/yourapp/

# Configure Nginx (example)
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /var/www/yourapp/dist;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔒 Security Best Practices

### 1. API Key Protection

#### Google Cloud Console Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"
4. Click on your API key
5. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add your production domain: `https://yourdomain.com/*`
   - Add localhost for development: `http://localhost:5173/*`
6. Under "API restrictions":
   - Select "Restrict key"
   - Check only "YouTube Data API v3"
7. Click "Save"

#### WalletConnect Security
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Select your project
3. Under "Allowed Origins":
   - Add your production domain
   - Add staging domain if applicable
4. Enable "Require Origin Check"

### 2. Rate Limiting

The app implements client-side rate limiting. For production, add server-side limits:

```javascript
// Example: Cloudflare Rate Limiting
// Set in Cloudflare Dashboard:
// - 100 requests per 10 minutes per IP
// - Block for 1 hour after threshold
```

### 3. Content Security Policy (CSP)

Already configured in [src/helper/security.js](src/helper/security.js). Apply headers via:
- Vercel: Use `vercel.json`
- Netlify: Use `netlify.toml`
- Custom: Configure in web server

### 4. HTTPS Enforcement

```javascript
// Add to your app entry point for custom deployments
if (import.meta.env.PROD && window.location.protocol !== 'https:') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

### 5. Dependency Security

```bash
# Audit dependencies regularly
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update all dependencies
npm update

# Use Snyk for continuous monitoring
npm install -g snyk
snyk test
snyk monitor
```

---

## 📊 Monitoring & Auditing

### 1. Error Monitoring

Integrate with error tracking services:

**Option A: Sentry**
```bash
npm install @sentry/react @sentry/vite-plugin
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

**Option B: LogRocket**
```bash
npm install logrocket
```

### 2. Performance Monitoring

Use Vercel Analytics or Google Analytics 4:

```bash
npm install @vercel/analytics
```

```javascript
// src/main.jsx
import { Analytics } from '@vercel/analytics/react';

// Add to your app
<Analytics />
```

### 3. Security Monitoring

Set up alerts for:
- Failed authentication attempts
- Unusual API usage patterns
- Error rate spikes
- Quota exceeded errors

### 4. Audit Logging

The app logs security events. In production, send to monitoring service:

```javascript
// Update src/helper/security.js logError function
export const logError = (error, context = {}) => {
  // ... existing code ...
  
  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        context: sanitizedContext,
      })
    });
  }
};
```

---

## 🚨 Incident Response

### If API Key is Compromised

1. **Immediate Action**:
   ```bash
   # Revoke the compromised key immediately
   # Go to Google Cloud Console → Credentials → Delete Key
   ```

2. **Generate New Key**:
   - Create new API key in Google Cloud Console
   - Add restrictions immediately
   - Update environment variables in deployment platform

3. **Audit**:
   - Check API usage logs for unauthorized access
   - Review recent commits for exposed credentials
   - Scan repository history: `git log -p | grep -i "api.*key"`

4. **Update**:
   ```bash
   # Update environment variable
   vercel env add VITE_YOUTUBE_API_KEY production
   
   # Redeploy
   vercel --prod
   ```

### If Data Breach Suspected

1. **Contain**: Immediately disable affected services
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users within 72 hours (GDPR requirement)
4. **Remediate**: Fix vulnerability and strengthen security
5. **Document**: Create incident report for compliance

### Security Contact

Create `SECURITY.md` in repository:

```markdown
# Security Policy

## Reporting a Vulnerability

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, email: security@yourdomain.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.
```

---

## 📚 Additional Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [YouTube API Best Practices](https://developers.google.com/youtube/v3/guides/best_practices)
- [Vercel Security](https://vercel.com/docs/security)
- [GDPR Compliance Guide](https://gdpr.eu/compliance/)

### Security Tools
- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [SonarQube](https://www.sonarqube.org/) - Code quality & security
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Mozilla Observatory](https://observatory.mozilla.org/) - Site security analysis

### Compliance Resources
- [GDPR Checklist](https://gdpr.eu/checklist/)
- [CCPA Compliance](https://oag.ca.gov/privacy/ccpa)
- [SOC 2 Requirements](https://www.aicpa.org/soc2)

---

## 📞 Support

For deployment issues or security concerns:
- Check documentation in `/docs` folder
- Review [YOUTUBE_SETUP_GUIDE.md](YOUTUBE_SETUP_GUIDE.md)
- Consult security utilities in [src/helper/security.js](src/helper/security.js)

---

## ✅ Deployment Verification

After deployment, verify security:

1. **SSL Certificate**: https://www.ssllabs.com/ssltest/
2. **Security Headers**: https://securityheaders.com/
3. **CSP Validator**: https://csp-evaluator.withgoogle.com/
4. **Site Performance**: https://pagespeed.web.dev/

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update security measures.
