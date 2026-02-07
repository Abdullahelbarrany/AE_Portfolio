# Windows Portfolio App

## Overview
The Windows Portfolio App simulates a Windows desktop environment, allowing users to interact with folders and files. It serves as a digital portfolio showcasing images, a CV, and work samples. The application is built using React and TypeScript, providing a modern and responsive user experience.

## Features
- **Desktop Environment**: A simulated desktop interface with folders for Images, CV, and Work Samples.
- **File Viewer**: A component to view files, including images and documents.
- **Taskbar**: Quick access to open applications and folders.
- **Routing**: Navigate between the Home and About pages seamlessly.
- **LLM Integration**: A small language model using Gemini for enhanced interactivity.

## Project Structure
```
windows-portfolio-app
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── components
│   │   ├── Desktop.tsx
│   │   ├── Window.tsx
│   │   ├── Taskbar.tsx
│   │   ├── Folder.tsx
│   │   └── FileViewer.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── styles
│   │   └── main.css
│   ├── types
│   │   └── index.ts
│   └── assets
│       ├── folders
│       │   ├── CV
│       │   ├── Images
│       │   └── WorkSamples
│       └── icons
├── public
│   └── index.html
├── server
│   ├── index.ts
│   ├── routes
│   │   └── api.ts
│   └── llm
│       └── geminiClient.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

## Setup Instructions
1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd windows-portfolio-app
   ```

2. **Install Dependencies**: 
   ```
   npm install
   ```

3. **Run the Application**: 
   ```
   npm run dev
   ```

4. **Access the App**: Open your browser and navigate to `http://localhost:3000`.

## Technologies Used
- React
- TypeScript
- Vite
- Gemini LLM

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.