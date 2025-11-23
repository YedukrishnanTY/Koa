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
      }).finally(() => {
        setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-b">

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8 py-12">
        <div className="lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            A smarter way to track money —
            <span style={{ color: palettes.primary[400] }}> for everyone</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl" style={{ color: palettes.slate[100] }}>Cross-platform expense tracking that moves with you. Use it in the browser, on mobile via our app. Simple, private, and focused on what matters .</p>

          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.push('/register')} className="px-5 py-3 rounded-md font-bold  "
              style={{
                backgroundColor: palettes.primary[400],
                color: palettes.slate[100],
              }}>Register</Button>
            <Button onClick={() => router.push('/login')} className="px-5 py-3 border rounded-md text-sm font-bold"
              style={{
                color: palettes.primary[400],
                backgroundColor: palettes.slate[100],
              }}>Already a user</Button>
          </div>

        </div>


      </header>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold">Built for how you manage money</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-bold" style={{ color: palettes.primary[400], }}>Cross‑platform</h3>
            <p className="mt-2 text-sm text-gray-600">Use it on the web or app — your data always stays in sync.</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-bold" style={{ color: palettes.primary[400], }}>Privacy‑first</h3>
            <p className="mt-2 text-sm text-gray-600">We only store what’s necessary. Local-first options and exportable data.</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-bold" style={{ color: palettes.primary[400], }}>Fast actions</h3>
            <p className="mt-2 text-sm text-gray-600">Quick-add, receipt scan, and smart suggestions make tracking effortless.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-4 space-y-4 text-sm text-gray-700 list-decimal list-inside" style={{ color: palettes.slate[100] }}>
          <li>Create an account.</li>
          <li>Quick-add expenses or connect a supported bank/account for automatic import.</li>
          <li>Organize with budgets, tags, and subscriptions — then track insights in your dashboard.</li>
        </ol>
      </section>

      {/* TRUST / CTA */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-indigo-600 text-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between" style={{
          backgroundColor: palettes.primary[400],
          color: palettes.slate[100],
        }}>
          <div>
            <div className="font-semibold">Ready to take control of your money?</div>
            <div className="text-sm mt-1">Sign up to create your account and begin your experience with all the features we’ve built for you.</div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button style={{
              color: palettes.primary[400],
              backgroundColor: palettes.slate[100],
            }} onClick={() => router.push('/register')}

              className="px-4 py-2 bg-white text-indigo-600 rounded-md font-bold">Create account</Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4" style={{ color: palettes.slate[100] }}>
          <div>© {new Date().getFullYear()} ExpenseTracker — Built with care.</div>
          {/* <div className="flex gap-4">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div> */}
        </div>
      </footer>
    </div>
  )
}
