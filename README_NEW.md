# Delivery & Transportation Mobile App

A React Native mobile application built with [Expo](https://expo.dev) that connects users with transporters for seamless delivery management. The app features real-time tracking, in-app chat, payment processing, and comprehensive order management.

## 🎯 Features

### User Features

- **Authentication**: Secure login and registration
- **Delivery Management**: Create, manage, and track deliveries
- **Real-time Tracking**: Monitor transporter location in real-time
- **In-app Chat**: Direct communication with transporters
- **Payment Integration**: Secure payment processing
- **Order History**: View past deliveries and transactions
- **User Profile**: Manage account settings and notifications

### Transporter Features

- **Dashboard**: Overview of available and completed jobs
- **Job Search**: Find and accept delivery jobs
- **Real-time Tracking**: Share live location with users
- **In-app Chat**: Communicate with customers
- **Earnings History**: Track completed deliveries and earnings
- **Profile Management**: Manage availability and profile information

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Routing**: Expo Router
- **State Management**: Custom stores (Zustand pattern)
- **Backend**: Firebase
- **Build Tools**: Metro, Babel
- **Linting**: ESLint


## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (configured in `firebaseConfig.js`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Project_Practicum_Mobile_Year_3
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update `firebaseConfig.js` with your Firebase project credentials

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run on a device or emulator**
   - Press `w` for web preview
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

## 📝 Available Scripts

- `npm start` - Start the development server
- `npm run lint` - Run ESLint to check code quality
- `npm run web` - Start web development server

## 🔧 Configuration Files

- **tsconfig.json** - TypeScript configuration
- **tailwind.config.js** - Tailwind CSS configuration for NativeWind
- **eslint.config.js** - ESLint rules and configuration
- **babel.config.js** - Babel transpiler configuration
- **metro.config.js** - Metro bundler configuration
- **app.json** - Expo app configuration

## 🌍 Environment Variables

Create a `.env` file in the root directory with the following variables (if needed):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 🎨 Styling

This project uses **NativeWind** which brings Tailwind CSS to React Native. All styling is done using Tailwind utility classes.

### Global Styles

- `global.css` - Application-wide styles

## 📱 Deployment

To build and deploy the application:

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Or use local builds with expo
expo build:android
expo build:ios
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is part of a practicum assignment for Mobile Year 3.

## 📞 Support

For issues and questions, please refer to the [Expo documentation](https://docs.expo.dev) or create an issue in the repository.

## 🔗 Useful Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NativeWind](https://www.nativewind.dev)
