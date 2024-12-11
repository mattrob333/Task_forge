import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { Brain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="min-h-screen bg-background">
        <div className="fixed top-2 right-2 z-50">
          <ThemeToggle />
        </div>
        <header className="border-b">
          <div className="container flex items-center h-16 px-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <h1 className="text-xl font-bold">TaskForge AI</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl px-4">
            {children}
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}