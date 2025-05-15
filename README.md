# Roots And Routes Backend
The backend for the RootsandRoutes platform, providing secure API, business logic and integrations for the frontend.

---

## Overview
This repo is a Node.js/Express application that drives the RootsandRoutes travel services. It manages user,vendor and Guest authentication, payment processes, Location using Google maps, Events and Travel bookings and integration with third-party services(e.g., Cloudinary, Google Oauth,Facebook and Apple Oauth). Designed for reliability,security and scaling.

---

## Architecture

- **Node.js** with **Express.js** for RESTful APIs
- **MongoDB** (Mongoose) for data persistence
- **Passport.js** for authentication (JWT, Google OAuth)
- **Cloudinary** for media storage
- **Winston** and **Morgan** for logging
- **Docker** for CI/CD 

---

## Features

- Secure user registration and authentication (JWT, Google OAuth)
- Role-based access control
- Accomodation and Event bookings
- Google map for location tracking 
- Profile management (including image uploads)
- Password reset via email
- Robust logging and error handling
- Environment-based configuration

---

## Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn
- MongoDB instance (local/cloud)
- Cloudinary account (for media)
- Google OAuth credentials (for social login)

### Installation

```bash
git clone https://github.com/yourorg/rootsandroutes.git
cd rootsandroutes
cd api
npm install
```
### Configuration

Create a `.env` file in the project root:

```env
Mongo_Uri=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

```

### Running the Application

```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

Server runs at `http://localhost:4000` by default.

---

## Usage
- **API Documentation:** Postman Docs available at [postman](https://documenter.getpostman.com/view/30530080/2sB2j4hBbk)
- **Authentication:** Use JWT Bearer tokens for protected endpoints.

## Endpoints


## Security

- All secrets and credentials must be stored in environment variables.
- Passwords are hashed using bcrypt.
- JWT tokens are used for stateless authentication.
- Input validation and error handling are enforced throughout.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request





