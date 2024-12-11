# Task Forge 🛠️

Task Forge is a modern task management application built with React, TypeScript, and Vite. It leverages AI to help you organize and manage tasks more efficiently.

## Features ✨

- **AI-Powered Task Generation**: Automatically generate structured tasks from natural language input
- **Voice Input Support**: Create tasks using voice commands with Deepgram integration
- **Modern UI**: Built with Radix UI components and styled with Tailwind CSS
- **Theme Support**: Light and dark mode support
- **Type Safety**: Built with TypeScript for better development experience
- **Real-time Updates**: Instant updates using modern React patterns

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn

## Getting Started 🚀

1. Clone the repository:
```bash
git clone https://github.com/mattrob333/Task_forge.git
cd Task_forge
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file:
```bash
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Scripts 📝

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack 💻

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [OpenAI API](https://openai.com/)
- [Deepgram](https://deepgram.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (for state management)

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Security 🔒

Please note that this project uses API keys. Never commit your `.env` file or expose your API keys in the codebase.
