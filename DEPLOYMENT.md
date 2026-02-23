# 🚀 Skillio Deployment Guide

## Coolify + Hetzner VPS Deployment

### 1. Prerequisites

- Hetzner VPS (2GB+ RAM recommended)
- Coolify installed and configured
- Custom domain (optional but recommended)

### 2. Coolify Setup

1. **Access Coolify Dashboard**
   ```
   https://your-coolify-domain.com
   ```

2. **Create New Application**
   - Click "New Application"
   - Choose "Public Repository"
   - Enter GitHub URL: `https://github.com/yourusername/skillio-platform.git`

3. **Configure Build Settings**
   ```
   Build Pack: Dockerfile
   Port: 8080
   Build Command: (leave empty)
   Start Command: python3 complete_platform.py
   ```

4. **Environment Variables** (Optional)
   ```
   PYTHON_ENV=production
   PORT=8080
   HOST=0.0.0.0
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Access via generated URL

### 3. Custom Domain Setup

1. **Add Domain in Coolify**
   - Go to Application Settings
   - Add custom domain: `skillio.yourdomain.com`

2. **DNS Configuration**
   ```
   A Record: skillio -> YOUR_VPS_IP
   ```

3. **SSL Certificate**
   - Coolify auto-generates Let's Encrypt SSL
   - Ensure port 80 & 443 are open on VPS

### 4. Database Persistence

The SQLite database is included in the container. For production:

1. **Volume Mount** (Recommended)
   ```yaml
   volumes:
     - ./data:/app/data
   ```

2. **Database Backup**
   ```bash
   # Create backup
   sqlite3 activities.db ".backup backup.db"
   
   # Restore backup
   sqlite3 new_activities.db ".restore backup.db"
   ```

### 5. Performance Optimization

1. **Server Resources**
   - Minimum: 1GB RAM, 1 CPU
   - Recommended: 2GB RAM, 2 CPU
   - Storage: 10GB+ SSD

2. **Coolify Settings**
   ```
   Memory Limit: 512MB
   CPU Limit: 1 CPU
   Restart Policy: unless-stopped
   ```

### 6. Monitoring & Health Checks

Coolify automatically monitors the application:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3
```

### 7. Deployment Commands

```bash
# View logs
docker logs skillio-web

# Restart application
docker restart skillio-web

# Update deployment
git push origin main  # Auto-deploys via webhook

# Shell access
docker exec -it skillio-web /bin/bash
```

### 8. SSL & Security

1. **Automatic HTTPS**
   - Coolify handles Let's Encrypt
   - Redirects HTTP → HTTPS

2. **Firewall** (Hetzner Console)
   ```
   Allow: 22 (SSH), 80 (HTTP), 443 (HTTPS)
   Block: All other ports
   ```

### 9. Backup Strategy

1. **Database Backup**
   ```bash
   # Daily backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   sqlite3 /app/activities.db ".backup /app/backups/skillio_$DATE.db"
   ```

2. **Code Backup**
   - GitHub serves as code backup
   - Coolify can redeploy from any commit

### 10. Troubleshooting

**Common Issues:**

1. **Port 8080 not accessible**
   - Check Coolify port mapping
   - Verify VPS firewall settings

2. **Database errors**
   - Check file permissions
   - Ensure SQLite file is writable

3. **Build fails**
   - Check Dockerfile syntax
   - Verify Python version compatibility

**Logs Access:**
```bash
# Application logs
docker logs -f skillio-web

# Coolify logs
journalctl -u coolify -f
```

### 11. Production Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Database backups scheduled
- [ ] Monitoring alerts set up
- [ ] Test accounts working
- [ ] Performance testing completed
- [ ] Security review done

### 12. Post-Deployment

1. **Test the platform**
   - Visit https://skillio.yourdomain.com
   - Test login with provided accounts
   - Submit test activity/teacher

2. **Analytics Setup** (Optional)
   - Add Google Analytics
   - Set up error monitoring

3. **Content Population**
   - Load real activity data
   - Verify all features working

---

**Support**: For deployment issues, check Coolify documentation or contact the development team.