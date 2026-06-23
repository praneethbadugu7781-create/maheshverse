"use client";

import { useState } from "react";
import { Lock, User, Loader2, Building2 } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setUsername("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200 relative overflow-hidden shadow-lg text-gray-900">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#de6040]" />
        
        {/* Brand */}
        <div className="text-center mb-8 pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#de6040]/10 border border-[#de6040]/25 text-[#de6040] mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-2xl font-black tracking-widest text-[#de6040]">
            MAHESH VERSE
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 font-medium tracking-wide">ADMIN PORTAL SECURE CONTROL</p>
        </div>

        {error && (
          <div className="mb-5 text-xs bg-red-50 border border-red-150 text-red-600 p-3.5 rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label style={{ fontFamily: 'Urbanist, sans-serif' }} className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter admin username"
                className="w-full rounded-xl bg-white border border-gray-200 pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontFamily: 'Urbanist, sans-serif' }} className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-white border border-gray-200 pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-2.5 italic text-center">
              Hint: Default credentials are admin / admin123
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#de6040] hover:bg-[#de6040]/90 py-3.5 text-sm font-extrabold text-white shadow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all duration-300 cursor-pointer uppercase tracking-widest"
          >
            {loading ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
