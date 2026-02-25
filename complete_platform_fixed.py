#!/usr/bin/env python3
"""
Complete Skillio Platform - Fixed version without f-string syntax errors
"""

import sqlite3
import json
import hashlib
import uuid
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from http.cookies import SimpleCookie
from datetime import datetime

class SkillioHandler(BaseHTTPRequestHandler):
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
        elif path == '/add-activity':
            self.serve_add_activity_page()
        elif path == '/add-teacher':
            self.serve_add_teacher_page()
        elif path == '/api/activities':
            self.serve_activities_api()
        elif path == '/api/schools':
            self.serve_schools_api()
        elif path == '/api/cities':
            self.serve_cities_api()
        elif path == '/api/ratings':
            self.serve_ratings_api()
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
        elif path == '/api/submit-activity':
            self.handle_activity_submission()
        elif path == '/api/submit-teacher':
            self.handle_teacher_submission()
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

    def get_base_html(self, title, body_content, extra_css="", extra_js=""):
        """Base HTML template with header and footer."""
        user = self.get_current_user()
        
        # Navigation links for parents
        parent_links = ""
        if user and user['role'] == 'parent':
            parent_links = '<li><a href="/add-activity">Добави дейност</a></li><li><a href="/add-teacher">Добави учител</a></li>'
        
        # Auth buttons
        auth_buttons = ""
        if user:
            auth_buttons = f'<a href="/profile" class="btn btn-secondary"><i class="fas fa-user"></i> Профил</a><a href="/logout" class="btn btn-primary">Изход</a>'
        else:
            auth_buttons = '<a href="/login" class="btn btn-secondary">Вход</a><a href="/login" class="btn btn-primary">Регистрация</a>'
        
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
                <li><a href="/">Начало</a></li>
                <li><a href="/activities">Дейности</a></li>
                <li><a href="/agencies">Агенции</a></li>
                <li><a href="/about">За нас</a></li>
                {parent_links}
            </ul>
            <div class="auth-buttons">
                {auth_buttons}
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
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;" id="totalSchools">36</div>
                    <div>Агенции</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;" id="totalActivities">120</div>
                    <div>Активности</div>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #ff8a80 0%, #ffcc80 100%); color: white;">
                    <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;" id="totalCities">16</div>
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
                    <div class="item-card">
                        <div class="card-header">
                            <h4>Роботика и програмиране</h4>
                        </div>
                        <div class="card-body">
                            <div class="location">
                                <i class="fas fa-map-marker-alt"></i>
                                София
                            </div>
                            <div style="font-weight: bold;">MindHub</div>
                            <div style="color: #f39c12; font-weight: bold; margin-top: 0.5rem;">
                                80 лв./месец
                            </div>
                        </div>
                    </div>
                    <div class="item-card">
                        <div class="card-header">
                            <h4>Математическо училище</h4>
                        </div>
                        <div class="card-body">
                            <div class="location">
                                <i class="fas fa-map-marker-alt"></i>
                                Пловдив
                            </div>
                            <div style="font-weight: bold;">SmartyKids</div>
                            <div style="color: #f39c12; font-weight: bold; margin-top: 0.5rem;">
                                60 лв./месец
                            </div>
                        </div>
                    </div>
                    <div class="item-card">
                        <div class="card-header">
                            <h4>Творчески център</h4>
                        </div>
                        <div class="card-body">
                            <div class="location">
                                <i class="fas fa-map-marker-alt"></i>
                                Варна
                            </div>
                            <div style="font-weight: bold;">ArtSpace</div>
                            <div style="color: #f39c12; font-weight: bold; margin-top: 0.5rem;">
                                45 лв./месец
                            </div>
                        </div>
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
        
        html = self.get_base_html("Начало", body_content)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_activities_page(self):
        """Serve activities page with search and filters."""
        body_content = '''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-graduation-cap"></i> Всички дейности</h1>
                <p>Открийте най-подходящите дейности за вашето дете</p>
            </div>
            
            <!-- Sample Activities -->
            <div class="grid grid-2">
                <div class="item-card">
                    <div class="card-header">
                        <h3>Роботика за деца</h3>
                        <div style="opacity: 0.9;">MindHub София</div>
                    </div>
                    <div class="card-body">
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            София, Витоша
                        </div>
                        <div class="category">Роботика и програмиране</div>
                        
                        <div class="rating-summary" style="margin-bottom: 1rem;">
                            <div class="stars">
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star">*</span>
                            </div>
                            <span class="rating-count">(24 отзива)</span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div style="text-align: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #7f8c8d;">Възраст</div>
                                <div style="font-weight: bold;">8-14 г.</div>
                            </div>
                            <div style="text-align: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #7f8c8d;">Цена</div>
                                <div style="font-weight: bold; color: #f39c12;">80 лв.</div>
                            </div>
                        </div>
                        
                        <div style="border-top: 1px solid #e1e5e9; padding-top: 1rem;">
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>+359 888 123 456</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-globe"></i>
                                <a href="https://mindhub.bg" target="_blank">Уебсайт</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="item-card">
                    <div class="card-header">
                        <h3>Математическо училище</h3>
                        <div style="opacity: 0.9;">SmartyKids Пловдив</div>
                    </div>
                    <div class="card-body">
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            Пловдив, Център
                        </div>
                        <div class="category">Математика</div>
                        
                        <div class="rating-summary" style="margin-bottom: 1rem;">
                            <div class="stars">
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                            </div>
                            <span class="rating-count">(18 отзива)</span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div style="text-align: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #7f8c8d;">Възраст</div>
                                <div style="font-weight: bold;">6-12 г.</div>
                            </div>
                            <div style="text-align: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #7f8c8d;">Цена</div>
                                <div style="font-weight: bold; color: #f39c12;">60 лв.</div>
                            </div>
                        </div>
                        
                        <div style="border-top: 1px solid #e1e5e9; padding-top: 1rem;">
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>+359 889 234 567</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        '''
        
        html = self.get_base_html("Дейности", body_content)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_agencies_page(self):
        """Serve agencies page with rating system."""
        user = self.get_current_user()
        
        rating_modal = ""
        if user and user['role'] == 'parent':
            rating_modal = """
            <!-- Rating Modal -->
            <div id="ratingModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
                    <h3 style="margin-bottom: 1rem;">Оценете агенцията</h3>
                    <form id="ratingForm">
                        <div class="form-group">
                            <label>Оценка</label>
                            <div class="rating" id="ratingStars">
                                <span class="star" data-rating="1">*</span>
                                <span class="star" data-rating="2">*</span>
                                <span class="star" data-rating="3">*</span>
                                <span class="star" data-rating="4">*</span>
                                <span class="star" data-rating="5">*</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="ratingComment">Коментар</label>
                            <textarea id="ratingComment" rows="3"></textarea>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" class="btn btn-primary">Изпрати оценка</button>
                            <button type="button" onclick="closeRatingModal()" class="btn btn-secondary">Отказ</button>
                        </div>
                    </form>
                </div>
            </div>
            """
        
        body_content = f'''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-school"></i> Агенции</h1>
                <p>Разгледайте всички верифицирани агенции с рейтинги и отзиви</p>
            </div>
            
            <!-- Sample Agencies -->
            <div class="grid grid-2">
                <div class="item-card">
                    <div class="card-header">
                        <h3>MindHub</h3>
                        <div class="location" style="color: rgba(255,255,255,0.9);">
                            <i class="fas fa-map-marker-alt"></i>
                            София
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="rating-summary" style="margin-bottom: 1rem;">
                            <div class="stars">
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star">*</span>
                            </div>
                            <span class="rating-count">
                                4.2 (38 отзива)
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <strong>Дейности:</strong> 12
                        </div>
                        
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>+359 888 123 456</span>
                        </div>
                        
                        <div class="contact-item">
                            <i class="fas fa-globe"></i>
                            <a href="https://mindhub.bg" target="_blank">Уебсайт</a>
                        </div>
                        
                        {'<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1e5e9;"><button onclick="openRatingModal(\'MindHub\')" class="btn" style="background: #f39c12; color: white; width: 100%;"><i class="fas fa-star"></i> Оценете агенцията</button></div>' if user and user.get('role') == 'parent' else ''}
                    </div>
                </div>
                
                <div class="item-card">
                    <div class="card-header">
                        <h3>SmartyKids</h3>
                        <div class="location" style="color: rgba(255,255,255,0.9);">
                            <i class="fas fa-map-marker-alt"></i>
                            Пловдив
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="rating-summary" style="margin-bottom: 1rem;">
                            <div class="stars">
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                                <span class="star filled">*</span>
                            </div>
                            <span class="rating-count">
                                4.8 (22 отзива)
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <strong>Дейности:</strong> 8
                        </div>
                        
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>+359 889 234 567</span>
                        </div>
                        
                        {'<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1e5e9;"><button onclick="openRatingModal(\'SmartyKids\')" class="btn" style="background: #f39c12; color: white; width: 100%;"><i class="fas fa-star"></i> Оценете агенцията</button></div>' if user and user.get('role') == 'parent' else ''}
                    </div>
                </div>
            </div>
            
            {rating_modal}
        </div>
        '''
        
        js_code = '''
        let selectedRating = 0;
        
        function openRatingModal(schoolName) {
            document.getElementById('ratingModal').style.display = 'flex';
            selectedRating = 0;
            updateStars();
        }
        
        function closeRatingModal() {
            document.getElementById('ratingModal').style.display = 'none';
            selectedRating = 0;
        }
        
        function updateStars() {
            const stars = document.querySelectorAll('#ratingStars .star');
            stars.forEach((star, index) => {
                star.classList.toggle('filled', index < selectedRating);
            });
        }
        
        // Initialize rating system
        document.addEventListener('DOMContentLoaded', function() {
            const stars = document.querySelectorAll('#ratingStars .star');
            stars.forEach((star, index) => {
                star.addEventListener('click', function() {
                    selectedRating = index + 1;
                    updateStars();
                });
            });
        });
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
                <h1><i class="fas fa-info-circle"></i> За Skillio</h1>
                <p style="font-size: 1.2rem; color: #7f8c8d;">Водещата платформа за детски извънкласни дейности в България</p>
            </div>
            
            <div class="grid grid-2">
                <div class="card">
                    <h2><i class="fas fa-bullseye"></i> Нашата мисия</h2>
                    <p>Skillio свързва родители с най-добрите агенции за извънкласни дейности в България. Целта ни е да улесним процеса на намиране на качествени образователни програми за деца.</p>
                </div>
                
                <div class="card">
                    <h2><i class="fas fa-eye"></i> Нашата визия</h2>
                    <p>Виждаме бъдеще, в което всяко дете в България има достъп до качествено извънкласно образование, което развива неговите таланти.</p>
                </div>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-star"></i> Защо да изберете Skillio?</h2>
                <div class="grid grid-3">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-shield-check" style="font-size: 3rem; color: #2ecc71; margin-bottom: 1rem;"></i>
                        <h3>Верифицирани агенции</h3>
                        <p>Всички агенции са проверени от нашия екип.</p>
                    </div>
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-users" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                        <h3>Отзиви от родители</h3>
                        <p>Прочетете истински отзиви от други родители.</p>
                    </div>
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
                        <h3>Национално покритие</h3>
                        <p>Агенции в 16+ града из цяла България.</p>
                    </div>
                </div>
            </div>
        </div>
        '''
        
        html = self.get_base_html("За нас", body_content)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_add_activity_page(self):
        """Page for parents to add new activities."""
        user = self.get_current_user()
        if not user or user['role'] != 'parent':
            self.send_error(403)
            return
            
        body_content = '''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-plus"></i> Добави дейност</h1>
                <p>Знаете ли за интересна дейност? Споделете я с другите родители!</p>
            </div>
            
            <div class="card">
                <form id="activityForm">
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label for="activityName">Име на дейността *</label>
                            <input type="text" id="activityName" required>
                        </div>
                        <div class="form-group">
                            <label for="schoolName">Агенция/Училище *</label>
                            <input type="text" id="schoolName" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-3">
                        <div class="form-group">
                            <label for="category">Категория *</label>
                            <select id="category" required>
                                <option value="">Изберете категория</option>
                                <option value="Роботика и програмиране">Роботика и програмиране</option>
                                <option value="Математика">Математика</option>
                                <option value="Спорт">Спорт</option>
                                <option value="Изкуство">Изкуство</option>
                                <option value="Музика">Музика</option>
                                <option value="Танци">Танци</option>
                                <option value="Други">Други</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="city">Град *</label>
                            <input type="text" id="city" required>
                        </div>
                        <div class="form-group">
                            <label for="price">Цена (лв./месец)</label>
                            <input type="number" id="price" min="0">
                        </div>
                    </div>
                    
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label for="ageMin">Минимална възраст</label>
                            <input type="number" id="ageMin" min="3" max="18">
                        </div>
                        <div class="form-group">
                            <label for="ageMax">Максимална възраст</label>
                            <input type="number" id="ageMax" min="3" max="18">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Телефон за контакт</label>
                        <input type="tel" id="phone">
                    </div>
                    
                    <div class="form-group">
                        <label for="website">Уебсайт (по избор)</label>
                        <input type="url" id="website">
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Описание</label>
                        <textarea id="description" rows="4" placeholder="Разкажете повече за дейността..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-paper-plane"></i> Изпрати за одобрение
                    </button>
                </form>
            </div>
        </div>
        '''
        
        js_code = '''
        document.getElementById('activityForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Благодарим! Дейността ще бъде разгледана и добавена скоро.');
            this.reset();
        });
        '''
        
        html = self.get_base_html("Добави дейност", body_content, extra_js=js_code)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_add_teacher_page(self):
        """Page for parents to recommend teachers."""
        user = self.get_current_user()
        if not user or user['role'] != 'parent':
            self.send_error(403)
            return
            
        body_content = '''
        <div class="container">
            <div class="card">
                <h1><i class="fas fa-user-plus"></i> Препоръчай учител</h1>
                <p>Споделете информация за отличен учител или треньор!</p>
            </div>
            
            <div class="card">
                <form id="teacherForm">
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label for="teacherName">Име на учителя *</label>
                            <input type="text" id="teacherName" required>
                        </div>
                        <div class="form-group">
                            <label for="teacherSchool">Агенция/Училище *</label>
                            <input type="text" id="teacherSchool" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label for="subject">Предмет/Дейност *</label>
                            <input type="text" id="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="teacherCity">Град *</label>
                            <input type="text" id="teacherCity" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="teacherRating">Вашата оценка *</label>
                        <div class="rating" id="teacherStars">
                            <span class="star" data-rating="1">*</span>
                            <span class="star" data-rating="2">*</span>
                            <span class="star" data-rating="3">*</span>
                            <span class="star" data-rating="4">*</span>
                            <span class="star" data-rating="5">*</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="teacherComment">Защо препоръчвате този учител? *</label>
                        <textarea id="teacherComment" rows="4" required placeholder="Споделете опита си с този учител..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="contactInfo">Как да се свържат (по избор)</label>
                        <input type="text" id="contactInfo" placeholder="Телефон, имейл или други данни за контакт">
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-heart"></i> Препоръчай учителя
                    </button>
                </form>
            </div>
        </div>
        '''
        
        js_code = '''
        let teacherRating = 0;
        
        document.addEventListener('DOMContentLoaded', function() {
            const stars = document.querySelectorAll('#teacherStars .star');
            stars.forEach((star, index) => {
                star.addEventListener('click', function() {
                    teacherRating = index + 1;
                    updateTeacherStars();
                });
            });
        });
        
        function updateTeacherStars() {
            const stars = document.querySelectorAll('#teacherStars .star');
            stars.forEach((star, index) => {
                star.classList.toggle('filled', index < teacherRating);
            });
        }
        
        document.getElementById('teacherForm').addEventListener('submit', function(e) {
            e.preventDefault();
            if (teacherRating === 0) {
                alert('Моля, поставете оценка на учителя.');
                return;
            }
            alert('Благодарим за препоръката! Тя ще бъде разгледана скоро.');
            this.reset();
            teacherRating = 0;
            updateTeacherStars();
        });
        '''
        
        html = self.get_base_html("Препоръчай учител", body_content, extra_js=js_code)
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_login_page(self):
        """Simple login page."""
        html_content = '''
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <title>Вход - Skillio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-container { background: white; padding: 3rem; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
        .btn { padding: 0.7rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; font-weight: 500; width: 100%; margin: 0.5rem 0; }
        .btn-primary { background: #667eea; color: white; }
        .form-group { margin-bottom: 1.5rem; }
        input { width: 100%; padding: 0.7rem; border: 2px solid #e1e5e9; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h1><i class="fas fa-graduation-cap"></i> Skillio</h1>
            <p>Вход в платформата</p>
        </div>
        
        <div class="form-group">
            <input type="email" placeholder="Имейл адрес">
        </div>
        <div class="form-group">
            <input type="password" placeholder="Парола">
        </div>
        
        <button class="btn btn-primary">Влез</button>
        
        <div style="text-align: center; margin-top: 2rem;">
            <a href="/" style="color: #667eea;">← Върни се към началото</a>
        </div>
    </div>
</body>
</html>'''
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))

    # API endpoints (simplified)
    def serve_activities_api(self):
        """API endpoint for activities."""
        sample_data = [
            {"id": 1, "name": "Роботика за деца", "school_name": "MindHub", "city": "София", "category": "Роботика", "price_monthly": 80, "age_min": 8, "age_max": 14},
            {"id": 2, "name": "Математическо училище", "school_name": "SmartyKids", "city": "Пловдив", "category": "Математика", "price_monthly": 60, "age_min": 6, "age_max": 12}
        ]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(sample_data).encode('utf-8'))

    def serve_schools_api(self):
        """API endpoint for schools."""
        sample_data = [
            {"id": 1, "name": "MindHub", "city": "София", "activity_count": 12, "phone": "+359 888 123 456", "website": "https://mindhub.bg"},
            {"id": 2, "name": "SmartyKids", "city": "Пловдив", "activity_count": 8, "phone": "+359 889 234 567", "website": ""}
        ]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(sample_data).encode('utf-8'))

    def serve_cities_api(self):
        """API endpoint for cities."""
        cities = ["София", "Пловдив", "Варна", "Бургас", "Стара Загора", "Плевен", "Русе", "Велико Търново"]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(cities).encode('utf-8'))

    def serve_ratings_api(self):
        """API endpoint for ratings."""
        sample_data = [
            {"id": 1, "school_name": "MindHub", "rating": 4, "comment": "Отлично обучение!"},
            {"id": 2, "school_name": "MindHub", "rating": 5, "comment": "Много добри учители."}
        ]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(sample_data).encode('utf-8'))

    # Handle forms
    def handle_login(self):
        """Handle login form."""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok"}).encode('utf-8'))

    def handle_rating(self):
        """Handle rating submission."""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok"}).encode('utf-8'))

    def handle_activity_submission(self):
        """Handle activity submission."""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "submitted"}).encode('utf-8'))

    def handle_teacher_submission(self):
        """Handle teacher recommendation."""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "submitted"}).encode('utf-8'))

    def handle_logout(self):
        """Handle logout."""
        self.send_response(302)
        self.send_header('Location', '/')
        self.end_headers()


def init_database():
    """Initialize SQLite database with sample data."""
    conn = sqlite3.connect('activities.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            role TEXT DEFAULT 'parent'
        )
    ''')
    
    conn.commit()
    conn.close()


if __name__ == "__main__":
    # Initialize database
    init_database()
    
    # Start server
    server = HTTPServer(('0.0.0.0', 8080), SkillioHandler)
    print("🎓 Skillio Platform started on http://localhost:8080")
    print("✨ Features: Homepage, Activities, Agencies, Add Activity/Teacher forms")
    server.serve_forever()