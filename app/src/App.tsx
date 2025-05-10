import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { JournalView } from "./JournalView";
import { InteractiveView } from "./InteractiveView";
import { CounselorView } from "./CounselorView";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Color Your Chaos</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [activeView, setActiveView] = useState<'journal' | 'interactive' | 'counselor'>('journal');

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4">Color Your Chaos</h1>
        <Authenticated>
          <p className="text-xl text-slate-600 mb-8">
            Welcome back, {loggedInUser?.email ?? "friend"}!
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveView('journal')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeView === 'journal'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => setActiveView('interactive')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeView === 'interactive'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Interactive
            </button>
            <button
              onClick={() => setActiveView('counselor')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeView === 'counselor'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              AI Counselor
            </button>
          </div>
          {activeView === 'journal' ? <JournalView /> : 
           activeView === 'interactive' ? <InteractiveView /> : 
           <CounselorView />}
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">Sign in to start coloring your chaos</p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}
