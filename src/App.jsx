import { useAuth } from "./hooks/useAuth.js";
import { supabase } from "./lib/supabase.js";
import { ToastProvider } from "./components/Toast.jsx";
import Login from "./components/Login.jsx";
import CommandCenter from "./CommandCenter.jsx";

export default function App() {
  const { session, loading, signIn, signOut } = useAuth();

  // If Supabase isn't configured, skip auth and show dashboard directly
  if (!supabase) {
    return (
      <ToastProvider>
        <CommandCenter />
      </ToastProvider>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) return <Login onSignIn={signIn} />;

  return (
    <ToastProvider>
      <CommandCenter onSignOut={signOut} />
    </ToastProvider>
  );
}
