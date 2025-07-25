# CG Portal Feedback System

A comprehensive web application designed for the Chhattisgarh Government to efficiently collect and manage citizen feedback across multiple government departments.

![CG Portal](https://img.shields.io/badge/Chhattisgarh-Government-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)

## 🌟 Features

- **📝 Citizen Feedback Collection**: Easy-to-use feedback submission form
- **🏛️ Department Management**: Separate handling for Health, Finance, and Tax departments
- **👨‍💼 Admin Dashboard**: Comprehensive management interface for government officials
- **📊 PDF Export System**: Professional PDF reports with government branding
- **🌍 Multi-language Support**: Available in Hindi and English
- **📱 Responsive Design**: Works seamlessly on mobile and desktop devices
- **🔐 Secure Authentication**: Admin authentication system
- **📈 Real-time Analytics**: Dashboard with feedback statistics and insights

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.2 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Backend**: Node.js with Next.js API Routes
- **Database**: MongoDB 7.0
- **PDF Generation**: jsPDF library
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahirmittal/FEEDBACK-SYSTEM-CG.git
   cd FEEDBACK-SYSTEM-CG/cg_portal_feedback
   ```

2. **Start the application**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - **Main Application**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin/dashboard
   - **Feedback Form**: http://localhost:3000/feedback
   - **Database Admin**: http://localhost:8081

### Network Access

To access from other devices on the same WiFi network:
- Find your computer's IP address (e.g., 192.168.1.4)
- Use: `http://192.168.1.4:3000`

## 📋 Usage

### For Citizens
1. Navigate to the feedback form
2. Fill in personal details (name, mobile number)
3. Select the relevant government department
4. Choose satisfaction level and describe the query
5. Submit the feedback

### For Government Officials
1. Access the admin dashboard
2. **Feedback Management**: View, filter, and manage all citizen feedback
3. **User Management**: Create and manage admin accounts
4. **PDF Reports**: Generate comprehensive reports by department

## 📊 PDF Export Features

- **Complete Reports**: Export all feedback data
- **Department-wise Reports**: Filter by Health, Finance, or Tax departments
- **Summary Reports**: Statistical overview with charts and metrics
- **Professional Formatting**: Government branding and official layout
- **Multi-page Support**: Automatic pagination for large datasets

## 🏗️ Project Structure

```
cg_portal_feedback/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── feedback/          # Feedback submission page
│   └── models/            # Data models
├── components/            # Reusable UI components
├── lib/                   # Utility functions
│   └── pdfExport.ts      # PDF generation logic
├── public/               # Static assets
├── scripts/              # Database initialization
├── docker-compose.yml    # Docker configuration
└── Dockerfile           # Container configuration
```

## 🐳 Docker Services

- **App Container** (Port 3000): Next.js application
- **MongoDB Container** (Port 27017): Database service
- **Mongo Express Container** (Port 8081): Database administration

## 🔧 Development

### Local Development Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Start database (using Docker)**
   ```bash
   docker-compose up mongodb mongo-express -d
   ```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## 📁 Database Schema

### Feedback Collection
```javascript
{
  id: String,
  callId: String,
  citizenMobile: String,
  citizenName: String,
  satisfaction: String,
  description: String,
  submittedBy: String,
  submittedAt: Date,
  status: String,
  queryType: String,
  department: String
}
```

## 🎯 Key Benefits

### For Citizens
- ✅ 24/7 feedback submission availability
- ✅ Multi-language interface (Hindi/English)
- ✅ Mobile-friendly design
- ✅ Simple and intuitive user experience

### For Government
- ✅ Centralized feedback management
- ✅ Real-time citizen satisfaction monitoring
- ✅ Professional report generation
- ✅ Department-wise performance tracking
- ✅ Improved citizen service delivery

## 🔒 Security Features

- Admin authentication system
- Secure API endpoints
- Input validation and sanitization
- Environment-based configuration
- Docker container isolation

## 📖 Documentation

- **Project Documentation**: `project_documentation.tex` (LaTeX format)
- **Docker Guide**: `DOCKER_README.md`
- **Database Schema**: `DATABASE_SCHEMA.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed for the Chhattisgarh Government. Please contact the maintainer for usage permissions.

## 👨‍💻 Author

**Mahir Mittal**
- GitHub: [@mahirmittal](https://github.com/mahirmittal)

## 🙏 Acknowledgments

- Chhattisgarh Government for the project requirements
- Next.js team for the excellent framework
- MongoDB team for the reliable database solution
- jsPDF library for PDF generation capabilities

---

**🏛️ Built for the Chhattisgarh Government to enhance citizen services and improve public administration efficiency.**
