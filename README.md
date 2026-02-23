# 🎓 Skillio - Children's Activities Marketplace

A complete marketplace platform connecting parents with extracurricular activities and educational programs for children in Bulgaria.

![Skillio Platform](https://img.shields.io/badge/Status-Production%20Ready-green) ![Python](https://img.shields.io/badge/Python-3.11+-blue) ![Database](https://img.shields.io/badge/Database-SQLite-lightgrey)

## 🌟 Features

### For Parents
- **Browse Activities**: Filter by city, category, age range, and price
- **Submit New Activities**: Suggest activities you know about
- **Recommend Teachers**: Add and rate outstanding teachers
- **5-Star Rating System**: Rate schools and teachers
- **Direct Contact**: Send inquiries to schools

### For Schools
- **School Profiles**: Manage verified school information
- **Activity Listings**: Create and manage course offerings
- **Lead Management**: Receive and respond to parent inquiries
- **Dashboard**: Track activities and statistics

### For Admins
- **Content Moderation**: Verify schools and activities
- **User Management**: Oversee platform users
- **Analytics**: Monitor platform usage and growth

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/skillio-platform.git
cd skillio-platform

# Run the application
python3 complete_platform.py

# Access the platform
open http://localhost:8080
```

### Production Deployment with Coolify

1. **Create new service** in Coolify dashboard
2. **Connect GitHub repository**
3. **Use the included Dockerfile**
4. **Deploy automatically**

## 🏗️ Architecture

- **Backend**: Pure Python (standard library only)
- **Database**: SQLite with automatic table creation
- **Frontend**: Server-side HTML with vanilla JavaScript
- **Styling**: CSS3 with responsive design
- **Icons**: Font Awesome 6.0

## 📊 Database Schema

### Core Tables
- `users` - User authentication and roles
- `schools` - Educational institutions and agencies
- `activities` - Course listings and details
- `neighborhoods` - Geographic organization

### Enhanced Features
- `submitted_activities` - Parent-suggested activities
- `teachers` - Teacher recommendations
- `teacher_ratings` - Rating system for teachers
- `ratings` - School ratings and reviews

## 🎨 Design Standards

- **Logo**: 🎓 Skillio with graduation cap
- **Colors**: Purple gradient (#667eea → #764ba2)
- **Typography**: Segoe UI system fonts
- **Layout**: Clean, professional, mobile-responsive

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# For production optimizations
PYTHON_ENV=production
PORT=8080
HOST=0.0.0.0
```

### Test Accounts
- **Admin**: admin@activities.com / admin123
- **Parent**: parent@test.com / parent123
- **School**: school@test.com / school123

## 📁 Project Structure

```
skillio-platform/
├── complete_platform.py      # Main application file
├── activities.db             # SQLite database
├── requirements.txt          # Python dependencies
├── Dockerfile               # Container configuration
├── DESIGN_STANDARDS.md      # UI/UX guidelines
└── README.md               # This file
```

## 🐳 Docker Deployment

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["python3", "complete_platform.py"]
```

## 🌐 Production Deployment

### Recommended Setup
- **Server**: Hetzner VPS (2GB+ RAM)
- **Deployment**: Coolify
- **Domain**: Custom domain with SSL
- **Database**: SQLite (included) or PostgreSQL for scale

### Performance Notes
- Built for efficiency with minimal dependencies
- SQLite handles 1000+ concurrent users easily
- Static assets served directly by Python server
- Can be easily migrated to PostgreSQL when needed

## 🔒 Security Features

- Session-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CSRF protection on forms
- SQL injection prevention

## 📈 Scaling Considerations

- **Current**: Single-server SQLite deployment
- **Future**: Easy migration to PostgreSQL + Redis
- **CDN**: Static assets can be moved to CDN
- **Caching**: Built-in HTTP caching headers

## 🤝 Contributing

This is a production platform. For feature requests or bug reports, please contact the development team.

## 📄 License

Proprietary software - All rights reserved.

## 🎯 About

Skillio was built to solve the real problem of parents finding quality educational activities for their children. The platform connects Bulgarian families with verified educational providers in robotics, programming, arts, sports, and more.

**Built with care in Bulgaria 🇧🇬**

---

For deployment support or questions, contact the development team.