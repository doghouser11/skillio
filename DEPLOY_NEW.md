# 🚀 Skillio Next.js + FastAPI Deployment

## Архитектура

- **Frontend**: Next.js (Port 3000) → `skillio.live`
- **Backend**: FastAPI (Port 8000) → `api.skillio.live`  
- **Database**: PostgreSQL → Internal

## Бърз Deployment

### 1. Git Push
```bash
cd skillio
git add .
git commit -m "🎯 Frontend deployment готов - Next.js + API интеграция"
git push origin main
```

### 2. Coolify Deploy
- Coolify ще build-не автоматично с новия docker-compose.yml
- Използва multi-service setup:
  - `database_skillio` (PostgreSQL)
  - `backend` (FastAPI) 
  - `frontend` (Next.js)

### 3. DNS Setup
```
A Record: skillio.live → YOUR_VPS_IP
A Record: api.skillio.live → YOUR_VPS_IP
```

## Проверка след deployment

### ✅ Frontend Tests
```bash
# Трябва да отворят UI-a
https://skillio.live
https://skillio.live/activities
https://skillio.live/schools
https://skillio.live/login
```

### ✅ Backend Tests  
```bash
# Schema API (видя че работи)
https://api.skillio.live/api/migrate/check-schema?fix=true

# Health check
https://api.skillio.live/health

# Activities API
https://api.skillio.live/api/activities
```

### ✅ Integration Tests
1. Отвори https://skillio.live/register
2. Направи регистрация  
3. Login в dashboard
4. Провери дали API calls работят

## Troubleshooting

### "Frontend не се вижда"
- Coolify logs за frontend container
- Провери дали port 3000 е exposed
- Hard refresh (Ctrl+F5)

### "API errors" 
- Backend logs в Coolify
- Провери DATABASE_URL connection
- Postgres container status

### "Build fails"
```bash
# Локален тест
cd frontend && npm install && npm run build
```

## Success Checklist ✅

- [ ] https://skillio.live loads (homepage)
- [ ] Navigation works (activities, schools, about)  
- [ ] Footer shows with newsletter signup
- [ ] Login/Register pages load
- [ ] Dashboard redirects work по role
- [ ] API calls work (check Network tab)
- [ ] Database schema е up-to-date

---

**Status**: ГОТОВО за production! 🎯

Frontend (дашбордовете, футъра) сега трябва да се видят след deployment.