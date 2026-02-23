# Skillio Design Standards

**Date:** 2026-02-23
**Status:** LOCKED ✅

## Core Design Elements (DO NOT CHANGE)

### Logo & Branding
- **Logo:** `<i class="fas fa-graduation-cap"></i> Skillio`
- **Colors:** Purple gradient `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Font:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif

### Layout Structure
- **Header:** Sticky navigation with gradient background
- **Navigation:** Home, Дейности, Агенции, За нас
- **Auth Buttons:** Вход/Регистрация (or Profile/Exit when logged in)
- **Footer:** 3-column layout with company info

### Component Standards
- **Cards:** White background, 15px border-radius, subtle shadow
- **Buttons:** Primary (#ff6b6b), Secondary (transparent with white border)
- **Forms:** Clean inputs with focus states (#667eea)
- **Rating Stars:** Gold (#ffc107) with hover effects

### Features
- **Parent Role:** Gets additional menu items (Добави дейност, Добави учител)
- **Responsive:** Grid layouts that adapt to mobile
- **Professional Look:** Clean, modern, trustworthy

## File Structure
- **Main Platform:** `complete_platform.py` (current active version)
- **Backup:** `original_platform.py` (clean copy)
- **Database:** `activities.db` (SQLite with all tables)

## Future Development Rules
1. **NO design changes** without explicit user approval
2. New features should integrate with existing UI patterns  
3. Keep the graduation cap logo and purple gradient theme
4. Maintain professional, clean aesthetic
5. Any major changes: create new file, don't modify complete_platform.py

---
**This design was approved by the user and should remain constant across all future updates.**