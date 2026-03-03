'use client';

import { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Register() {
    const [tab, setTab] = useState<'register' | 'signin'>('signin');
    const [registrationType, setRegistrationType] = useState<'individual' | 'organization' | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [orgName, setOrgName] = useState("");
    const [orgType, setOrgType] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/");
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCred.user.uid;
            
            // Create user document in Firestore
            await setDoc(doc(db, "users", userId), {
                userId,
                email,
                accountType: registrationType,
                name: registrationType === 'individual' ? name : orgName,
                organizationType: registrationType === 'organization' ? orgType : null,
                createdAt: new Date().toISOString(),
            });
            
            router.replace("/");
        } catch (err: any) {
            setError(err.message || "Failed to register");
        }
    };

    const renderSignInForm = () => (
        <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">Sign In</button>
        </form>
    );

    const renderIndividualForm = () => (
        <form className="space-y-4" onSubmit={handleRegister}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-400">
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">Register</button>
        </form>
    );

    const renderOrganizationForm = () => (
        <form className="space-y-4" onSubmit={handleRegister}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      type="text"
                      placeholder="Your Organization"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select organization type</option>
                    <option value="student">Student Organization</option>
                    <option value="nonprofit">Non-profit</option>
                    <option value="business">Business</option>
                    <option value="government">Government</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="info@organization.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-400">
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">Register</button>
        </form>
    );

    if (tab === 'signin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div className="flex space-x-4 mb-8">
                        <button onClick={() => setTab('signin')} className={`flex-1 py-2 font-medium rounded-lg transition ${tab === 'signin' ? 'bg-blue-600 text-white' : 'text-gray-700 border border-gray-300'}`}>Sign In</button>
                        <button onClick={() => setTab('register')} className={`flex-1 py-2 font-medium rounded-lg transition ${tab === 'register' ? 'bg-blue-600 text-white' : 'text-gray-700 border border-gray-300'}`}>Register</button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1 text-center">Sign In</h1>
                    <p className="text-gray-600 text-center mb-8 text-sm">Enter your credentials</p>
                    {renderSignInForm()}
                </div>
            </div>
        );
    }

    if (!registrationType) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div className="flex space-x-4 mb-8">
                         <button onClick={() => setTab('signin')} className={`flex-1 py-2 font-medium rounded-lg transition ${tab === 'signin' ? 'bg-blue-600 text-white' : 'text-gray-700 border border-gray-300'}`}>Sign In</button>
                        <button onClick={() => setTab('register')} className={`flex-1 py-2 font-medium rounded-lg transition ${tab === 'register' ? 'bg-blue-600 text-white' : 'text-gray-700 border border-gray-300'}`}>Register</button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h1>
                    <p className="text-gray-600 text-center mb-8">Choose how you'd like to register</p>
                    <div className="space-y-4">
                        <button onClick={() => setRegistrationType('individual')} className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition">
                            <User className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Register as Individual</p>
                                <p className="text-sm text-gray-600">Personal account</p>
                            </div>
                        </button>
                        <button onClick={() => setRegistrationType('organization')} className="w-full flex items-center justify-center space-x-3 border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition">
                            <Building2 className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Register as Organization</p>
                                <p className="text-sm text-gray-600">Organization account</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <button onClick={() => setRegistrationType(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4">← Back</button>
                <h1 className="text-3xl font-bold text-gray-900 mb-1 text-center">
                    {registrationType === 'individual' ? 'Register as Individual' : 'Register as Organization'}
                </h1>
                <p className="text-gray-600 text-center mb-8 text-sm">Fill in your details below</p>
                {registrationType === 'individual' ? renderIndividualForm() : renderOrganizationForm()}
            </div>
        </div>
    );
}
