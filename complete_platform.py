#!/usr/bin/env python3
"""
Complete Skillio Platform with all pages, rating system, and enhanced profiles.
"""

import sqlite3
import json
import hashlib
import uuid
import os
import time
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from http.cookies import SimpleCookie
from datetime import datetime

class RateLimiter:
    """Simple in-memory rate limiter."""
    def __init__(self):
        self.requests = {}  # {ip: [timestamp1, timestamp2, ...]}
        self.cleanup_interval = 300  # 5 minutes
        self.last_cleanup = time.time()
    
    def cleanup_old_requests(self):
        """Remove old request timestamps to prevent memory bloat."""
        now = time.time()
        if now - self.last_cleanup > self.cleanup_interval:
            cutoff = now - 3600  # Keep only last hour
            for ip in list(self.requests.keys()):
                self.requests[ip] = [ts for ts in self.requests[ip] if ts > cutoff]
                if not self.requests[ip]:
                    del self.requests[ip]
            self.last_cleanup = now
    
    def is_rate_limited(self, ip, max_requests=10, window_seconds=300):
        """Check if IP is rate limited."""
        self.cleanup_old_requests()
        
        now = time.time()
        window_start = now - window_seconds
        
        if ip not in self.requests:
            self.requests[ip] = []
        
        # Filter requests within the window
        recent_requests = [ts for ts in self.requests[ip] if ts > window_start]
        
        if len(recent_requests) >= max_requests:
            return True, max_requests - len(recent_requests)
        
        # Add current request
        self.requests[ip].append(now)
        if ip in self.requests:
            self.requests[ip] = recent_requests + [now]
        
        return False, max_requests - len(recent_requests) - 1

# Global rate limiter instance
rate_limiter = RateLimiter()

class SecurityValidator:
    """Security validation utilities."""
    
    @staticmethod
    def validate_email(email):
        """Validate email format."""
        if not email or len(email) > 254:
            return False
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def check_sql_injection(text):
        """Basic SQL injection pattern detection."""
        if not text:
            return False
        
        text_lower = text.lower()
        
        # Common SQL injection patterns
        sql_patterns = [
            r'\b(union|select|insert|update|delete|drop|create|alter)\b.*\b(from|into|table|database)\b',
            r'[\'\"]\s*(or|and)\s*[\'\"]\s*=\s*[\'\"]\s*[\'\"]\s*',
            r'[\'\"]\s*(or|and)\s+\d+\s*=\s*\d+\s*[\'\"]\s*',
            r';\s*(drop|delete|truncate|insert|update)',
            r'(exec|execute|sp_|xp_)',
            r'<script[^>]*>.*</script>',  # XSS
        ]
        
        for pattern in sql_patterns:
            if re.search(pattern, text_lower):
                return True
        
        return False
    
    @staticmethod
    def validate_password(password):
        """Validate password strength."""
        if not password:
            return False, "Паролата е задължителна"
        if len(password) < 6:
            return False, "Паролата трябва да е поне 6 символа"
        if len(password) > 128:
            return False, "Паролата е твърде дълга"
        return True, ""
    
    @staticmethod
    def validate_eik(eik):
        """Validate Bulgarian EIK format."""
        if not eik:
            return True  # Optional field
        if not re.match(r'^[0-9]{9,13}$', eik):
            return False
        return True
    
    @staticmethod
    def sanitize_input(text, max_length=1000):
        """Comprehensive input sanitization."""
        if not text:
            return ""
        
        # Convert to string if not already
        text = str(text)
        
        # Check for SQL injection patterns
        if SecurityValidator.check_sql_injection(text):
            return ""  # Return empty string for suspicious content
        
        # Remove null bytes and control characters
        text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
        
        # Remove potential HTML/script tags
        text = re.sub(r'<[^>]*>', '', text)
        
        # Truncate to max length
        return text[:max_length].strip()
    
    @staticmethod
    def detect_spam_patterns(text):
        """Basic spam detection."""
        if not text:
            return False
        
        text_lower = text.lower()
        
        # Suspicious patterns
        spam_indicators = [
            r'http[s]?://.*\.tk/',  # Suspicious domains
            r'http[s]?://.*\.ml/',
            r'(buy|purchase|sale).*(viagra|cialis|cheap)',  # Pharmacy spam
            r'(win|winner|won).*(money|prize|lottery)',  # Lottery spam
            r'[a-zA-Z]{50,}',  # Very long words (often spam)
            r'(.)\1{10,}',  # Repeated characters
        ]
        
        for pattern in spam_indicators:
            if re.search(pattern, text_lower):
                return True
        
        return False

class CSRFProtection:
    """Basic CSRF token management."""
    tokens = {}  # {user_id: {token: timestamp}}
    
    @staticmethod
    def generate_token(user_id):
        """Generate a new CSRF token for user."""
        token = hashlib.sha256(f"{user_id}{time.time()}{uuid.uuid4()}".encode()).hexdigest()
        
        # Clean old tokens
        now = time.time()
        if user_id in CSRFProtection.tokens:
            CSRFProtection.tokens[user_id] = {
                t: ts for t, ts in CSRFProtection.tokens[user_id].items() 
                if now - ts < 3600  # 1 hour expiry
            }
        else:
            CSRFProtection.tokens[user_id] = {}
        
        CSRFProtection.tokens[user_id][token] = now
        return token
    
    @staticmethod
    def validate_token(user_id, token):
        """Validate CSRF token for user."""
        if not user_id or not token:
            return False
            
        if user_id not in CSRFProtection.tokens:
            return False
            
        if token not in CSRFProtection.tokens[user_id]:
            return False
        
        # Check token age (1 hour max)
        token_time = CSRFProtection.tokens[user_id][token]
        if time.time() - token_time > 3600:
            del CSRFProtection.tokens[user_id][token]
            return False
        
        # Consume token (one-time use)
        del CSRFProtection.tokens[user_id][token]
        return True

class SkillioHandler(BaseHTTPRequestHandler):
    
    def add_security_headers(self):
        """Add basic security headers."""
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        # Don't add HSTS in development
        # self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    
    def get_client_ip(self):
        """Get client IP address."""
        # Check for forwarded IPs in reverse proxy setups
        forwarded = self.headers.get('X-Forwarded-For')
        if forwarded:
            return forwarded.split(',')[0].strip()
        
        real_ip = self.headers.get('X-Real-IP')
        if real_ip:
            return real_ip.strip()
            
        return self.client_address[0]
    
    def check_rate_limit(self, endpoint_name, max_requests=10, window_seconds=300):
        """Check rate limit for specific endpoint."""
        client_ip = self.get_client_ip()
        is_limited, remaining = rate_limiter.is_rate_limited(
            f"{client_ip}:{endpoint_name}", 
            max_requests, 
            window_seconds
        )
        
        if is_limited:
            self.send_response(429)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Retry-After', str(window_seconds))
            self.add_security_headers()
            self.end_headers()
            error_msg = {
                'error': f'Твърде много заявки. Опитайте отново след {window_seconds//60} минути.',
                'retry_after': window_seconds
            }
            self.wfile.write(json.dumps(error_msg, ensure_ascii=False).encode('utf-8'))
            return False
        
        return True

    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/':
            self.serve_homepage()
        elif path == '/activities':
            self.serve_activities_page()
        elif path == '/agencies':
            self.serve_agencies_page()
        elif path == '/about':
            self.serve_about_page()
        elif path == '/login':
            self.serve_login_page()
        elif path == '/register':
            self.serve_register_page()
        elif path == '/dashboard':
            self.serve_profile_page()
        elif path == '/profile':
            self.serve_profile_page()
        elif path == '/add-activity':
            self.serve_add_activity_page()
        elif path == '/add-teacher':
            self.serve_add_teacher_page()
        elif path == '/manage-agency':
            self.serve_agency_management_page()
        elif path == '/api/activities':
            self.serve_activities_api()
        elif path == '/api/schools':
            self.serve_schools_api()
        elif path == '/api/cities':
            self.serve_cities_api()
        elif path == '/api/ratings':
            self.serve_ratings_api()
        elif path == '/api/teachers':
            self.serve_teachers_api()
        elif path == '/logout':
            self.handle_logout()
        else:
            self.send_error(404)
    
    def do_POST(self):
        path = urlparse(self.path).path
        
        if path == '/api/login':
            self.handle_login()
        elif path == '/api/rate':
            self.handle_rating()
        elif path == '/api/update-profile':
            self.handle_profile_update()
        elif path == '/api/submit-activity':
            self.handle_activity_submission()
        elif path == '/api/submit-teacher':
            self.handle_teacher_submission()
        elif path == '/api/moderate-submission':
            self.handle_moderate_submission()
        elif path == '/api/register':
            self.handle_registration()
        elif path == '/api/claim-agency':
            self.handle_agency_claim()
        elif path == '/api/update-agency':
            self.handle_agency_update()
        else:
            self.send_error(404)

    def get_current_user(self):
        """Get current logged in user from cookie."""
        if 'Cookie' not in self.headers:
            return None
        
        cookie = SimpleCookie(self.headers['Cookie'])
        if 'session_id' not in cookie:
            return None
        
        session_id = cookie['session_id'].value
        
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, email, role FROM users WHERE id = ?', (session_id,))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return {'id': user[0], 'email': user[1], 'role': user[2]}
        return None

    def check_permission(self, required_role, user=None):
        """Check if user has required permission level."""
        if user is None:
            user = self.get_current_user()
        
        if not user:
            return False
            
        role_hierarchy = {
            'admin': 3,
            'school': 2, 
            'parent': 1
        }
        
        user_level = role_hierarchy.get(user['role'], 0)
        required_level = role_hierarchy.get(required_role, 99)
        
        return user_level >= required_level
    
    def require_permission(self, required_role, redirect_to='/login'):
        """Middleware to enforce permission requirements."""
        user = self.get_current_user()
        
        if not user:
            self.send_response(302)
            self.send_header('Location', redirect_to)
            self.end_headers()
            return None
            
        if not self.check_permission(required_role, user):
            self.send_error(403, "Нямате права за достъп до тази страница")
            return None
            
        return user
    
    def require_role(self, allowed_roles, redirect_to='/login'):
        """Middleware to enforce specific role requirements."""
        user = self.get_current_user()
        
        if not user:
            self.send_response(302)
            self.send_header('Location', redirect_to)
            self.end_headers()
            return None
            
        if user['role'] not in allowed_roles:
            self.send_response(403)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(f'<h1>403 Forbidden</h1><p>Тази функция е достъпна само за: {", ".join(allowed_roles)}</p>'.encode('utf-8'))
            return None
            
        return user

    def get_base_css(self):
        """Return base CSS styles."""
        return '''
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
        
        /* Header */
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .logo { font-size: 1.8rem; font-weight: bold; text-decoration: none; color: white; }
        .nav-menu { display: flex; list-style: none; gap: 2rem; }
        .nav-menu a { color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 5px; transition: background 0.3s; }
        .nav-menu a:hover, .nav-menu a.active { background: rgba(255,255,255,0.2); }
        .auth-buttons { display: flex; gap: 1rem; align-items: center; }
        
        /* Main Content */
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem 20px; }
        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { color: #2c3e50; margin-bottom: 0.5rem; }
        .page-header p { color: #7f8c8d; font-size: 1.1rem; }
        
        /* Cards */
        .card { background: white; border-radius: 15px; padding: 2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .card h2 { color: #333; margin-bottom: 1rem; }
        
        /* Buttons */
        .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; font-weight: 500; transition: all 0.3s; display: inline-block; text-align: center; }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: #667eea; color: white; }
        .btn-secondary { background: transparent; color: white; border: 2px solid white; }
        '''
    
    def get_header(self):
        """Return HTML header with navigation."""
        user = self.get_current_user()
        
        return f'''
        <header class="header">
            <nav class="nav-container">
                <a href="/" class="logo">
                    <i class="fas fa-graduation-cap"></i> Skillio
                </a>
                <ul class="nav-menu">
                    <li><a href="/">Начало</a></li>
                    <li><a href="/activities">Дейности</a></li>
                    <li><a href="/agencies">Агенции</a></li>
                    <li><a href="/about">За нас</a></li>
                    {f'<li><a href="/add-activity"><i class="fas fa-plus"></i> Добави агенция</a></li>' if user and user['role'] == 'parent' else ''}
                    {f'<li><a href="/manage-agency"><i class="fas fa-cog"></i> Управлявай</a></li>' if user and user['role'] == 'school' else ''}
                    {f'<li><a href="/dashboard"><i class="fas fa-shield-alt"></i> Админ</a></li>' if user and user['role'] == 'admin' else ''}
                </ul>
                <div class="auth-buttons">
                    {f"<a href='/dashboard' class='btn btn-secondary'><i class='fas fa-user'></i> {user['email']}</a><a href='/logout' class='btn btn-primary'>Изход</a>" if user else "<a href='/login' class='btn btn-secondary'>Вход</a><a href='/register' class='btn btn-primary'>Регистрация</a>"}
                </div>
            </nav>
        </header>
        '''

    def get_base_html(self, title, body_content, extra_css="", extra_js=""):
        """Base HTML template with header and footer."""
        user = self.get_current_user()
        
        return f'''
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Skillio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
        
        /* Header */
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .nav-container {{ max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }}
        .logo {{ font-size: 1.8rem; font-weight: bold; text-decoration: none; color: white; }}
        .nav-menu {{ display: flex; list-style: none; gap: 2rem; }}
        .nav-menu a {{ color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 5px; transition: background 0.3s; }}
        .nav-menu a:hover, .nav-menu a.active {{ background: rgba(255,255,255,0.2); }}
        .auth-buttons {{ display: flex; gap: 1rem; align-items: center; }}
        .btn {{ padding: 0.6rem 1.2rem; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; font-weight: 500; transition: all 0.3s; display: inline-block; }}
        .btn-primary {{ background: #ff6b6b; color: white; }}
        .btn-primary:hover {{ background: #ff5252; transform: translateY(-2px); }}
        .btn-secondary {{ background: transparent; color: white; border: 2px solid white; }}
        .btn-secondary:hover {{ background: white; color: #667eea; }}
        
        /* Main Content */
        .main-content {{ min-height: calc(100vh - 200px); }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 2rem 20px; }}
        
        /* Cards */
        .card {{ background: white; border-radius: 15px; padding: 2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 2rem; }}
        .card h2 {{ color: #333; margin-bottom: 1rem; }}
        
        /* Grid layouts */
        .grid {{ display: grid; gap: 2rem; }}
        .grid-2 {{ grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }}
        .grid-3 {{ grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }}
        .grid-4 {{ grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }}
        
        /* Activity/Agency cards */
        .item-card {{ background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: all 0.3s; }}
        .item-card:hover {{ transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.15); }}
        .card-header {{ padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }}
        .card-body {{ padding: 1.5rem; }}
        .category {{ background: #2ecc71; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.9rem; display: inline-block; margin-bottom: 1rem; }}
        .location {{ color: #7f8c8d; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }}
        .contact-item {{ display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: #555; }}
        .contact-item i {{ color: #667eea; width: 16px; }}
        
        /* Rating system */
        .rating {{ display: flex; align-items: center; gap: 0.5rem; }}
        .stars {{ display: flex; gap: 2px; }}
        .star {{ color: #ddd; cursor: pointer; font-size: 1.2rem; transition: color 0.2s; }}
        .star.filled {{ color: #ffc107; }}
        .star:hover, .star.hover {{ color: #ffc107; }}
        .rating-summary {{ display: flex; align-items: center; gap: 0.5rem; }}
        .rating-count {{ color: #7f8c8d; font-size: 0.9rem; }}
        
        /* Forms */
        .form-group {{ margin-bottom: 1.5rem; }}
        .form-group label {{ display: block; margin-bottom: 0.5rem; font-weight: 500; color: #555; }}
        .form-group input, .form-group textarea, .form-group select {{ width: 100%; padding: 0.7rem; border: 2px solid #e1e5e9; border-radius: 5px; font-size: 1rem; }}
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {{ outline: none; border-color: #667eea; }}
        
        /* Footer */
        .footer {{ background: #2c3e50; color: white; padding: 3rem 0 1rem; margin-top: 4rem; }}
        .footer-container {{ max-width: 1200px; margin: 0 auto; padding: 0 20px; }}
        .footer-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem; }}
        .footer-section h3 {{ margin-bottom: 1rem; color: #fff; }}
        .footer-section p, .footer-section li {{ color: #bdc3c7; line-height: 1.8; }}
        .footer-section ul {{ list-style: none; }}
        .footer-section a {{ color: #bdc3c7; text-decoration: none; transition: color 0.3s; }}
        .footer-section a:hover {{ color: #3498db; }}
        .footer-bottom {{ border-top: 1px solid #34495e; padding-top: 2rem; text-align: center; color: #95a5a6; }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            .nav-menu {{ display: none; }}
            .grid {{ grid-template-columns: 1fr; }}
        }}
        
        {extra_css}
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav-container">
            <a href="/" class="logo">
                <i class="fas fa-graduation-cap"></i> Skillio
            </a>
            <ul class="nav-menu">
                <li><a href="/" {"class='active'" if title == "Начало" else ""}>Начало</a></li>
                <li><a href="/activities" {"class='active'" if title == "Дейности" else ""}>Дейности</a></li>
                <li><a href="/agencies" {"class='active'" if title == "Агенции" else ""}>Агенции</a></li>
                <li><a href="/about" {"class='active'" if title == "За нас" else ""}>За нас</a></li>
                {f'<li><a href="/add-activity"><i class="fas fa-plus"></i> Добави агенция</a></li>' if user and user['role'] == 'parent' else ''}
                {f'<li><a href="/manage-agency"><i class="fas fa-cog"></i> Управлявай</a></li>' if user and user['role'] == 'school' else ''}
                {f'<li><a href="/dashboard"><i class="fas fa-shield-alt"></i> Админ</a></li>' if user and user['role'] == 'admin' else ''}
            </ul>
            <div class="auth-buttons">
                {f"<a href='/dashboard' class='btn btn-secondary'><i class='fas fa-user'></i> {user['email'].split('@')[0]}</a><a href='/logout' class='btn btn-primary'>Изход</a>" if user else "<a href='/login' class='btn btn-secondary'>Вход</a><a href='/register' class='btn btn-primary'>Регистрация</a>"}
            </div>
        </nav>
    </header>

    <main class="main-content">
        {body_content}
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3><i class="fas fa-graduation-cap"></i> Skillio</h3>
                    <p>Водеща платформа за детски извънкласни дейности в България. Свързваме родители с най-добрите агенции за роботика, математика и творческо развитие.</p>
                </div>
                <div class="footer-section">
                    <h3>Дейности</h3>
                    <ul>
                        <li><a href="/activities"><i class="fas fa-robot"></i> Роботика и програмиране</a></li>
                        <li><a href="/activities"><i class="fas fa-calculator"></i> Математическо училище</a></li>
                        <li><a href="/activities"><i class="fas fa-palette"></i> Извънкласни дейности</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>За агенции</h3>
                    <ul>
                        <li><a href="/login">Регистрирайте се</a></li>
                        <li><a href="/agencies">Всички агенции</a></li>
                        <li><a href="/about">За платформата</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Контакти</h3>
                    <ul>
                        <li><i class="fas fa-envelope"></i> info@skillio.bg</li>
                        <li><i class="fas fa-phone"></i> +359 2 123 4567</li>
                        <li><i class="fas fa-map-marker-alt"></i> София, България</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Skillio. Всички права запазени.</p>
            </div>
        </div>
    </footer>

    <script>
        {extra_js}
    </script>
</body>
</html>'''

    def serve_homepage(self):
        """Serve the main homepage."""
        body_content = '''
        <!-- Hero Section -->
        <section class="hero" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 4rem 0; text-align: center; margin-bottom: 3rem;">
            <div class="hero-container" style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">🎯 Най-добрите дейности за деца</h1>
                <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">Открийте професионални агенции за роботика, математика и извънкласни занимания в цяла България</p>
                <a href="/activities" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                    <i class="fas fa-search"></i> Разгледайте дейности
                </a>
            </div>
        </section>

        <!-- Stats Section -->
        <div class="container">
            <div class="grid grid-4" id="stats-grid">
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;" id="totalSchools">-</div>
                    <div>Агенции</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;" id="totalActivities">-</div>
                    <div>Активности</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #ff8a80 0%, #ffcc80 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;" id="totalCities">-</div>
                    <div>Града</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); color: #333;">
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">100%</div>
                    <div>Верифицирани</div>
                </div>
            </div>

            <!-- Popular Activities -->
            <div class="card">
                <h2><i class="fas fa-fire"></i> Популярни дейности</h2>
                <div class="grid grid-3" id="popular-activities">
                    <div style="text-align: center; padding: 2rem; border: 2px dashed #e1e5e9; border-radius: 10px;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #7f8c8d;"></i>
                        <p style="margin-top: 1rem; color: #7f8c8d;">Зареждане...</p>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-3">
                <div class="card" style="text-align: center;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
                    <h3>Търсете дейности</h3>
                    <p style="color: #7f8c8d; margin-bottom: 1.5rem;">Разгледайте над 30 агенции в цяла България</p>
                    <a href="/activities" class="btn btn-primary">Започнете търсенето</a>
                </div>
                <div class="card" style="text-align: center;">
                    <i class="fas fa-school" style="font-size: 3rem; color: #2ecc71; margin-bottom: 1rem;"></i>
                    <h3>Агенции</h3>
                    <p style="color: #7f8c8d; margin-bottom: 1.5rem;">Открийте най-добрите агенции във вашия град</p>
                    <a href="/agencies" class="btn" style="background: #2ecc71; color: white;">Виж агенции</a>
                </div>
                <div class="card" style="text-align: center;">
                    <i class="fas fa-star" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
                    <h3>Рейтинги</h3>
                    <p style="color: #7f8c8d; margin-bottom: 1.5rem;">Прочетете отзиви от други родители</p>
                    <a href="/agencies" class="btn" style="background: #f39c12; color: white;">Виж рейтинги</a>
                </div>
            </div>
        </div>
        '''
        
        js_code = '''
        async function loadStats() {
            try {
                const [activitiesRes, citiesRes] = await Promise.all([
                    fetch('/api/activities'),
                    fetch('/api/cities')
                ]);
                
                const activities = await activitiesRes.json();
                const cities = await citiesRes.json();
                
                // Animate stats
                animateCounter('totalSchools', new Set(activities.map(a => a.school_name)).size);
                animateCounter('totalActivities', activities.length);
                animateCounter('totalCities', cities.length);
                
                // Show popular activities
                const popular = activities.slice(0, 6);
                document.getElementById('popular-activities').innerHTML = popular.map(activity => `
                    <div class="item-card">
                        <div class="card-header">
                            <h4>${activity.category}</h4>
                        </div>
                        <div class="card-body">
                            <div class="location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${activity.city}
                            </div>
                            <div style="font-weight: bold;">${activity.school_name}</div>
                            <div style="color: #f39c12; font-weight: bold; margin-top: 0.5rem;">
                                ${activity.price_monthly} лв./месец
                            </div>
                        </div>
                    </div>
                `).join('');
                
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        
        function animateCounter(elementId, finalValue) {
            const element = document.getElementById(elementId);
            let currentValue = 0;
            const increment = finalValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    element.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(currentValue);
                }
            }, 30);
        }
        
        loadStats();
        '''
        
        html = self.get_base_html("Начало", body_content, extra_js=js_code)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.add_security_headers()
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_activities_page(self):
        """Serve dedicated activities page."""
        body_content = '''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-graduation-cap"></i> Всички дейности</h1>
                <p>Открийте най-подходящите дейности за вашето дете</p>
            </div>
            
            <!-- Filters -->
            <div class="card">
                <div class="grid grid-4">
                    <div class="form-group">
                        <label for="cityFilter"><i class="fas fa-map-marker-alt"></i> Град</label>
                        <select id="cityFilter" onchange="filterActivities()">
                            <option value="">Всички градове</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="categoryFilter"><i class="fas fa-tags"></i> Категория</label>
                        <select id="categoryFilter" onchange="filterActivities()">
                            <option value="">Всички категории</option>
                            <option value="Robotics & Programming">Роботика и програмиране</option>
                            <option value="Mathematics School">Математическо училище</option>
                            <option value="After School Activities">Извънкласни дейности</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="ageFilter"><i class="fas fa-child"></i> Възраст на детето</label>
                        <select id="ageFilter" onchange="filterActivities()">
                            <option value="">Всички възрасти</option>
                            <option value="4-6">4-6 години</option>
                            <option value="7-10">7-10 години</option>
                            <option value="11-14">11-14 години</option>
                            <option value="15-18">15-18 години</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="priceFilter"><i class="fas fa-coins"></i> Максимална цена</label>
                        <input type="range" id="priceFilter" min="0" max="300" value="300" onchange="filterActivities()">
                        <div style="text-align: center; margin-top: 0.5rem;">
                            До <strong id="priceValue">300</strong> лв./месец
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Activities Grid -->
            <div class="grid grid-2" id="activities-grid">
                <div style="text-align: center; padding: 3rem; color: #7f8c8d;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">Зареждане на дейности...</p>
                </div>
            </div>
        </div>
        '''
        
        js_code = '''
        let allActivities = [];
        
        async function loadActivitiesPage() {
            try {
                const [activitiesRes, citiesRes, ratingsRes] = await Promise.all([
                    fetch('/api/activities'),
                    fetch('/api/cities'),
                    fetch('/api/ratings')
                ]);
                
                allActivities = await activitiesRes.json();
                const cities = await citiesRes.json();
                const ratings = await ratingsRes.json();
                
                // Add ratings to activities
                allActivities.forEach(activity => {
                    const activityRatings = ratings.filter(r => r.school_name === activity.school_name);
                    activity.ratings = activityRatings;
                    activity.averageRating = activityRatings.length > 0 ? 
                        activityRatings.reduce((sum, r) => sum + r.rating, 0) / activityRatings.length : 0;
                });
                
                // Populate filters
                const cityFilter = document.getElementById('cityFilter');
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });
                
                displayActivities(allActivities);
            } catch (error) {
                console.error('Error loading activities:', error);
            }
        }
        
        function displayActivities(activities) {
            const container = document.getElementById('activities-grid');
            
            if (activities.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #7f8c8d;"><i class="fas fa-search"></i><p>Няма намерени дейности</p></div>';
                return;
            }
            
            container.innerHTML = activities.map(activity => `
                <div class="item-card">
                    <div class="card-header">
                        <h3>${activity.category}</h3>
                        <div style="opacity: 0.9;">${activity.school_name}</div>
                    </div>
                    <div class="card-body">
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${activity.city}${activity.neighborhood ? ', ' + activity.neighborhood : ''}
                        </div>
                        <div class="category">${activity.category}</div>
                        
                        <div class="rating-summary" style="margin-bottom: 1rem;">
                            <div class="stars">
                                ${[1,2,3,4,5].map(i => `<span class="star ${i <= Math.round(activity.averageRating) ? 'filled' : ''}"">★</span>`).join('')}
                            </div>
                            <span class="rating-count">(${activity.ratings.length} отзива)</span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div style="text-align: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #7f8c8d;">Възраст</div>
                                <div style="font-weight: bold;">${activity.age_min}-${activity.age_max} г.</div>
                            </div>
                            <div style="text-align: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #7f8c8d;">Цена</div>
                                <div style="font-weight: bold; color: #f39c12;">${activity.price_monthly} лв.</div>
                            </div>
                        </div>
                        
                        <div style="border-top: 1px solid #e1e5e9; padding-top: 1rem;">
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${activity.phone}</span>
                            </div>
                            ${activity.website ? `
                            <div class="contact-item">
                                <i class="fas fa-globe"></i>
                                <a href="${activity.website}" target="_blank">Уебсайт</a>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        function filterActivities() {
            const cityFilter = document.getElementById('cityFilter').value;
            const categoryFilter = document.getElementById('categoryFilter').value;
            const ageFilter = document.getElementById('ageFilter').value;
            const priceFilter = document.getElementById('priceFilter').value;
            
            document.getElementById('priceValue').textContent = priceFilter;
            
            const filtered = allActivities.filter(activity => {
                const cityMatch = !cityFilter || activity.city === cityFilter;
                const categoryMatch = !categoryFilter || activity.category === categoryFilter;
                const priceMatch = activity.price_monthly <= parseFloat(priceFilter);
                
                let ageMatch = true;
                if (ageFilter) {
                    const [minAge, maxAge] = ageFilter.split('-').map(Number);
                    ageMatch = activity.age_min <= maxAge && activity.age_max >= minAge;
                }
                
                return cityMatch && categoryMatch && priceMatch && ageMatch;
            });
            
            displayActivities(filtered);
        }
        
        loadActivitiesPage();
        '''
        
        html = self.get_base_html("Дейности", body_content, extra_js=js_code)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.add_security_headers()
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_agencies_page(self):
        """Serve agencies page with rating system."""
        user = self.get_current_user()
        
        body_content = f'''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-school"></i> Агенции</h1>
                <p>Разгледайте всички верифицирани агенции с рейтинги и отзиви</p>
            </div>
            
            <!-- City Filter -->
            <div class="card">
                <div class="form-group" style="max-width: 300px;">
                    <label for="cityFilterAgencies"><i class="fas fa-map-marker-alt"></i> Филтрирай по град</label>
                    <select id="cityFilterAgencies" onchange="filterAgencies()">
                        <option value="">Всички градове</option>
                    </select>
                </div>
            </div>
            
            <!-- Agencies Grid -->
            <div class="grid grid-2" id="agencies-grid">
                <div style="text-align: center; padding: 3rem; color: #7f8c8d;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">Зареждане на агенции...</p>
                </div>
            </div>
            
            <!-- Rating Modal -->
            <div id="ratingModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
                    <h3 style="margin-bottom: 1rem;">Оценете агенцията</h3>
                    <form id="ratingForm">
                        <input type="hidden" id="ratingSchoolId">
                        <div class="form-group">
                            <label>Оценка</label>
                            <div class="rating" id="ratingStars">
                                <span class="star" data-rating="1">★</span>
                                <span class="star" data-rating="2">★</span>
                                <span class="star" data-rating="3">★</span>
                                <span class="star" data-rating="4">★</span>
                                <span class="star" data-rating="5">★</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="ratingComment">Коментар (по избор)</label>
                            <textarea id="ratingComment" rows="3" placeholder="Споделете опита си с тази агенция..."></textarea>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" class="btn btn-primary">Изпрати оценка</button>
                            <button type="button" onclick="closeRatingModal()" class="btn btn-secondary">Отказ</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        '''
        
        js_code = '''
        let allSchools = [];
        let allRatings = [];
        let selectedRating = 0;
        
        async function loadAgenciesPage() {
            try {
                const [schoolsRes, citiesRes, ratingsRes] = await Promise.all([
                    fetch('/api/schools'),
                    fetch('/api/cities'),
                    fetch('/api/ratings')
                ]);
                
                allSchools = await schoolsRes.json();
                const cities = await citiesRes.json();
                allRatings = await ratingsRes.json();
                
                // Add ratings to schools
                allSchools.forEach(school => {
                    const schoolRatings = allRatings.filter(r => r.school_name === school.name);
                    school.ratings = schoolRatings;
                    school.averageRating = schoolRatings.length > 0 ? 
                        schoolRatings.reduce((sum, r) => sum + r.rating, 0) / schoolRatings.length : 0;
                });
                
                // Sort by rating
                allSchools.sort((a, b) => b.averageRating - a.averageRating);
                
                // Populate city filter
                const cityFilter = document.getElementById('cityFilterAgencies');
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });
                
                displayAgencies(allSchools);
                initializeRatingSystem();
            } catch (error) {
                console.error('Error loading agencies:', error);
            }
        }
        
        function displayAgencies(schools) {
            const container = document.getElementById('agencies-grid');
            
            if (schools.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #7f8c8d;"><i class="fas fa-search"></i><p>Няма намерени агенции</p></div>';
                return;
            }
            
            const userIsParent = ''' + ('true' if user and user['role'] == 'parent' else 'false') + ''';
            
            container.innerHTML = schools.map(school => `
                <div class="item-card">
                    <div class="card-header">
                        <h3>${school.name}</h3>
                        <div class="location" style="color: rgba(255,255,255,0.9);">
                            <i class="fas fa-map-marker-alt"></i>
                            ${school.city}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="rating-summary" style="margin-bottom: 1rem;">
                            <div class="stars">
                                ${[1,2,3,4,5].map(i => `<span class="star ${i <= Math.round(school.averageRating) ? 'filled' : ''}"">★</span>`).join('')}
                            </div>
                            <span class="rating-count">
                                ${school.averageRating > 0 ? school.averageRating.toFixed(1) : 'Няма оценки'} 
                                (${school.ratings.length} отзива)
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <strong>Дейности:</strong> ${school.activity_count}
                        </div>
                        
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${school.phone}</span>
                        </div>
                        
                        ${school.website ? `
                        <div class="contact-item">
                            <i class="fas fa-globe"></i>
                            <a href="${school.website}" target="_blank">Уебсайт</a>
                        </div>` : ''}
                        
                        ${school.ratings.length > 0 ? `
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1e5e9;">
                            <strong>Последни отзиви:</strong>
                            ${school.ratings.slice(0, 2).map(rating => `
                                <div style="margin-top: 0.5rem; padding: 0.5rem; background: #f8f9fa; border-radius: 5px; font-size: 0.9rem;">
                                    <div class="stars" style="margin-bottom: 0.25rem;">
                                        ${[1,2,3,4,5].map(i => `<span class="star ${i <= rating.rating ? 'filled' : ''}" style="font-size: 0.8rem;">★</span>`).join('')}
                                    </div>
                                    ${rating.comment ? `<div style="color: #555;">"${rating.comment}"</div>` : ''}
                                </div>
                            `).join('')}
                        </div>` : ''}
                        
                        ${userIsParent ? `
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1e5e9;">
                            <button onclick="openRatingModal('${school.name}')" class="btn" style="background: #f39c12; color: white; width: 100%;">
                                <i class="fas fa-star"></i> Оценете агенцията
                            </button>
                        </div>` : ''}
                    </div>
                </div>
            `).join('');
        }
        
        function filterAgencies() {
            const cityFilter = document.getElementById('cityFilterAgencies').value;
            
            const filtered = allSchools.filter(school => {
                return !cityFilter || school.city === cityFilter;
            });
            
            displayAgencies(filtered);
        }
        
        function initializeRatingSystem() {
            const stars = document.querySelectorAll('#ratingStars .star');
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    selectedRating = parseInt(this.getAttribute('data-rating'));
                    updateStars();
                });
                
                star.addEventListener('mouseenter', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    highlightStars(rating);
                });
            });
            
            document.getElementById('ratingStars').addEventListener('mouseleave', function() {
                updateStars();
            });
            
            document.getElementById('ratingForm').addEventListener('submit', handleRatingSubmit);
        }
        
        function highlightStars(rating) {
            const stars = document.querySelectorAll('#ratingStars .star');
            stars.forEach((star, index) => {
                star.classList.toggle('hover', index < rating);
            });
        }
        
        function updateStars() {
            const stars = document.querySelectorAll('#ratingStars .star');
            stars.forEach((star, index) => {
                star.classList.remove('hover');
                star.classList.toggle('filled', index < selectedRating);
            });
        }
        
        function openRatingModal(schoolName) {
            document.getElementById('ratingSchoolId').value = schoolName;
            document.getElementById('ratingModal').style.display = 'flex';
            selectedRating = 0;
            updateStars();
        }
        
        function closeRatingModal() {
            document.getElementById('ratingModal').style.display = 'none';
            document.getElementById('ratingForm').reset();
            selectedRating = 0;
        }
        
        async function handleRatingSubmit(e) {
            e.preventDefault();
            
            if (selectedRating === 0) {
                alert('Моля, изберете оценка');
                return;
            }
            
            const schoolName = document.getElementById('ratingSchoolId').value;
            const comment = document.getElementById('ratingComment').value;
            
            try {
                const response = await fetch('/api/rate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        school_name: schoolName,
                        rating: selectedRating,
                        comment: comment
                    })
                });
                
                if (response.ok) {
                    closeRatingModal();
                    location.reload(); // Refresh to show new rating
                } else {
                    alert('Грешка при изпращане на оценката');
                }
            } catch (error) {
                console.error('Error submitting rating:', error);
                alert('Мрежова грешка');
            }
        }
        
        loadAgenciesPage();
        '''
        
        html = self.get_base_html("Агенции", body_content, extra_js=js_code)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_about_page(self):
        """Serve about us page."""
        body_content = '''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-heart"></i> Започна от един лош контакт</h1>
                <p style="font-size: 1.2rem; color: #7f8c8d; line-height: 1.6; margin-top: 1.5rem;">
                    Получих препоръка за треньор по тенис. Оказа се разочарование. 
                    Нямаше къде да проверя реални мнения. Нямаше структура. 
                    Така се роди Skillio.
                </p>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-bullseye"></i> Мисия</h2>
                <p style="font-size: 1.1rem; line-height: 1.6;">
                    Skillio свързва родители с качествени извънкласни дейности — на база 
                    <strong>прозрачност</strong>, <strong>реални отзиви</strong> и <strong>локално търсене</strong>.
                </p>
            </div>
            
            <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;">
                <h2 style="color: white; margin-bottom: 2rem;"><i class="fas fa-quote-left"></i> Нашият лозунг</h2>
                <div style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem;">
                    „Намери правилната дейност. Без догадки."
                </div>
                <div style="opacity: 0.9; font-size: 1rem;">
                    Извънкласни дейности, на които можеш да се довериш. 
                    Всичко за развитието на детето — на едно място.
                </div>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-star"></i> Защо да изберете Skillio?</h2>
                <div class="grid grid-3">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-shield-check" style="font-size: 3rem; color: #2ecc71; margin-bottom: 1rem;"></i>
                        <h3>Верифицирани агенции</h3>
                        <p>Всички агенции в платформата са проверени и верифицирани от нашия екип.</p>
                    </div>
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-users" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                        <h3>Отзиви от родители</h3>
                        <p>Прочетете истински отзиви от други родители за агенциите.</p>
                    </div>
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
                        <h3>Национално покритие</h3>
                        <p>Агенции в 16+ града из цяла България.</p>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-2">
                <div class="card">
                    <h2><i class="fas fa-chart-bar"></i> Статистики</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;">
                        <div style="padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #667eea;">36+</div>
                            <div>Агенции</div>
                        </div>
                        <div style="padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #2ecc71;">16+</div>
                            <div>Града</div>
                        </div>
                        <div style="padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #f39c12;">1000+</div>
                            <div>Деца</div>
                        </div>
                        <div style="padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #e74c3c;">100%</div>
                            <div>Безплатно</div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h2><i class="fas fa-rocket"></i> В развитие</h2>
                    <p>Skillio е в активно развитие. Всеки ден добавяме нови функции и подобряваме потребителското преживяване.</p>
                    <div style="margin-top: 1.5rem;">
                        <div style="padding: 1rem; background: #f8f9fa; border-radius: 10px; margin-bottom: 1rem;">
                            <strong><i class="fas fa-check" style="color: #27ae60;"></i> Що е готово:</strong> 
                            Търсене на агенции, реални отзиви, рейтинг система
                        </div>
                        <div style="padding: 1rem; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
                            <strong><i class="fas fa-cog" style="color: #f39c12;"></i> В процес:</strong> 
                            Разширяване на покритието, мобилно приложение
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card" style="text-align: center;">
                <h2><i class="fas fa-envelope"></i> Свържете се с нас</h2>
                <p style="margin-bottom: 2rem;">Имате въпроси или предложения? Ще се радваме да чуем от вас!</p>
                <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                    <div>
                        <i class="fas fa-envelope" style="color: #3498db; margin-right: 0.5rem;"></i>
                        <strong>info@skillio.bg</strong>
                    </div>
                    <div>
                        <i class="fas fa-phone" style="color: #2ecc71; margin-right: 0.5rem;"></i>
                        <strong>+359 2 123 4567</strong>
                    </div>
                    <div>
                        <i class="fas fa-map-marker-alt" style="color: #e74c3c; margin-right: 0.5rem;"></i>
                        <strong>София, България</strong>
                    </div>
                </div>
                <div style="margin-top: 2rem;">
                    <a href="/activities" class="btn btn-primary" style="margin-right: 1rem;">
                        <i class="fas fa-search"></i> Търсете дейности
                    </a>
                    <a href="/agencies" class="btn btn-secondary">
                        <i class="fas fa-school"></i> Виж агенции
                    </a>
                </div>
            </div>
        </div>
        '''
        
        html = self.get_base_html("За нас", body_content)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_login_page(self):
        """Serve login page.""" 
        html_content = '''
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход - Skillio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .login-container { 
            background: white; 
            padding: 3rem; 
            border-radius: 15px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .login-header { 
            text-align: center; 
            margin-bottom: 2rem; 
        }
        
        .login-header h1 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 2rem;
        }
        
        .form-group { 
            margin-bottom: 1.5rem; 
        }
        
        .form-group label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 500;
            color: #555;
        }
        
        .form-group input { 
            width: 100%; 
            padding: 1rem; 
            border: 2px solid #e1e5e9; 
            border-radius: 8px; 
            font-size: 1rem;
        }
        
        .form-group input:focus { 
            outline: none; 
            border-color: #667eea; 
        }
        
        .btn { 
            width: 100%; 
            padding: 1rem; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-size: 1.1rem; 
            cursor: pointer; 
        }
        
        .btn:hover { 
            transform: translateY(-2px); 
        }
        
        .test-accounts {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 2rem;
        }
        
        .test-account {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e1e5e9;
        }
        
        .test-account:last-child {
            border-bottom: none;
        }
        
        .quick-login {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
        }
        
        .back-link {
            display: block;
            text-align: center;
            margin-bottom: 2rem;
            color: #667eea;
            text-decoration: none;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <a href="/" class="back-link"><i class="fas fa-arrow-left"></i> Назад към началото</a>
        
        <div class="login-header">
            <h1><i class="fas fa-graduation-cap"></i> Skillio</h1>
            <p>Влезте в профила си</p>
        </div>
        
        <div id="error-message" class="error" style="display: none;"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password"><i class="fas fa-lock"></i> Парола</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn">
                <i class="fas fa-sign-in-alt"></i> Вход
            </button>
        </form>
        
        <div class="test-accounts">
            <h3><i class="fas fa-flask"></i> Тестови акаунти</h3>
            
            <div class="test-account">
                <div>
                    <div>admin@activities.com</div>
                    <div style="font-size: 0.8rem; color: #7f8c8d;">Администратор</div>
                </div>
                <button class="quick-login" onclick="quickLogin('admin@activities.com', 'admin123')">
                    Вход
                </button>
            </div>
            
            <div class="test-account">
                <div>
                    <div>parent@test.com</div>
                    <div style="font-size: 0.8rem; color: #7f8c8d;">Родител</div>
                </div>
                <button class="quick-login" onclick="quickLogin('parent@test.com', 'parent123')">
                    Вход
                </button>
            </div>
            
            <div class="test-account">
                <div>
                    <div>school@test.com</div>
                    <div style="font-size: 0.8rem; color: #7f8c8d;">Агенция</div>
                </div>
                <button class="quick-login" onclick="quickLogin('school@test.com', 'school123')">
                    Вход
                </button>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; color: white;">
            Нямаш профил? <a href="/register" style="color: #f1c40f; text-decoration: none; font-weight: 600;">Създай тук</a>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    window.location.href = '/profile';
                } else {
                    const result = await response.json();
                    showError(result.error || 'Грешка при влизане');
                }
            } catch (error) {
                showError('Мрежова грешка');
            }
        });
        
        function quickLogin(email, password) {
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    </script>
</body>
</html>'''
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))

    def serve_register_page(self):
        """Serve public registration page with role selection."""
        html_content = '''
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация - Skillio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .register-container {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        .logo h1 {
            color: #667eea;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        .logo p {
            color: #7f8c8d;
            font-size: 1.1rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #2c3e50;
            font-weight: 500;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .role-selection {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .role-card {
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .role-card:hover {
            border-color: #667eea;
            background: #f8f9ff;
        }
        .role-card.selected {
            border-color: #667eea;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .role-card i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .eik-field {
            display: none;
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .register-btn {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .register-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        .register-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .login-link {
            text-align: center;
            margin-top: 2rem;
            color: #7f8c8d;
        }
        .login-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        .login-link a:hover {
            text-decoration: underline;
        }
        .message {
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            display: none;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="register-container">
        <div class="logo">
            <h1><i class="fas fa-star"></i> Skillio</h1>
            <p>Създайте своя профил</p>
        </div>
        
        <div id="message" class="message"></div>
        
        <form id="registerForm">
            <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> Email адрес</label>
                <input type="email" id="email" name="email" required 
                       placeholder="example@domain.com">
            </div>
            
            <div class="form-group">
                <label for="password"><i class="fas fa-lock"></i> Парола</label>
                <input type="password" id="password" name="password" required 
                       placeholder="Поне 6 символа" minlength="6">
            </div>
            
            <div class="form-group">
                <label for="confirmPassword"><i class="fas fa-lock"></i> Потвърди паролата</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required 
                       placeholder="Повтори паролата">
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-user-tag"></i> Избери роля</label>
                <div class="role-selection">
                    <div class="role-card" data-role="parent">
                        <i class="fas fa-heart"></i>
                        <h3>Родител</h3>
                        <p>Търся дейности за детето си</p>
                    </div>
                    <div class="role-card" data-role="agency">
                        <i class="fas fa-building"></i>
                        <h3>Агенция</h3>
                        <p>Предлагам дейности</p>
                    </div>
                </div>
                <input type="hidden" id="role" name="role" required>
            </div>
            
            <div class="form-group eik-field" id="eikField">
                <label for="eik"><i class="fas fa-file-invoice"></i> ЕИК (незадължително)</label>
                <input type="text" id="eik" name="eik" 
                       placeholder="Единен идентификационен код"
                       pattern="[0-9]{9,13}">
                <small style="color: #7f8c8d;">За агенции с регистрация</small>
            </div>
            
            <!-- Security fields -->
            <div style="position: absolute; left: -9999px; top: -9999px;">
                <!-- Honeypot fields (hidden from humans, visible to bots) -->
                <input type="text" name="website" tabindex="-1" autocomplete="off">
                <input type="url" name="url" tabindex="-1" autocomplete="off">
                <input type="tel" name="phone" tabindex="-1" autocomplete="off">
            </div>
            
            <!-- CSRF Token (basic protection) -->
            <input type="hidden" name="timestamp" id="timestamp" value="">
            <input type="hidden" name="form_token" id="form_token" value="">
            
            <button type="submit" class="register-btn" id="submitBtn">
                <i class="fas fa-user-plus"></i> Създай профил
            </button>
        </form>
        
        <div class="login-link">
            Вече имаш профил? <a href="/login">Влез тук</a>
        </div>
    </div>

    <script>
        // Role selection functionality
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Set hidden role input
                const role = this.getAttribute('data-role');
                document.getElementById('role').value = role;
                
                // Show/hide EIK field based on role
                const eikField = document.getElementById('eikField');
                if (role === 'agency') {
                    eikField.style.display = 'block';
                } else {
                    eikField.style.display = 'none';
                }
            });
        });

        // Initialize security tokens
        document.getElementById('timestamp').value = Date.now();
        document.getElementById('form_token').value = btoa(Date.now() + Math.random()).substring(0, 32);
        
        // Form submission
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            const messageDiv = document.getElementById('message');
            const submitBtn = document.getElementById('submitBtn');
            
            // Validation
            if (data.password !== data.confirmPassword) {
                showMessage('error', 'Паролите не съвпадат');
                return;
            }
            
            if (!data.role) {
                showMessage('error', 'Моля, избери роля');
                return;
            }
            
            if (data.password.length < 6) {
                showMessage('error', 'Паролата трябва да е поне 6 символа');
                return;
            }
            
            // Submit registration
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Създаване...';
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                        role: data.role,
                        eik: data.eik || null
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showMessage('success', result.message || 'Профилът беше създаден успешно! Проверете email-а си за потвърждение.');
                    this.reset();
                    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
                    document.getElementById('eikField').style.display = 'none';
                } else {
                    showMessage('error', result.error || 'Грешка при регистрация');
                }
                
            } catch (error) {
                showMessage('error', 'Грешка при свързване със сървъра');
                console.error(error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Създай профил';
            }
        });
        
        function showMessage(type, text) {
            const messageDiv = document.getElementById('message');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = text;
            messageDiv.style.display = 'block';
            
            // Auto-hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }
        }
    </script>
</body>
</html>'''
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))

    def serve_profile_page(self):
        """Enhanced user profile/dashboard page."""
        user = self.get_current_user()
        
        if not user:
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            return
        
        # Get user stats
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        stats = {}
        if user['role'] == 'parent':
            cursor.execute('SELECT COUNT(*) FROM ratings WHERE parent_id = ?', (user['id'],))
            stats['ratings_given'] = cursor.fetchone()[0]
        elif user['role'] == 'school':
            cursor.execute('SELECT COUNT(*) FROM schools WHERE created_by = ?', (user['id'],))
            stats['schools_managed'] = cursor.fetchone()[0]
            cursor.execute('SELECT COUNT(*) FROM activities WHERE created_by = ?', (user['id'],))
            stats['activities_created'] = cursor.fetchone()[0]
        elif user['role'] == 'admin':
            cursor.execute('SELECT COUNT(*) FROM users')
            stats['total_users'] = cursor.fetchone()[0]
            cursor.execute('SELECT COUNT(*) FROM schools')
            stats['total_schools'] = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM submitted_activities WHERE status = 'pending'")
            stats['pending_submissions'] = cursor.fetchone()[0]
        
        conn.close()
        
        body_content = f'''
        <div class="container">
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1><i class="fas fa-user-circle"></i> Профил</h1>
                        <p>Добре дошли, <strong>{user['email']}</strong></p>
                        <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem;">
                            {user['role'].upper()}
                        </span>
                    </div>
                    <div>
                        <a href="/" class="btn btn-secondary">
                            <i class="fas fa-home"></i> Начало
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- User Stats -->
            <div class="grid grid-4">
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">{stats.get('ratings_given', 0)}</div>
                    <div>Дадени оценки</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">5</div>
                    <div>Любими агенции</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">12</div>
                    <div>Прегледани дейности</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">3</div>
                    <div>Запитвания</div>
                </div>
                ''' if user['role'] == 'parent' else f'''
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">{stats.get('schools_managed', 0)}</div>
                    <div>Управлявани агенции</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">{stats.get('activities_created', 0)}</div>
                    <div>Създадени дейности</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">85</div>
                    <div>Заявки за месеца</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">4.2</div>
                    <div>Средна оценка</div>
                </div>
                ''' if user['role'] == 'school' else f'''
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">{stats.get('total_users', 0)}</div>
                    <div>Всички потребители</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">{stats.get('total_schools', 0)}</div>
                    <div>Всички агенции</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">{stats.get('pending_submissions', 0)}</div>
                    <div>Чакащи одобрение</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold;">98%</div>
                    <div>Активност</div>
                </div>
            </div>
            
            <!-- Main Dashboard -->
            <div class="grid grid-2">
                <div class="card">
                    <h2><i class="fas fa-user-edit"></i> Редактиране на профил</h2>
                    <form id="profileForm">
                        <div class="form-group">
                            <label for="email">Email адрес</label>
                            <input type="email" id="email" value="{user['email']}" disabled style="background: #f8f9fa;">
                        </div>
                        <div class="form-group">
                            <label for="currentPassword">Текуща парола</label>
                            <input type="password" id="currentPassword">
                        </div>
                        <div class="form-group">
                            <label for="newPassword">Нова парола</label>
                            <input type="password" id="newPassword">
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Потвърди новата парола</label>
                            <input type="password" id="confirmPassword">
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Запази промените
                        </button>
                    </form>
                </div>
                
                <div class="card">
                    <h2><i class="fas fa-heart"></i> Моите оценки</h2>
                    <p>Вие сте дали <strong>{stats.get('ratings_given', 0)}</strong> оценки до момента.</p>
                    <div style="margin-top: 2rem;">
                        <a href="/add-activity" class="btn" style="background: #e67e22; color: white; margin-bottom: 1rem; width: 100%; display: block; text-align: center; text-decoration: none;">
                            <i class="fas fa-plus"></i> Добави агенция
                        </a>
                        <a href="/agencies" class="btn" style="background: #f39c12; color: white; margin-bottom: 1rem; width: 100%; display: block; text-align: center; text-decoration: none;">
                            <i class="fas fa-star"></i> Оценете агенция
                        </a>
                        <a href="/activities" class="btn" style="background: #3498db; color: white; width: 100%; display: block; text-align: center; text-decoration: none;">
                            <i class="fas fa-search"></i> Търсете дейности
                        </a>
                    </div>
                    <div style="margin-top: 2rem;">
                        <h3>Бързи действия:</h3>
                        <ul style="margin-top: 1rem;">
                            <li><a href="/add-activity">Предложи нова агенция</a></li>
                            <li><a href="/activities">Виж всички дейности</a></li>
                            <li><a href="/agencies">Намери агенции в моя град</a></li>
                        </ul>
                    </div>
                    ''' if user['role'] == 'parent' else f'''
                    <h2><i class="fas fa-building"></i> Моите агенции</h2>
                    <p>Вие управлявате <strong>{stats.get('schools_managed', 0)}</strong> агенции.</p>
                    <div style="margin-top: 2rem;">
                        <a href="/manage-agency" class="btn" style="background: #2ecc71; color: white; margin-bottom: 1rem; width: 100%; display: block; text-align: center; text-decoration: none;">
                            <i class="fas fa-cog"></i> Управлявай агенции
                        </a>
                        <a href="/add-activity" class="btn" style="background: #3498db; color: white; width: 100%; display: block; text-align: center; text-decoration: none;">
                            <i class="fas fa-plus"></i> Добави дейност
                        </a>
                    </div>
                    <div style="margin-top: 2rem;">
                        <h3>Бързи действия:</h3>
                        <ul style="margin-top: 1rem;">
                            <li><a href="/manage-agency">Управление на агенции</a></li>
                            <li><a href="/agencies">Всички агенции</a></li>
                            <li><a href="/activities">Всички дейности</a></li>
                        </ul>
                    </div>
                    ''' if user['role'] == 'school' else f'''
                    <h2><i class="fas fa-users-cog"></i> Администрация</h2>
                    <p>Системна статистика и управление.</p>
                    <div style="margin-top: 2rem;">
                        <a href="#moderation" onclick="document.querySelector('h2[title*=Модериране]').scrollIntoView()" class="btn" style="background: #e67e22; color: white; margin-bottom: 1rem; width: 100%; display: block; text-align: center; text-decoration: none;">
                            <i class="fas fa-clipboard-check"></i> Модериране ({stats.get('pending_submissions', 0)})
                        </a>
                        <button class="btn" style="background: #34495e; color: white; margin-bottom: 1rem; width: 100%;">
                            <i class="fas fa-users"></i> Управление на потребители
                        </button>
                        <button class="btn" style="background: #e74c3c; color: white; width: 100%;">
                            <i class="fas fa-chart-line"></i> Системни отчети
                        </button>
                    </div>
                    <div style="margin-top: 2rem;">
                        <h3>Админ функции:</h3>
                        <ul style="margin-top: 1rem;">
                            <li><a href="#moderation" onclick="document.querySelector('h2[title*=Модериране]').scrollIntoView()">Модериране на предложения</a></li>
                            <li><a href="/agencies">Всички агенции</a></li>
                            <li><a href="/activities">Всички дейности</a></li>
                        </ul>
                    </div>
                </div>
            </div>'''
        
        # Add admin moderation panel for pending submissions
        if user['role'] == 'admin':
            # Get pending submissions
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            cursor.execute('''
            SELECT sa.id, sa.activity_name, sa.school_name, sa.category, sa.city, 
                   sa.description, sa.contact_info, sa.created_at, u.email
            FROM submitted_activities sa
            JOIN users u ON sa.submitted_by = u.id
            WHERE sa.status = 'pending'
            ORDER BY sa.created_at DESC
            ''')
            pending_submissions = cursor.fetchall()
            conn.close()
            
            # Build moderation panel HTML
            moderation_html = f'''
            
            <!-- Admin Moderation Panel -->
            <div class="card">
                <h2><i class="fas fa-clipboard-check"></i> Модериране на предложения ({len(pending_submissions)})</h2>
                '''
            
            if len(pending_submissions) == 0:
                moderation_html += '''
                <div style="color: #7f8c8d; padding: 2rem; text-align: center; border: 2px dashed #e1e5e9; border-radius: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem; color: #2ecc71;"></i>
                    <p>Няма чакащи предложения за одобрение</p>
                </div>'''
            else:
                for sub in pending_submissions:
                    moderation_html += f'''
                <div class="submission-item" style="border: 1px solid #e1e5e9; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; background: #f8f9fa;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0; color: #2c3e50;">{sub[1]}</h3>
                            <p style="margin: 0.5rem 0; color: #7f8c8d;"><strong>Агенция:</strong> {sub[2]}</p>
                            <span style="background: #3498db; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">{sub[3]}</span>
                        </div>
                        <div style="text-align: right; color: #7f8c8d; font-size: 0.9rem;">
                            <div><i class="fas fa-map-marker-alt"></i> {sub[4]}</div>
                            <div><i class="fas fa-user"></i> {sub[8]}</div>
                            <div><i class="fas fa-clock"></i> {sub[7][:16]}</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <p style="margin-bottom: 0.5rem;"><strong>Описание:</strong></p>
                        <p style="color: #555; line-height: 1.4;">{sub[5] or 'Няма описание'}</p>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <p style="margin-bottom: 0.5rem;"><strong>Контакти:</strong></p>
                        <p style="color: #555; background: white; padding: 0.5rem; border-radius: 5px; border: 1px solid #e1e5e9;">{sub[6] or 'Няма информация'}</p>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="moderateSubmission('{sub[0]}', 'approve')" 
                                class="btn" style="background: #27ae60; color: white; flex: 1;">
                            <i class="fas fa-check"></i> Одобри
                        </button>
                        <button onclick="moderateSubmission('{sub[0]}', 'reject')" 
                                class="btn" style="background: #e74c3c; color: white; flex: 1;">
                            <i class="fas fa-times"></i> Отхвърли
                        </button>
                    </div>
                </div>'''
            
            moderation_html += '''
            </div>
            '''
            
            body_content += moderation_html
        
        body_content += f'''
            
            <!-- Recent Activity (placeholder) -->
            <div class="card">
                <h2><i class="fas fa-clock"></i> Последна активност</h2>
                <div style="color: #7f8c8d; padding: 2rem; text-align: center; border: 2px dashed #e1e5e9; border-radius: 10px;">
                    <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>Тук ще видите историята на вашата активност в платформата</p>
                </div>
            </div>
        </div>
        '''
        
        js_code = '''
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!currentPassword) {
                alert('Моля, въведете текущата си парола');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('Новите пароли не съвпадат');
                return;
            }
            
            if (newPassword && newPassword.length < 6) {
                alert('Новата парола трябва да е поне 6 символа');
                return;
            }
            
            // Placeholder - would submit to server
            alert('Функционалността за смяна на парола ще бъде добавена скоро!');
        });
        
        // Admin moderation functions
        async function moderateSubmission(submissionId, action) {
            if (!confirm(`Сигурни ли сте, че искате да ${action === 'approve' ? 'одобрите' : 'отхвърлите'} това предложение?`)) {
                return;
            }
            
            try {
                const response = await fetch('/api/moderate-submission', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        submission_id: submissionId,
                        action: action
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(result.message);
                    location.reload(); // Reload to update the list
                } else {
                    alert('Грешка: ' + result.error);
                }
            } catch (error) {
                alert('Грешка при изпращане на заявката');
                console.error(error);
            }
        }
        '''
        
        html = self.get_base_html("Профил", body_content, extra_js=js_code)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def handle_login(self):
        """Handle login POST request with rate limiting."""
        
        # Rate limiting - 10 login attempts per 15 minutes per IP
        if not self.check_rate_limit('login', max_requests=10, window_seconds=900):
            return
            
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(post_data)
            email = SecurityValidator.sanitize_input(data.get('email', '').strip().lower(), 254)
            password = data.get('password', '')
            
            # Enhanced validation
            if not email or not password:
                self.send_json_response({'error': 'Email и парола са задължителни'}, 400)
                return
                
            if not SecurityValidator.validate_email(email):
                self.send_json_response({'error': 'Невалиден email адрес'}, 400)
                return
            
            # Hash password and check against database
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            cursor.execute('SELECT id, email, role FROM users WHERE email = ? AND password_hash = ?', 
                          (email, password_hash))
            user = cursor.fetchone()
            conn.close()
            
            if user:
                # Set session cookie
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Set-Cookie', f'session_id={user[0]}; Path=/; HttpOnly')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            else:
                self.send_json_response({'error': 'Невалиден email или парола'}, 401)
                
        except json.JSONDecodeError:
            self.send_json_response({'error': 'Невалиден формат на данните'}, 400)

    def handle_rating(self):
        """Handle rating submission."""
        user = self.get_current_user()
        
        if not user or user['role'] != 'parent':
            self.send_json_response({'error': 'Само родители могат да дават оценки'}, 403)
            return
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(post_data)
            school_name = data.get('school_name')
            rating = data.get('rating')
            comment = data.get('comment', '')
            
            if not school_name or not rating:
                self.send_json_response({'error': 'Име на агенция и оценка са задължителни'}, 400)
                return
            
            if not (1 <= rating <= 5):
                self.send_json_response({'error': 'Оценката трябва да е между 1 и 5'}, 400)
                return
            
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            # Get school by name
            cursor.execute('SELECT id FROM schools WHERE name = ?', (school_name,))
            school = cursor.fetchone()
            
            if not school:
                conn.close()
                self.send_json_response({'error': 'Агенцията не е намерена'}, 404)
                return
            
            school_id = school[0]
            
            # Check if user already rated this school
            cursor.execute('SELECT id FROM ratings WHERE school_id = ? AND parent_id = ?', 
                          (school_id, user['id']))
            existing = cursor.fetchone()
            
            if existing:
                # Update existing rating
                cursor.execute('''
                UPDATE ratings 
                SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP 
                WHERE id = ?
                ''', (rating, comment, existing[0]))
            else:
                # Create new rating
                rating_id = str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO ratings (id, school_id, parent_id, rating, comment)
                VALUES (?, ?, ?, ?, ?)
                ''', (rating_id, school_id, user['id'], rating, comment))
            
            conn.commit()
            conn.close()
            
            self.send_json_response({'success': True})
            
        except json.JSONDecodeError:
            self.send_json_response({'error': 'Невалиден формат на данните'}, 400)
        except Exception as e:
            self.send_json_response({'error': 'Грешка при запазване на оценката'}, 500)

    def handle_logout(self):
        """Handle logout request."""
        self.send_response(302)
        self.send_header('Set-Cookie', 'session_id=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        self.send_header('Location', '/')
        self.end_headers()

    def serve_activities_api(self):
        """Serve activities data as JSON."""
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT a.title, a.category, a.age_min, a.age_max, a.price_monthly,
               s.name as school_name, s.city, s.phone, s.email as website, s.address,
               n.name as neighborhood
        FROM activities a
        JOIN schools s ON a.school_id = s.id
        LEFT JOIN neighborhoods n ON s.neighborhood_id = n.id
        ORDER BY s.city, s.name
        ''')
        
        activities = []
        for row in cursor.fetchall():
            activities.append({
                'title': row[0],
                'category': row[1],
                'age_min': row[2],
                'age_max': row[3],
                'price_monthly': row[4],
                'school_name': row[5],
                'city': row[6],
                'phone': row[7],
                'website': row[8],
                'address': row[9],
                'neighborhood': row[10]
            })
        
        conn.close()
        self.send_json_response(activities)

    def serve_schools_api(self):
        """Serve schools data as JSON."""
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT s.name, s.city, s.phone, s.email, s.address,
               COUNT(a.id) as activity_count
        FROM schools s
        LEFT JOIN activities a ON s.id = a.school_id
        GROUP BY s.id
        ORDER BY s.city, s.name
        ''')
        
        schools = []
        for row in cursor.fetchall():
            schools.append({
                'name': row[0],
                'city': row[1], 
                'phone': row[2],
                'website': row[3],
                'address': row[4],
                'activity_count': row[5]
            })
        
        conn.close()
        self.send_json_response(schools)

    def serve_cities_api(self):
        """Serve unique cities as JSON."""
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT DISTINCT city FROM schools ORDER BY city')
        cities = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        self.send_json_response(cities)

    def serve_ratings_api(self):
        """Serve ratings data as JSON."""
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        # Create ratings table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS ratings (
            id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            parent_id TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (school_id) REFERENCES schools (id),
            FOREIGN KEY (parent_id) REFERENCES users (id)
        )
        ''')
        
        cursor.execute('''
        SELECT r.rating, r.comment, r.created_at, s.name as school_name, u.email as parent_email
        FROM ratings r
        JOIN schools s ON r.school_id = s.id
        JOIN users u ON r.parent_id = u.id
        ORDER BY r.created_at DESC
        ''')
        
        ratings = []
        for row in cursor.fetchall():
            ratings.append({
                'rating': row[0],
                'comment': row[1],
                'created_at': row[2],
                'school_name': row[3],
                'parent_email': row[4]
            })
        
        conn.close()
        self.send_json_response(ratings)

    def serve_add_activity_page(self):
        """Serve page for parents to submit new activities."""
        user = self.get_current_user()
        
        if not user or user['role'] != 'parent':
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            return
        
        body_content = '''
        <div class="container">
            <div class="card">
                <h2><i class="fas fa-plus-circle"></i> Предложи нова дейност</h2>
                <p style="color: #666; margin-bottom: 2rem;">Знаеш ли за интересна дейност, която не е добавена в платформата? Сподели я с нас!</p>
                
                <form id="activityForm">
                    <div class="form-group">
                        <label for="activity_name">Име на дейността *</label>
                        <input type="text" id="activity_name" name="activity_name" required 
                               placeholder="напр. Програмиране за деца">
                    </div>
                    
                    <div class="form-group">
                        <label for="school_name">Име на училището/агенцията *</label>
                        <input type="text" id="school_name" name="school_name" required 
                               placeholder="напр. MindHub Kids">
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Категория *</label>
                        <select id="category" name="category" required>
                            <option value="">Изберете категория</option>
                            <option value="Програмиране">Програмиране</option>
                            <option value="Роботика">Роботика</option>
                            <option value="Изкуство">Изкуство</option>
                            <option value="Спорт">Спорт</option>
                            <option value="Музика">Музика</option>
                            <option value="Езици">Езици</option>
                            <option value="Математика">Математика</option>
                            <option value="Други">Други</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="city">Град *</label>
                        <input type="text" id="city" name="city" required 
                               placeholder="напр. София">
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Описание</label>
                        <textarea id="description" name="description" 
                                  placeholder="Разкажете повече за дейността..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Предложи дейност
                    </button>
                </form>
                
                <div id="message" style="margin-top: 1rem; padding: 1rem; border-radius: 5px; display: none;"></div>
            </div>
        </div>
        '''
        
        extra_js = '''
        document.getElementById('activityForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/submit-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                const messageDiv = document.getElementById('message');
                
                if (response.ok) {
                    messageDiv.style.backgroundColor = '#d4edda';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.border = '1px solid #c3e6cb';
                    messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> ' + result.message;
                    e.target.reset();
                } else {
                    messageDiv.style.backgroundColor = '#f8d7da';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.border = '1px solid #f5c6cb';
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + result.error;
                }
                
                messageDiv.style.display = 'block';
                setTimeout(() => messageDiv.style.display = 'none', 5000);
                
            } catch (error) {
                console.error('Error:', error);
            }
        });
        '''
        
        html = self.get_base_html("Добави дейност", body_content, extra_js=extra_js)
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_add_teacher_page(self):
        """Serve page for parents to add/recommend teachers."""
        user = self.get_current_user()
        
        if not user or user['role'] != 'parent':
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            return
        
        body_content = '''
        <div class="container">
            <div class="card">
                <h2><i class="fas fa-user-plus"></i> Препоръчай учител</h2>
                <p style="color: #666; margin-bottom: 2rem;">Знаете ли отличен учител или треньор? Споделете го с общността!</p>
                
                <form id="teacherForm">
                    <div class="form-group">
                        <label for="teacher_name">Име на учителя *</label>
                        <input type="text" id="teacher_name" name="teacher_name" required 
                               placeholder="напр. Мария Иванова">
                    </div>
                    
                    <div class="form-group">
                        <label for="specialization">Специализация *</label>
                        <select id="specialization" name="specialization" required>
                            <option value="">Изберете специализация</option>
                            <option value="Програмиране">Програмиране</option>
                            <option value="Роботика">Роботика</option>
                            <option value="Математика">Математика</option>
                            <option value="Изкуство">Изкуство</option>
                            <option value="Музика">Музика</option>
                            <option value="Спорт">Спорт</option>
                            <option value="Езици">Езици</option>
                            <option value="Танци">Танци</option>
                            <option value="Други">Други</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="city">Град *</label>
                        <input type="text" id="city" name="city" required 
                               placeholder="напр. София">
                    </div>
                    
                    <div class="form-group">
                        <label for="personal_recommendation">Вашата препоръка *</label>
                        <textarea id="personal_recommendation" name="personal_recommendation" required
                                  placeholder="Защо препоръчвате този учител? Какъв е вашият опит?"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="initial_rating">Вашата оценка *</label>
                        <div class="star-rating" id="starRating">
                            <span class="star" data-rating="1">★</span>
                            <span class="star" data-rating="2">★</span>
                            <span class="star" data-rating="3">★</span>
                            <span class="star" data-rating="4">★</span>
                            <span class="star" data-rating="5">★</span>
                        </div>
                        <input type="hidden" id="rating" name="rating" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-heart"></i> Препоръчай учител
                    </button>
                </form>
                
                <div id="message" style="margin-top: 1rem; padding: 1rem; border-radius: 5px; display: none;"></div>
            </div>
        </div>
        '''
        
        extra_css = '''
        .star-rating { display: flex; gap: 0.2rem; margin-bottom: 1rem; }
        .star { font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.2s; }
        .star.active, .star:hover { color: #ffc107; }
        '''
        
        extra_js = '''
        // Star rating functionality
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                ratingInput.value = rating;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.style.color = '#ffc107';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });
        
        document.querySelector('.star-rating').addEventListener('mouseleave', function() {
            const currentRating = ratingInput.value;
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });

        // Form submission
        document.getElementById('teacherForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            if (!data.rating) {
                alert('Моля поставете оценка на учителя!');
                return;
            }
            
            try {
                const response = await fetch('/api/submit-teacher', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                const messageDiv = document.getElementById('message');
                
                if (response.ok) {
                    messageDiv.style.backgroundColor = '#d4edda';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.border = '1px solid #c3e6cb';
                    messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> ' + result.message;
                    e.target.reset();
                    ratingInput.value = '';
                    stars.forEach(s => s.classList.remove('active'));
                } else {
                    messageDiv.style.backgroundColor = '#f8d7da';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.border = '1px solid #f5c6cb';
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + result.error;
                }
                
                messageDiv.style.display = 'block';
                setTimeout(() => messageDiv.style.display = 'none', 5000);
                
            } catch (error) {
                console.error('Error:', error);
            }
        });
        '''
        
        html = self.get_base_html("Добави учител", body_content, extra_css=extra_css, extra_js=extra_js)
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def handle_activity_submission(self):
        """Handle parent activity submission with security measures."""
        user = self.require_role(['parent'])
        if not user:
            return
            
        # Rate limiting - 3 submissions per hour per user
        client_ip = self.get_client_ip()
        if not self.check_rate_limit(f'submit_activity_{user["id"]}', max_requests=3, window_seconds=3600):
            return
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Sanitize and validate required fields
            required_fields = ['activity_name', 'school_name', 'category', 'city']
            sanitized_data = {}
            
            for field in required_fields:
                value = SecurityValidator.sanitize_input(data.get(field, '').strip(), 200)
                if not value:
                    self.send_json_response({'error': f'Полето {field} е задължително'})
                    return
                
                # Check for spam patterns
                if SecurityValidator.detect_spam_patterns(value):
                    self.send_json_response({'error': 'Неуместно съдържание в полето ' + field}, 400)
                    return
                    
                sanitized_data[field] = value
            
            # Sanitize optional fields
            description = SecurityValidator.sanitize_input(data.get('description', ''), 2000)
            if description and SecurityValidator.detect_spam_patterns(description):
                self.send_json_response({'error': 'Неуместно съдържание в описанието'}, 400)
                return
            
            sanitized_data['description'] = description
            
            # Create tables if they don't exist
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS submitted_activities (
                id TEXT PRIMARY KEY,
                submitted_by TEXT NOT NULL,
                activity_name TEXT NOT NULL,
                school_name TEXT NOT NULL,
                category TEXT NOT NULL,
                city TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            ''')
            
            # Save activity with sanitized data
            activity_id = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO submitted_activities 
            (id, submitted_by, activity_name, school_name, category, city, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (activity_id, user['id'], sanitized_data['activity_name'], sanitized_data['school_name'],
                  sanitized_data['category'], sanitized_data['city'], sanitized_data['description']))
            
            conn.commit()
            conn.close()
            
            self.send_json_response({
                'success': True, 
                'message': 'Благодарим! Вашето предложение за дейност беше получено и ще бъде прегледано скоро.'
            })
            
        except Exception as e:
            self.send_json_response({'error': f'Грешка при запазване: {str(e)}'})

    def handle_teacher_submission(self):
        """Handle parent teacher submission."""
        user = self.get_current_user()
        
        if not user or user['role'] != 'parent':
            self.send_json_response({'error': 'Само родители могат да добавят учители'}, 403)
            return
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['teacher_name', 'specialization', 'city', 'personal_recommendation', 'rating']
            for field in required_fields:
                if not data.get(field):
                    self.send_json_response({'error': f'Полето {field} е задължително'})
                    return
            
            # Create tables if they don't exist
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS teachers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                specialization TEXT NOT NULL,
                city TEXT NOT NULL,
                submitted_by TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS teacher_ratings (
                id TEXT PRIMARY KEY,
                teacher_id TEXT NOT NULL,
                parent_id TEXT NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                recommendation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            ''')
            
            # Save teacher
            teacher_id = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO teachers (id, name, specialization, city, submitted_by)
            VALUES (?, ?, ?, ?, ?)
            ''', (teacher_id, data['teacher_name'], data['specialization'],
                  data['city'], user['id']))
            
            # Save initial rating
            rating_id = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO teacher_ratings (id, teacher_id, parent_id, rating, recommendation)
            VALUES (?, ?, ?, ?, ?)
            ''', (rating_id, teacher_id, user['id'], int(data['rating']), data['personal_recommendation']))
            
            conn.commit()
            conn.close()
            
            self.send_json_response({
                'success': True,
                'message': 'Благодарим! Учителят беше добавен успешно заедно с вашата препоръка.'
            })
            
        except Exception as e:
            self.send_json_response({'error': f'Грешка при запазване: {str(e)}'})

    def handle_moderate_submission(self):
        """Handle admin moderation of submitted activities."""
        user = self.require_role(['admin'])
        if not user:
            return
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            submission_id = data.get('submission_id')
            action = data.get('action')  # 'approve' or 'reject'
            
            if not submission_id or not action:
                self.send_json_response({'error': 'Липсват задължителни параметри'}, 400)
                return
                
            if action not in ['approve', 'reject']:
                self.send_json_response({'error': 'Невалидно действие'}, 400)
                return
            
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            # Check if submission exists and is pending
            cursor.execute("SELECT * FROM submitted_activities WHERE id = ? AND status = 'pending'", (submission_id,))
            submission = cursor.fetchone()
            
            if not submission:
                self.send_json_response({'error': 'Предложението не е намерено или вече е обработено'}, 404)
                return
            
            if action == 'approve':
                # Move from submitted_activities to schools/activities tables
                # First create/find the school
                school_id = str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO schools (id, name, description, city, verified, created_by)
                VALUES (?, ?, ?, ?, 1, ?)
                ''', (school_id, submission[3], submission[9] or '', submission[5], user['id']))
                
                # Then create the activity
                activity_id = str(uuid.uuid4())
                cursor.execute('''
                INSERT INTO activities (id, school_id, title, description, category, age_min, age_max, 
                                      active, verified, created_by, source)
                VALUES (?, ?, ?, ?, ?, 3, 18, 1, 1, ?, 'parent')
                ''', (activity_id, school_id, submission[2], submission[9] or '', submission[4], user['id']))
                
                # Update submission status
                cursor.execute("UPDATE submitted_activities SET status = 'approved' WHERE id = ?", (submission_id,))
                
                message = 'Предложението беше одобрено и добавено в системата'
                
            else:  # reject
                cursor.execute("UPDATE submitted_activities SET status = 'rejected' WHERE id = ?", (submission_id,))
                message = 'Предложението беше отхвърлено'
            
            conn.commit()
            conn.close()
            
            self.send_json_response({'success': True, 'message': message})
            
        except Exception as e:
            self.send_json_response({'error': f'Системна грешка: {str(e)}'}, 500)

    def handle_registration(self):
        """Handle public user registration with security measures."""
        
        # Rate limiting - 5 registrations per 15 minutes per IP
        if not self.check_rate_limit('register', max_requests=5, window_seconds=900):
            return
            
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Honeypot check - if filled, it's a bot
            if data.get('website') or data.get('url') or data.get('phone'):
                # Silent fail for bots
                time.sleep(2)  # Delay to waste bot time
                self.send_json_response({'success': True, 'message': 'Регистрацията беше успешна!'})
                return
            
            # Basic timing attack protection
            form_timestamp = data.get('timestamp')
            if form_timestamp:
                try:
                    timestamp = int(form_timestamp) / 1000  # Convert from milliseconds
                    form_age = time.time() - timestamp
                    
                    # Form filled too quickly (likely a bot) or too slowly (session expired)
                    if form_age < 3 or form_age > 3600:  # 3 seconds to 1 hour
                        self.send_json_response({'error': 'Формата изтече. Моля, опитайте отново.'}, 400)
                        return
                except (ValueError, TypeError):
                    self.send_json_response({'error': 'Невалидна форма'}, 400)
                    return
            
            # Get and sanitize inputs
            email = SecurityValidator.sanitize_input(data.get('email', '').strip().lower(), 254)
            password = data.get('password', '')
            role = data.get('role', '').strip()
            eik = SecurityValidator.sanitize_input(data.get('eik', '').strip(), 13)
            
            # Enhanced validation
            if not email or not password or not role:
                self.send_json_response({'error': 'Всички полета са задължителни'}, 400)
                return
            
            # Email validation
            if not SecurityValidator.validate_email(email):
                self.send_json_response({'error': 'Невалиден email адрес'}, 400)
                return
            
            # Password validation
            is_valid_password, password_error = SecurityValidator.validate_password(password)
            if not is_valid_password:
                self.send_json_response({'error': password_error}, 400)
                return
                
            # Role validation
            if role not in ['parent', 'agency']:
                self.send_json_response({'error': 'Невалидна роля'}, 400)
                return
                
            # Convert 'agency' to 'school' for database compatibility
            if role == 'agency':
                role = 'school'
            
            # EIK validation
            if eik and not SecurityValidator.validate_eik(eik):
                self.send_json_response({'error': 'ЕИК трябва да съдържа между 9 и 13 цифри'}, 400)
                return
            
            # Spam detection
            if SecurityValidator.detect_spam_patterns(email):
                # Silent fail for spam
                time.sleep(2)
                self.send_json_response({'error': 'Регистрацията не може да бъде завършена в момента'}, 400)
                return
            
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            # Update users table schema for new fields
            cursor.execute('''
            ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending'
            ''')
            
            cursor.execute('''
            ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0
            ''')
            
            cursor.execute('''
            ALTER TABLE users ADD COLUMN eik TEXT
            ''')
            
            cursor.execute('''
            ALTER TABLE users ADD COLUMN verification_token TEXT
            ''')
            
        except sqlite3.OperationalError as e:
            # Columns may already exist
            if "duplicate column name" not in str(e).lower():
                self.send_json_response({'error': f'Database error: {str(e)}'}, 500)
                return
        
        try:
            # Check if email already exists
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                self.send_json_response({'error': 'Email адресът вече е регистриран'}, 400)
                return
            
            # Generate verification token
            verification_token = str(uuid.uuid4())
            
            # Hash password
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            # Create new user with pending status
            user_id = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO users (id, email, password_hash, role, status, email_verified, 
                             eik, verification_token, created_at)
            VALUES (?, ?, ?, ?, 'pending', 0, ?, ?, datetime('now'))
            ''', (user_id, email, password_hash, role, eik or None, verification_token))
            
            conn.commit()
            conn.close()
            
            # TODO: Send email verification (for now, we'll auto-verify)
            # In production, you'd send an email with the verification_token
            
            # For demo purposes, immediately verify the user
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            cursor.execute('''
            UPDATE users SET status = 'active', email_verified = 1 
            WHERE id = ?
            ''', (user_id,))
            conn.commit()
            conn.close()
            
            self.send_json_response({
                'success': True, 
                'message': f'Профилът беше създаден успешно! Можете да влезете с вашия email.',
                'user_id': user_id
            })
            
        except Exception as e:
            self.send_json_response({'error': f'Грешка при регистрация: {str(e)}'}, 500)

    def serve_agency_management_page(self):
        """Serve agency management page for school users."""
        user = self.require_role(['school'])
        if not user:
            return
            
        # Get user's managed agencies
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT id, name, description, city, address, phone, email, verified
        FROM schools WHERE created_by = ?
        ORDER BY created_at DESC
        ''', (user['id'],))
        
        user_agencies = cursor.fetchall()
        
        # Create claims table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_agency_claims (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            agency_id TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Get unclaimed agencies that this user could claim (matching email domain or similar)
        cursor.execute('''
        SELECT id, name, description, city, address, phone, email
        FROM schools WHERE created_by != ? AND id NOT IN (
            SELECT agency_id FROM user_agency_claims WHERE user_id = ?
        )
        ORDER BY name
        LIMIT 10
        ''', (user['id'], user['id']))
        
        available_agencies = cursor.fetchall()
        
        conn.close()
        
        html_content = f'''
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управление на агенции - Skillio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    {self.get_base_css()}
</head>
<body>
    {self.get_header()}
    
    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-building"></i> Управление на агенции</h1>
            <p>Управлявайте вашите агенции и заявете ownership на съществуващи</p>
        </div>
        
        <!-- Your Agencies -->
        <div class="card">
            <h2><i class="fas fa-star"></i> Вашите агенции ({len(user_agencies)})</h2>
            
            {'''<div style="color: #7f8c8d; padding: 2rem; text-align: center; border: 2px dashed #e1e5e9; border-radius: 10px;">
                <i class="fas fa-building" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Все още не управлявате нито една агенция</p>
                <p><small>Можете да заявите ownership на съществуваща агенция отдолу</small></p>
            </div>''' if len(user_agencies) == 0 else ''}
            
            {''.join([f'''
            <div class="agency-item" style="border: 1px solid #e1e5e9; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; background: #f8f9fa;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #2c3e50;">
                            {agency[1]} 
                            {f'<i class="fas fa-check-circle" style="color: #27ae60; margin-left: 0.5rem;" title="Верифицирана"></i>' if agency[7] else ''}
                        </h3>
                        <p style="color: #7f8c8d; margin-bottom: 1rem;"><i class="fas fa-map-marker-alt"></i> {agency[3]}</p>
                        <p style="color: #555; line-height: 1.4;">{agency[2] or 'Няма описание'}</p>
                        
                        <div style="margin-top: 1rem;">
                            <span style="background: #3498db; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem;">
                                <i class="fas fa-phone"></i> {agency[5] or 'Няма телефон'}
                            </span>
                            <span style="background: #e74c3c; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                                <i class="fas fa-envelope"></i> {agency[6] or 'Няма email'}
                            </span>
                        </div>
                    </div>
                    
                    <div style="margin-left: 2rem;">
                        <button onclick="editAgency('{agency[0]}')" class="btn" style="background: #3498db; color: white; margin-bottom: 0.5rem;">
                            <i class="fas fa-edit"></i> Редактиraj
                        </button>
                        <br>
                        <button onclick="viewStats('{agency[0]}')" class="btn" style="background: #f39c12; color: white;">
                            <i class="fas fa-chart-bar"></i> Статистики
                        </button>
                    </div>
                </div>
            </div>
            ''' for agency in user_agencies])}
        </div>
        
        <!-- Available Agencies to Claim -->
        <div class="card">
            <h2><i class="fas fa-hand-paper"></i> Заявете ownership на агенция</h2>
            <p style="color: #7f8c8d; margin-bottom: 2rem;">Ако вашата агенция е в системата, но не я управлявате, можете да заявите ownership</p>
            
            {'''<div style="color: #7f8c8d; padding: 2rem; text-align: center; border: 2px dashed #e1e5e9; border-radius: 10px;">
                <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem; color: #2ecc71;"></i>
                <p>Няма налични агенции за заявяване в момента</p>
            </div>''' if len(available_agencies) == 0 else ''}
            
            {''.join([f'''
            <div class="claim-item" style="border: 1px solid #e1e5e9; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #2c3e50;">{agency[1]}</h3>
                        <p style="color: #7f8c8d; margin-bottom: 1rem;"><i class="fas fa-map-marker-alt"></i> {agency[3]}</p>
                        <p style="color: #555; line-height: 1.4;">{agency[2] or 'Няма описание'}</p>
                        
                        <div style="margin-top: 1rem;">
                            <span style="background: #95a5a6; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem;">
                                <i class="fas fa-phone"></i> {agency[5] or 'Няма телефон'}
                            </span>
                            <span style="background: #95a5a6; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                                <i class="fas fa-envelope"></i> {agency[6] or 'Няма email'}
                            </span>
                        </div>
                    </div>
                    
                    <div style="margin-left: 2rem;">
                        <button onclick="claimAgency('{agency[0]}', '{agency[1]}')" class="btn" style="background: #e67e22; color: white;">
                            <i class="fas fa-hand-paper"></i> Заяви ownership
                        </button>
                    </div>
                </div>
            </div>
            ''' for agency in available_agencies])}
        </div>
    </div>'''
    
        # Add JavaScript separately to avoid f-string conflicts
        html_content += '''
    <script>
        async function claimAgency(agencyId, agencyName) {
            if (!confirm('Сигурни ли сте, че искате да заявите ownership на "' + agencyName + '"?\\n\\nАдминистраторите ще прегледат заявката ви.')) {
                return;
            }
            
            try {
                const response = await fetch('/api/claim-agency', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        agency_id: agencyId
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(result.message);
                    location.reload();
                } else {
                    alert('Грешка: ' + result.error);
                }
            } catch (error) {
                alert('Грешка при изпращане на заявката');
                console.error(error);
            }
        }
        
        function editAgency(agencyId) {
            // TODO: Implement edit modal or navigate to edit page
            alert('Edit функцията ще бъде добавена скоро!');
        }
        
        function viewStats(agencyId) {
            // TODO: Implement stats view
            alert('Статистиките ще бъдат добавени скоро!');
        }
    </script>
</body>
</html>
'''
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))

    def handle_agency_claim(self):
        """Handle agency ownership claim by school users."""
        user = self.require_role(['school'])
        if not user:
            return
            
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            agency_id = data.get('agency_id')
            
            if not agency_id:
                self.send_json_response({'error': 'Липсва ID на агенцията'}, 400)
                return
                
            conn = sqlite3.connect('activities.db')
            cursor = conn.cursor()
            
            # Check if agency exists
            cursor.execute('SELECT name FROM schools WHERE id = ?', (agency_id,))
            agency = cursor.fetchone()
            
            if not agency:
                self.send_json_response({'error': 'Агенцията не е намерена'}, 404)
                return
            
            # Create claims table if it doesn't exist
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_agency_claims (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                agency_id TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_by TEXT,
                reviewed_at TIMESTAMP
            )
            ''')
            
            # Check if already claimed
            cursor.execute('''
            SELECT id FROM user_agency_claims 
            WHERE user_id = ? AND agency_id = ? AND status = 'pending'
            ''', (user['id'], agency_id))
            
            if cursor.fetchone():
                self.send_json_response({'error': 'Вече сте заявили ownership на тази агенция'}, 400)
                return
            
            # Create claim
            claim_id = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO user_agency_claims (id, user_id, agency_id, status)
            VALUES (?, ?, ?, 'pending')
            ''', (claim_id, user['id'], agency_id))
            
            conn.commit()
            conn.close()
            
            self.send_json_response({
                'success': True,
                'message': f'Заявката за ownership на "{agency[0]}" беше изпратена успешно! Администраторите ще я прегледат.'
            })
            
        except Exception as e:
            self.send_json_response({'error': f'Грешка при заявката: {str(e)}'}, 500)

    def handle_agency_update(self):
        """Handle agency profile updates by school users."""
        user = self.require_role(['school'])
        if not user:
            return
            
        # TODO: Implement agency profile update functionality
        self.send_json_response({'error': 'Функцията ще бъде добавена скоро'}, 501)

    def serve_teachers_api(self):
        """Serve teachers data with ratings."""
        conn = sqlite3.connect('activities.db')
        cursor = conn.cursor()
        
        # Create tables if they don't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS teachers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            specialization TEXT NOT NULL,
            city TEXT NOT NULL,
            submitted_by TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        cursor.execute('''
        SELECT t.id, t.name, t.specialization, t.city,
               AVG(tr.rating) as avg_rating, COUNT(tr.rating) as rating_count
        FROM teachers t
        LEFT JOIN teacher_ratings tr ON t.id = tr.teacher_id
        WHERE t.status = 'active'
        GROUP BY t.id
        ORDER BY avg_rating DESC, rating_count DESC
        ''')
        
        teachers = []
        for row in cursor.fetchall():
            teachers.append({
                'id': row[0],
                'name': row[1],
                'specialization': row[2],
                'city': row[3],
                'avg_rating': round(row[4], 1) if row[4] else None,
                'rating_count': row[5]
            })
        
        conn.close()
        self.send_json_response(teachers)

    def send_json_response(self, data, status_code=200):
        """Send JSON response with security headers."""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.add_security_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

def setup_ratings_table():
    """Create ratings table if it doesn't exist."""
    conn = sqlite3.connect('activities.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ratings (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        parent_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools (id),
        FOREIGN KEY (parent_id) REFERENCES users (id)
    )
    ''')
    
    conn.commit()
    conn.close()

def main():
    # Setup database
    setup_ratings_table()
    
    # Get port from environment or default to 8080
    port = int(os.environ.get('PORT', 8080))
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SkillioHandler)
    print(f"🚀 Complete Skillio Platform running at http://0.0.0.0:{port}")
    print("🔗 All pages connected: Home, Activities, Agencies, About")
    print("⭐ Rating system enabled for parents")
    print("👤 Enhanced user profiles with role-based features")
    print("⏸️  Press Ctrl+C to stop")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
        httpd.server_close()

if __name__ == "__main__":
    main()