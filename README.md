# 🌊 FlowX – Intelligent Disaster Risk Management System

![FlowX Logo](https://img.shields.io/badge/FlowX-Disaster%20Management-blue?style=for-the-badge&logo=water&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Admin-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge)

FlowX is a comprehensive, cross-platform disaster risk management system designed to protect communities in Sri Lanka through intelligent flood prediction, real-time alerts, and efficient resource allocation. The system serves citizens, government officers, and irrigation officials with tailored interfaces for disaster preparedness and response.

## 🏗️ System Architecture

The FlowX ecosystem consists of three main applications:

```
📱 FlowX System
├── 🌐 Public Web Application (Citizens)
├── 📱 Mobile Application (Citizens)
├── 🏛️ Admin Web Panel (Government Officers)
└── 🤖 ML Prediction Service (Flask API)
```

---

## 🚀 Applications Overview

### 🌐 Public Web Application
**Target Users:** General Citizens  
**Purpose:** Public access to disaster information and services

**Key Features:**
- 📝 Citizen registration with location mapping
- ⚠️ Real-time flood risk monitoring
- 🏠 Shelter information and requests
- 💰 Subsidy tracking and applications
- 📢 Emergency announcements
- 📊 Flood prediction visualizations
- 🗺️ Interactive flood maps

### 📱 Mobile Application (Flutter)
**Target Users:** Registered Citizens  
**Purpose:** Mobile-first disaster response and communication

**Key Features:**
- 📱 Native mobile experience
- 🏠 Shelter map with location services
- 📞 Emergency contact integration
- 📋 Victim assistance requests
- 💸 Subsidy status tracking
- 🔔 Push notifications for alerts
- 📍 Location-based services

### 🏛️ Admin Web Panel
**Target Users:** Government Officers, Grama Sevaka, Irrigation Officers  
**Purpose:** Administrative control and resource management

**Key Features:**
- 👥 User and request management
- 🏠 Shelter assignment and tracking
- 💰 Subsidy allocation and approval
- 📊 Statistical reporting and analytics
- 📋 Flood event management
- 🎯 Targeted announcement system
- 📈 Historical data analysis

---

## 🛠️ Tech Stack

### **Frontend Technologies**
- **Web Applications:** React.js 18+ with Vite
- **Mobile App:** Flutter with Dart
- **UI Framework:** Shadcn/UI + Tailwind CSS
- **State Management:** React Context API, Zustand
- **Routing:** React Router Dom

### **Backend Technologies**
- **API Server:** Node.js + Express.js
- **Database:** MySQL 8.0+
- **Authentication:** JWT + bcryptjs
- **Middleware:** CORS, Morgan, Cookie Parser
- **Logging:** Winston

### **Machine Learning**
- **ML Server:** Flask + Python
- **Models:** XGBoost, Scikit-learn
- **Data Processing:** Pandas, NumPy
- **Deployment:** Gunicorn + Vercel

### **DevOps & Tools**
- **Version Control:** Git
- **Package Managers:** npm, Flutter pub
- **Development:** Nodemon, Vite HMR
- **Database:** MySQL2 driver

---

## 📋 Prerequisites

Before setting up FlowX, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Flutter** (v3.4.1 or higher)
- **MySQL** (v8.0 or higher)
- **Python** (v3.8 or higher) - for ML service
- **Git** (latest version)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/NIBM-GALLE/GAHDSE241F-flowx.git
cd GAHDSE241F-flowx
```

### 2️⃣ Database Setup

1. Create a MySQL database named `flowx_db`
2. Run the database migration scripts (contact team for SQL files)
3. Configure database connection in `.env` files

### 3️⃣ Public Web Application Setup

```bash
# Navigate to public web app
cd public-web-app

# Setup backend server
cd server
npm install

# Create .env file
cat > .env << EOL
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=flowx_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
EOL

# Start backend server
npm run dev

# Setup frontend (new terminal)
cd ../client
npm install

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:5000
EOL

# Start frontend
npm run dev
```

### 4️⃣ Admin Web Panel Setup

```bash
# Navigate to admin web app
cd grama-sewaka-web-app

# Setup backend server
cd server
npm install

# Create .env file
cat > .env << EOL
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=flowx_db
JWT_SECRET=your_jwt_secret_key
PORT=5050
EOL

# Start backend server
npm run dev

# Setup frontend (new terminal)
cd ../client
npm install

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:5050
EOL

# Start frontend
npm run dev
```

### 5️⃣ Mobile Application Setup

```bash
# Navigate to mobile app
cd mobile-app

# Setup backend server
cd flowx_server
npm install

# Create .env file
cat > .env << EOL
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=flowx_db
PORT=3000
EOL

# Start backend server
npm run dev

# Setup Flutter app (new terminal)
cd ../flowx_app
flutter pub get
flutter run
```

### 6️⃣ ML Prediction Service Setup

Set up the machine learning prediction service:

```bash
# Clone ML service repository
git clone https://github.com/Chamindu-08/flowx-flood-prediction-system.git
cd flowx-flood-prediction-system

# Setup Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

---

## 🔧 Configuration

### Environment Variables

Each application requires specific environment variables:

#### **Backend Services (.env)**
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=flowx_db
JWT_SECRET=your_jwt_secret_key
PORT=your_port_number
```

#### **Frontend Applications (.env)**
```env
VITE_API_URL=http://localhost:your_backend_port
```

#### **Flutter Application (config)**
Update API endpoints in `lib/services/api_service.dart`

---

## 📱 Application Ports

| Application | Port | URL |
|-------------|------|-----|
| Public Web Backend | 5000 | http://localhost:5000 |
| Public Web Frontend | 5173 | http://localhost:5173 |
| Admin Web Backend | 5050 | http://localhost:5050 |
| Admin Web Frontend | 5174 | http://localhost:5174 |
| Mobile Backend | 3000 | http://localhost:3000 |
| ML Prediction Service | 5010 | http://localhost:5010 |

---

## 🔄 Application Workflow

### 👥 Citizen Journey
1. **Registration** → Citizens register with location details
2. **Monitoring** → Real-time flood risk assessment
3. **Alerts** → Receive emergency notifications
4. **Shelter Request** → Request safe shelter assignment
5. **Assistance** → Submit victim help requests
6. **Subsidy** → Apply for disaster relief funds

### 🏛️ Administrative Workflow
1. **Data Collection** → Irrigation officers input environmental data
2. **Prediction** → ML models analyze risk patterns
3. **Alert Generation** → Automated warnings for high-risk areas
4. **Resource Allocation** → Assign shelters and subsidies
5. **Response Coordination** → Manage victim requests and assistance
6. **Recovery Tracking** → Monitor post-disaster recovery

---

## 📊 Database Schema

### Key Tables
- **users** - Citizen and officer authentication
- **houses** - Citizen location and property details
- **shelters** - Safe shelter locations and capacity
- **flood_events** - Historical flood data
- **victim_requests** - Assistance requests
- **subsidies** - Financial aid tracking
- **announcements** - Emergency communications

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Flutter tests
cd mobile-app/flowx_app
flutter test
```

---

## 🚀 Deployment

### Production Deployment

1. **Database**: Set up production MySQL instance
2. **Backend**: Deploy Node.js servers (PM2 recommended)
3. **Frontend**: Build and deploy static files
4. **Mobile**: Build APK/IPA for app stores
5. **ML Service**: Deploy Flask app with Gunicorn

### Environment Setup
- Configure production environment variables
- Set up SSL certificates
- Configure database backups
- Set up monitoring and logging

---

## 📂 Project Structure

```
GAHDSE241F-flowx/
├── 📁 public-web-app/          # Public citizen web application
│   ├── 📁 client/              # React.js frontend
│   ├── 📁 server/              # Node.js backend
│   └── 📁 flowx-flask-app/     # ML prediction service
├── 📁 grama-sewaka-web-app/    # Admin web panel
│   ├── 📁 client/              # React.js admin frontend
│   └── 📁 server/              # Node.js admin backend
├── 📁 mobile-app/              # Mobile application
│   ├── 📁 flowx_app/           # Flutter mobile app
│   └── 📁 flowx_server/        # Mobile backend API
└── 📄 README.md                # This documentation
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Verify MySQL service is running
2. **Port Conflicts**: Check if ports are available
3. **Dependencies**: Run `npm install` or `flutter pub get`
4. **Environment Variables**: Ensure all `.env` files are configured

### Getting Help

- Check the issue tracker for known problems
- Review application logs for error details
- Ensure all prerequisites are installed
- Verify database schema is up to date

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Development Team

**NIBM - Advanced Diploma in Software Engineering**  
**Batch:** GAHDSE241F

| Developer | Student ID | Role |
|-----------|------------|------|
| **D C Induwara** | GAHDSE241F-004 | Full-Stack Developer & Team Lead |
| **W G A P Prabodhya** | GAHDSE241F-042 | Frontend Developer & UI/UX |
| **J K D Dumini** | GAHDSE241F-053 | Backend Developer & Database |

---

## 🎯 Future Enhancements

- 🔔 Push notification system
- 📱 Progressive Web App (PWA) support
- 🌐 Multi-language support
- 📊 Advanced analytics dashboard
- 🤖 AI-powered chatbot assistance
- 📍 GPS-based emergency services
- 🔗 Integration with national alert systems

---

**🌊 FlowX - Protecting Communities Through Technology**

*For technical support or questions, please contact the development team.*