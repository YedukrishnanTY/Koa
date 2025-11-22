import React from 'react'

// Landing page React component (Tailwind CSS assumed).
// This is intended to be your public homepage / marketing page — no user data shown here.
// Routes: /signup and /login are used for CTAs; replace with your router links if different.

export default function LandingPage({}) {
  return (
    <div className="min-h-screen bg-gradient-to-b">
      {/* NAV */}
      

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8 py-12">
        <div className="lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            A smarter way to track money — 
            <span className="text-indigo-600">for everyone</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl">Cross-platform expense tracking that moves with you. Use it in the browser, on mobile via our app, or inside your favorite apps with deep webview support. Simple, private, and focused on what matters — your money.</p>

          <div className="mt-6 flex gap-3">
            <a href="/register" className="px-5 py-3 bg-indigo-600 text-white rounded-md font-medium">Start free</a>
            <a href="#features" className="px-5 py-3 border rounded-md text-sm">See features</a>
          </div>

        </div>

        <div className="lg:w-1/2 w-full">
          <div className="w-full rounded-2xl shadow-xl overflow-hidden bg-white">
            <div className="p-6">
              <div className="text-xs text-gray-500">Preview (public)</div>
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Net balance</div>
                <div className="text-2xl font-semibold mt-1">$—</div>
                <div className="mt-4 text-xs text-gray-500">Sign up to see a personalized dashboard and connect bank accounts.</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold">Built for how you manage money</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium">Cross‑platform</h3>
            <p className="mt-2 text-sm text-gray-600">Use it on the web, in mobile WebView, or install as a PWA — your data stays synced.</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium">Privacy‑first</h3>
            <p className="mt-2 text-sm text-gray-600">We only store what’s necessary. Local-first options and exportable data.</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium">Fast actions</h3>
            <p className="mt-2 text-sm text-gray-600">Quick-add, receipt scan, and smart suggestions make tracking effortless.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-4 space-y-4 text-sm text-gray-700 list-decimal list-inside">
          <li>Create an account (or continue as guest).</li>
          <li>Quick-add expenses or connect a supported bank/account for automatic import.</li>
          <li>Organize with budgets, tags, and subscriptions — then track insights in your dashboard.</li>
        </ol>
      </section>

      {/* TRUST / CTA */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-indigo-600 text-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="font-semibold">Ready to take control of your money?</div>
            <div className="text-sm mt-1">Sign up and get your first 30 days free — no card required.</div>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="/signup" className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium">Create account</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} ExpenseTracker — Built with care.</div>
          <div className="flex gap-4">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
