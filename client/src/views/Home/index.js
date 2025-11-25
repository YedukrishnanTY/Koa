'use client';
import { palettes } from '@/common/palettes'
import { Button } from '@/components/ui/button'
import { getProfileDetails } from '@/services/Auth.services';
import { useRouter } from 'next/navigation';
import React from 'react'


export default function LandingPage({ }) {

  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const getDetails = async () => {
    setLoading(true);
    await getProfileDetails()
      .then((res) => {
        router.push('/dashboard');
      })
      .catch((err) => {
        localStorage.removeItem('a');
        setLoading(false);
      }).finally(() => {
      });
  };
  React.useEffect(() => {
    getDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16" style={{
      // Dark mode gradient background
      background: `linear-gradient(180deg, ${palettes.slate[900]} 0%, #111827 100%)`,
      color: palettes.slate[100]
    }}>

      {/* HERO Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 py-20 lg:py-32">
        <div className="lg:w-7/12 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter">
            Financial clarity,
            <span className="block mt-2" style={{ color: palettes.primary[400] }}> Effortlessly tracked.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 font-light" style={{ color: palettes.slate[100] }}>
            Cross-platform expense tracking that moves with you. Simple, private, and focused on providing actionable insights into your money.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Primary Button: Register */}
            <Button
              onClick={() => router.push('/register')}
              className="px-8 py-3 rounded-xl text-lg shadow-lg"
              style={{
                backgroundColor: palettes.primary[400],
                color: palettes.slate[900], // Darker text on vibrant background
                // Added focus/hover effects via className mock
                boxShadow: `0 4px 15px -3px ${palettes.primary[600]}`,
                borderRadius: '8px'
              }}>
              Start Tracking Now
            </Button>

            {/* Secondary Button: Login */}
            <Button
              onClick={() => router.push('/login')}
              className="px-8 py-3 rounded-xl text-lg border"
              style={{
                color: palettes.primary[400],
                borderColor: palettes.primary[400],
                backgroundColor: 'transparent',
                borderRadius: '8px'
              }}>
              Already a user
            </Button>
          </div>
        </div>
        {/* Visual Placeholder (Revamped style) */}
        <div className="lg:w-5/12 hidden lg:block">
          <div className="relative p-8 rounded-2xl shadow-2xl backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${palettes.primary[400]}40` }}>
            <div className="h-64 rounded-xl bg-gray-700/50 flex items-center justify-center text-gray-400 font-mono text-sm">
              {/* Dashboard Preview Mockup */}
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full" style={{ backgroundColor: palettes.primary[400] + '33' }}></div>
            <div className="absolute -top-4 -right-4 w-6 h-6 rounded-full" style={{ backgroundColor: palettes.primary[400] + '33' }}></div>
          </div>
        </div>

      </header>

      {/* FEATURES Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Built for how you manage money</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="p-8 rounded-2xl border transition duration-300 hover:shadow-primary-lg"
            style={{ backgroundColor: palettes.slate[900], borderColor: palettes.primary[400] + '20' }}>
            <div className="text-3xl mb-3" style={{ color: palettes.primary[400] }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Cross‑platform</h3>
            <p className="text-gray-400 text-sm">Use it on the web or app — your data always stays in sync across all your devices with real-time updates.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="p-8 rounded-2xl border transition duration-300 hover:shadow-primary-lg"
            style={{ backgroundColor: palettes.slate[900], borderColor: palettes.primary[400] + '20' }}>
            <div className="text-3xl mb-3" style={{ color: palettes.primary[400] }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Privacy‑first</h3>
            <p className="text-gray-400 text-sm">We only store what’s necessary for your experience. Your data is encrypted, and you maintain complete ownership and control.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="p-8 rounded-2xl border transition duration-300 hover:shadow-primary-lg"
            style={{ backgroundColor: palettes.slate[900], borderColor: palettes.primary[400] + '20' }}>
            <div className="text-3xl mb-3" style={{ color: palettes.primary[400] }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Fast actions</h3>
            <p className="text-gray-400 text-sm">Quick-add widgets, receipt scan integration, and smart category suggestions make tracking effortless and fast.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Get Started in 3 Simple Steps</h2>
        <div className="max-w-2xl mx-auto">
          <ol className="space-y-6 text-lg text-gray-300">
            {/* Step 1 */}
            <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
              <span className="text-2xl font-extrabold flex-shrink-0" style={{ color: palettes.primary[400] }}>01</span>
              <div>
                <strong className="font-semibold text-white">Create your secure account.</strong>
                <p className="text-sm text-gray-400">Takes less than 60 seconds to set up your profile and login credentials.</p>
              </div>
            </li>
            {/* Step 2 */}
            <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
              <span className="text-2xl font-extrabold flex-shrink-0" style={{ color: palettes.primary[400] }}>02</span>
              <div>
                <strong className="font-semibold text-white">Log your first expense.</strong>
                <p className="text-sm text-gray-400">Quick-add expenses or utilize advanced features like receipt scanning and bank import (if supported).</p>
              </div>
            </li>
            {/* Step 3 */}
            <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
              <span className="text-2xl font-extrabold flex-shrink-0" style={{ color: palettes.primary[400] }}>03</span>
              <div>
                <strong className="font-semibold text-white">Track, organize, and gain insights.</strong>
                <p className="text-sm text-gray-400">Organize with budgets and tags, then view clear, interactive charts in your personal dashboard.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* TRUST / CTA Section (Call to Action) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-2xl" style={{
          backgroundColor: palettes.primary[400],
          color: palettes.slate[900], // Dark text on light background
        }}>
          <div className="text-center md:text-left">
            <div className="text-2xl font-extrabold">Ready to take control of your financial life?</div>
            <div className="text-md mt-2 font-medium">Join now.</div>
          </div>
          <div className="mt-6 md:mt-0 flex-shrink-0">
            <Button style={{
              color: palettes.primary[400],
              backgroundColor: palettes.slate[100],
              boxShadow: `0 4px 15px -3px rgba(0,0,0,0.2)`,
            }} onClick={() => router.push('/register')}
              className="px-6 py-3 rounded-xl font-bold text-lg">
              Create account
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-700/50 text-sm text-gray-400">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">© {new Date().getFullYear()} ExpenseTracker — Financial Freedom, Simplified.</div>
          {/* The original placeholder links are commented out:
                    <div className="flex gap-4">
                        <a href="/privacy" className="hover:text-white transition duration-200">Privacy</a>
                        <a href="/terms" className="hover:text-white transition duration-200">Terms</a>
                        <a href="/contact" className="hover:text-white transition duration-200">Contact</a>
                    </div> */}
        </div>
      </footer>
    </div>
  )
}
