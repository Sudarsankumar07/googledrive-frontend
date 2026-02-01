# CloudDrive Frontend

A modern, responsive Google Drive clone built with React and Tailwind CSS. Features a beautiful UI with dark/light mode support, drag-and-drop file uploads, and comprehensive file management.

![CloudDrive](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7.3-646cff)

## ✨ Features

- **🔐 Authentication**
  - User registration with auto-activation
  - Secure login with JWT tokens
  - Password reset via email
  - Persistent sessions

- **📁 File Management**
  - Drag-and-drop file uploads
  - Create, rename, and delete folders
  - Upload multiple files simultaneously
  - Real-time upload progress tracking
  - File preview and download

- **🎨 Modern UI/UX**
  - Clean, intuitive interface
  - Dark and light mode toggle
  - Responsive design (mobile-friendly)
  - Smooth animations and transitions
  - Toast notifications for feedback

- **📂 Navigation**
  - Breadcrumb navigation
  - Folder hierarchy support
  - Quick access sidebar

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite 7.3 | Build Tool |
| Tailwind CSS 4 | Styling |
| React Router DOM | Routing |
| Axios | HTTP Client |
| Formik + Yup | Form Handling & Validation |
| Lucide React | Icons |
| React Toastify | Notifications |
| React Dropzone | File Upload |

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Setup

1. **Clone the repository**
   ```bash
   cd googledrive-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Login, Register, Password Reset
│   ├── dashboard/      # File list, Upload, Folders
│   ├── layouts/        # Dashboard & Auth layouts
│   └── routing/        # Protected routes
├── context/
│   ├── AuthContext.jsx # Authentication state
│   ├── FileContext.jsx # File management state
│   └── ThemeContext.jsx# Dark/light mode
├── services/
│   ├── api.js          # Axios instance
│   ├── authService.js  # Auth API calls
│   ├── fileService.js  # File API calls
│   └── folderService.js# Folder API calls
└── App.jsx             # Main app component
```

## 🎨 Theme Customization

The app supports both dark and light modes. Toggle is available in the header.

Custom colors are defined in `src/index.css`:

```css
@theme {
  --color-primary-*: /* Blue shades */
  --color-accent-*:  /* Emerald shades */
  --color-dark-*:    /* Dark mode grays */
}
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔗 API Integration

The frontend connects to the backend API at the URL specified in `VITE_API_URL`. 

### API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/files` - List files in folder
- `POST /api/files/upload` - Upload file
- `DELETE /api/files/:id` - Delete file
- `GET /api/folders` - List folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/:id` - Rename folder
- `DELETE /api/folders/:id` - Delete folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React + Vite + Tailwind CSS
