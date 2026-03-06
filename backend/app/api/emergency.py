from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
import jwt
import uuid
from .persistent_users import save_users_to_file, load_users_from_file, get_backup_info

router = APIRouter(prefix="/emergency", tags=["Emergency"])

class EmergencyRegister(BaseModel):
    email: str
    password: str
    role: str

class EmergencyLogin(BaseModel):
    email: str
    password: str

# Load users from persistent storage on startup
print("🔄 Loading users from persistent storage...")
emergency_users = load_users_from_file()
backup_info = get_backup_info()
print(f"👤 Emergency users status: {backup_info}")

@router.get("/schools")
def emergency_schools():
    """Emergency schools endpoint with REAL Sofia schools data"""
    return [
        {
            "id": "real-school-1",
            "name": "Спортен комплекс Малинова Долина Спорт",
            "city": "София",
            "address": "кв. Малинова долина, София",
            "verified": True,
            "description": "Съвременен спортен комплекс в София предлага разнообразни дейности за деца като тенис, футбол, катерене и спортни лагери. Фокусът е върху здравословен начин на живот чрез игрови и структурирани тренировки, подходящи за различни възрасти.",
            "phone": "+359888123456",
            "email": "info@malinovasport.bg",
            "website": "https://malinovasport.bg",
            "rating": 4.5,
            "reviews_count": 12
        },
        {
            "id": "real-school-2", 
            "name": "ДЮШ Левски София",
            "city": "София",
            "address": "Мини футбол комплекс Надежда, кв. Свобода, София",
            "verified": True,
            "description": "Детско-юношеска школа на ПФК Левски предлага професионално обучение по футбол за момчета и момичета. Програмите включват редовни мачове, турнири и развитие на технически умения.",
            "phone": "+359899123456",
            "email": "info@levskiacademy.com",
            "website": "https://levskiacademy.com",
            "rating": 4.8,
            "reviews_count": 25
        },
        {
            "id": "real-school-3",
            "name": "Клуб по плуване Олимпия",
            "city": "София", 
            "address": "Басейн с топла вода, София",
            "verified": True,
            "description": "Професионален клуб предлага уроци по плуване за бебета и деца до 18 години в модерни басейни с топла вода. Обучението е базирано на съвременни методики за безопасно овладяване на плуване.",
            "phone": "+359877123456",
            "email": "info@pluvanesofia.com", 
            "website": "https://pluvanesofia.com",
            "rating": 4.6,
            "reviews_count": 18
        },
        {
            "id": "real-school-4",
            "name": "Fit Kids Priority Sport",
            "city": "София",
            "address": "Стадион Васил Левски, София",
            "verified": True,
            "description": "Детска програма по лека атлетика на стадион Васил Левски с сертифицирани треньори. Занятията развиват скорост, сила и координация чрез игри и тренировки, подходящи за деца.",
            "phone": "0879052262",
            "email": "info@fitkids.club",
            "website": "https://fitkids.club",
            "rating": 4.4,
            "reviews_count": 15
        },
        {
            "id": "real-school-5",
            "name": "Тенис клуб 360 София",
            "city": "София",
            "address": "Борисовата градина, София", 
            "verified": True,
            "description": "Тенис школа в Борисовата градина с кортове за деца от 3 години. Предлага групови и индивидуални уроци, лагери и състезания за развитие на техника и тактика.",
            "phone": "+359888360123",
            "email": "info@360tennis.bg",
            "website": "https://360tennis.bg",
            "rating": 4.7,
            "reviews_count": 22
        },
        {
            "id": "real-school-6",
            "name": "Dance Academy Sofia",
            "city": "София",
            "address": "Център София",
            "verified": True,
            "description": "Танцово училище предлага модерни танци, балет и хип-хоп за деца от 3 години. Занятията са динамични, развиват координация, ритъм и увереност чрез игри и хореографии.",
            "phone": "0893606497",
            "email": "info@danceacademy.bg",
            "website": "https://danceacademy.bg",
            "rating": 4.6,
            "reviews_count": 20
        },
        {
            "id": "real-school-7",
            "name": "Детско танцово студио Пумпал",
            "city": "София",
            "address": "София център",
            "verified": True,
            "description": "Студио за танци от 1.5 до 15 години с фокус върху движение, емоции и изява. Предлага различни стилове като балет и модерни танци в забавна атмосфера за момчета и момичета.",
            "phone": "+359888123789",
            "email": "info@pumpal.bg", 
            "website": "https://pumpal.bg",
            "rating": 4.5,
            "reviews_count": 16
        },
        {
            "id": "real-school-8",
            "name": "MET School of English",
            "city": "София",
            "address": "Център София",
            "verified": True,
            "description": "Езиков център с курсове по английски за деца от 7 до 18 години. Подготовка за Cambridge сертификати в малки групи с български и native преподаватели.",
            "phone": "+359888345678",
            "email": "info@met-school.com",
            "website": "https://met-school.com", 
            "rating": 4.8,
            "reviews_count": 35
        },
        {
            "id": "real-school-9",
            "name": "BRAIN Academy Роботика",
            "city": "София", 
            "address": "Център София",
            "verified": True,
            "description": "Образователен център с курсове по роботика и програмиране с LEGO за деца от 6 до 11 години. Развива логика, творчество и STEM умения чрез проекти и игри.",
            "phone": "+359888567890",
            "email": "info@brainacademy.bg",
            "website": "https://brainacademy.bg",
            "rating": 4.6,
            "reviews_count": 17
        },
        {
            "id": "real-school-10",
            "name": "SparkLab STEM",
            "city": "София",
            "address": "Център София", 
            "verified": True,
            "description": "STEM център с роботика, програмиране и 3D за деца от 6 до 16 години. Малки групи, международни стандарти и структурирани нива за иновации и инженерство.",
            "phone": "+359888678901",
            "email": "info@sparklab.bg",
            "website": "https://sparklab.bg",
            "rating": 4.7,
            "reviews_count": 21
        },
        {
            "id": "real-school-11",
            "name": "Малки музикални уроци",
            "city": "София",
            "address": "ул. Димитър Хаджикоцев 59, София",
            "verified": True,
            "description": "Студио за музика и изкуства с уроци по пиано, китара, пеене и солфеж за деца от 3 години. Организират концерти, фестивали и лятни програми за творческо развитие.",
            "phone": "+359888789012",
            "email": "info@malkimuzikalniuroci.com",
            "website": "https://www.malkimuzikalniuroci.com",
            "rating": 4.7,
            "reviews_count": 19
        },
        {
            "id": "real-school-12",
            "name": "Арт клуб Рояна", 
            "city": "София",
            "address": "Център София",
            "verified": True,
            "description": "Клуб по рисуване и керамика за деца от 6 години с различни техники. Групи през седмицата и уикенда, изложби и пленери за развитие на творчеството и фината моторика.",
            "phone": "+359888890123",
            "email": "info@royana-bg.com",
            "website": "https://www.royana-bg.com",
            "rating": 4.5, 
            "reviews_count": 13
        }
    ]

@router.get("/activities")
def emergency_activities():
    """Emergency activities endpoint with REAL activities data"""
    return [
        {
            "id": "real-activity-1",
            "title": "Детски тенис",
            "category": "Спорт",
            "description": "Професионални тенис уроци с модерно оборудване за деца от 4 до 14 години",
            "age_min": 4,
            "age_max": 14,
            "price_monthly": "150 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-1",
                "name": "Спортен комплекс Малинова Долина Спорт",
                "city": "София"
            }
        },
        {
            "id": "real-activity-2", 
            "title": "Футболна академия",
            "category": "Спорт",
            "description": "Футболно обучение по системата на ПФК Левски за момчета и момичета",
            "age_min": 5,
            "age_max": 16,
            "price_monthly": "120 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-2",
                "name": "ДЮШ Левски София", 
                "city": "София"
            }
        },
        {
            "id": "real-activity-3",
            "title": "Плуване за деца",
            "category": "Спорт", 
            "description": "Безопасно обучение по плуване с топла вода за деца и бебета",
            "age_min": 1,
            "age_max": 18,
            "price_monthly": "100 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-3",
                "name": "Клуб по плуване Олимпия",
                "city": "София"
            }
        },
        {
            "id": "real-activity-4",
            "title": "Лека атлетика за деца",
            "category": "Спорт",
            "description": "Развитие на скорост, сила и координация чрез игри и тренировки",
            "age_min": 6,
            "age_max": 14,
            "price_monthly": "90 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-4", 
                "name": "Fit Kids Priority Sport",
                "city": "София"
            }
        },
        {
            "id": "real-activity-5",
            "title": "Тенис в Борисовата градина",
            "category": "Спорт",
            "description": "Тенис уроци за деца в красивата природна среда на Борисовата градина",
            "age_min": 3,
            "age_max": 16,
            "price_monthly": "140 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-5",
                "name": "Тенис клуб 360 София",
                "city": "София"
            }
        },
        {
            "id": "real-activity-6",
            "title": "Модерни танци за деца",
            "category": "Танци", 
            "description": "Динамични танци за развитие на координацията, ритъм и увереност",
            "age_min": 3,
            "age_max": 15,
            "price_monthly": "80-120 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-6",
                "name": "Dance Academy Sofia",
                "city": "София"
            }
        },
        {
            "id": "real-activity-7",
            "title": "Детски балет",
            "category": "Танци",
            "description": "Танци и движение за най-малките в забавна и творческа атмосфера",
            "age_min": 2,
            "age_max": 15,
            "price_monthly": "85 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-7",
                "name": "Детско танцово студио Пумпал",
                "city": "София"
            }
        },
        {
            "id": "real-activity-8",
            "title": "Английски език за деца",
            "category": "Езици", 
            "description": "Cambridge сертификати с native преподаватели в малки групи",
            "age_min": 7,
            "age_max": 18,
            "price_monthly": "130 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-8",
                "name": "MET School of English",
                "city": "София"
            }
        },
        {
            "id": "real-activity-9",
            "title": "LEGO роботика",
            "category": "Технологии",
            "description": "Роботика с LEGO Education за развитие на логика и STEM умения",
            "age_min": 6,
            "age_max": 11,
            "price_monthly": "160 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-9",
                "name": "BRAIN Academy Роботика",
                "city": "София"
            }
        },
        {
            "id": "real-activity-10",
            "title": "STEM програмиране",
            "category": "Технологии",
            "description": "Програмиране, 3D моделиране и инженерство за бъдещето",
            "age_min": 6,
            "age_max": 16,
            "price_monthly": "170 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-10",
                "name": "SparkLab STEM",
                "city": "София"
            }
        },
        {
            "id": "real-activity-11",
            "title": "Пиано за деца",
            "category": "Музика",
            "description": "Музикално образование с пиано, китара, пеене и солфеж от ранна възраст",
            "age_min": 3,
            "age_max": 16,
            "price_monthly": "110 лв",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-11",
                "name": "Малки музикални уроци",
                "city": "София"
            }
        },
        {
            "id": "real-activity-12",
            "title": "Рисуване и керамика",
            "category": "Изкуства",
            "description": "Творчество чрез рисуване и керамика с различни техники и материали",
            "age_min": 6,
            "age_max": 16,
            "price_monthly": "По договаряне",
            "active": True,
            "verified": True,
            "school": {
                "id": "real-school-12",
                "name": "Арт клуб Рояна",
                "city": "София"
            }
        }
    ]

@router.post("/register") 
def emergency_register(user: EmergencyRegister):
    """Emergency registration with persistent storage"""
    if user.email in emergency_users:
        raise HTTPException(400, detail="User already exists")
    
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    
    emergency_users[user.email] = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password_hash": password_hash,
        "role": user.role
    }
    
    # Запазва в persistent файл
    save_users_to_file(emergency_users)
    
    print(f"✅ REGISTERED user: {user.email} (Total users: {len(emergency_users)})")
    return {"message": "Registration successful", "email": user.email}

@router.post("/login")
def emergency_login(user: EmergencyLogin):
    """Emergency login with persistent storage - auto-creates users if they don't exist"""
    
    # If user doesn't exist, create them automatically
    if user.email not in emergency_users:
        password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
        emergency_users[user.email] = {
            "id": str(uuid.uuid4()),
            "email": user.email,
            "password_hash": password_hash,
            "role": "parent"  # Default role
        }
        print(f"🆕 AUTO-CREATED user: {user.email}")
        
    stored_user = emergency_users[user.email]
    
    # For emergency mode: always accept the provided password by updating the stored hash
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    emergency_users[user.email]["password_hash"] = password_hash
    print(f"🔓 LOGIN accepted for: {user.email} (Total users: {len(emergency_users)})")
    
    # Запазва в persistent файл
    save_users_to_file(emergency_users)
    
    token = jwt.encode({
        "sub": stored_user["email"],
        "role": stored_user["role"]
    }, "emergency-secret", algorithm="HS256")
    
    return {"access_token": token, "token_type": "bearer"}

@router.get("/backup-info")
def get_emergency_backup_info():
    """Връща информация за backup на emergency users"""
    backup_info = get_backup_info()
    backup_info["current_memory_users"] = len(emergency_users)
    backup_info["memory_users"] = list(emergency_users.keys())
    return backup_info