# Veterinary Booking System

A comprehensive web-based veterinary appointment booking system that connects pet owners with veterinarians. Built with Node.js/Express backend, MongoDB database, and React.js frontend with Tailwind CSS.

## 🐕 Features

### For Pet Owners
- User registration and authentication
- Browse and filter veterinarians by location and specialization
- Book appointments with available time slots
- Complete pre-visit dog diagnosis questionnaires
- Choose payment methods (Card/Cash)
- View appointment history and diagnosis summaries
- Manage pet information and profile

### For Veterinarians
- Doctor registration and authentication
- Manage appointment schedules and availability
- View patient appointments and diagnosis summaries
- Complete appointments and add notes
- Update profile and clinic information

### System Features
- Secure JWT-based authentication
- Real-time appointment booking
- Automated diagnosis summary generation
- Payment integration ready (Stripe)
- Responsive UI with Tailwind CSS
- Dog protection-themed branding with paw icons

## 🚀 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator
- Stripe for payments
- CORS enabled

### Frontend
- React.js (JSX, no TypeScript)
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API calls
- React Hook Form for forms
- React Hot Toast for notifications
- Heroicons for icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/veterinary_booking
JWT_SECRET=your_jwt_secret_key_change_this_in_production
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React application:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Veterinary_Booking_System/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── DiagnosisQuestionnaire.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── diagnosisRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── booking/
    │   │   ├── common/
    │   │   ├── dashboard/
    │   │   ├── diagnosis/
    │   │   └── payment/
    │   ├── contexts/
    │   │   ├── AuthContext.jsx
    │   │   └── AppointmentContext.jsx
    │   ├── pages/
    │   ├── utils/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🗃️ Database Schema

### Users Collection
- User authentication and profile information
- Pet information (embedded)
- Booking history references
- Location-based data

### Doctors Collection
- Doctor authentication and profile
- Specialization and clinic information
- Available time slots (embedded)
- Appointment references

### Appointments Collection
- Booking details and status
- Payment information
- References to users and doctors
- Diagnosis questionnaire reference

### DiagnosisQuestionnaires Collection
- Comprehensive pet health questionnaire responses
- Auto-generated summaries
- Urgency level assessment
- References to appointments

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User/Doctor login
- `POST /api/auth/doctor/register` - Doctor registration

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/pets` - Add pet information
- `GET /api/users/appointments` - Get user appointments

### Doctors
- `GET /api/doctors` - Get all doctors (with filters)
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/:id/slots` - Get available slots
- `GET /api/doctors/dashboard/appointments` - Doctor appointments

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/complete` - Complete appointment

### Diagnosis
- `POST /api/diagnosis/submit` - Submit questionnaire
- `GET /api/diagnosis/:id` - Get questionnaire details

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/cash-payment` - Set cash payment

## 🎨 UI/UX Features

### Design Elements
- Dog protection theme with paw icons and heart logo
- Primary blue color scheme (#3b82f6)
- Secondary green accents (#22c55e)
- Responsive design for all devices
- Clean, modern interface with Tailwind CSS

### User Experience
- Intuitive navigation with clear call-to-actions
- Form validation with helpful error messages
- Loading states and success/error notifications
- Mobile-first responsive design
- Accessible components with proper ARIA labels

## 🌍 Locations Supported

- Battaramulla
- Colombo
- Nugegoda
- Dehiwala
- Rajagiriya
- Malabe

## 🔮 Remaining Implementation

The following components still need to be created to complete the system:
- Doctor Registration Page
- User Dashboard
- Doctor Dashboard
- Doctor List Page
- Appointment Booking Flow
- Diagnosis Questionnaire Form
- Payment Pages
- Appointment Confirmation

## 🧪 Testing

To test the complete booking flow:
1. Register as a user
2. Browse available doctors
3. Book an appointment
4. Complete diagnosis questionnaire
5. Select payment method
6. Confirm appointment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐾 About

PawCare - Your Pet's Health is Our Priority. This system focuses on dog care with specialized questionnaires and veterinary services tailored for canine health needs.