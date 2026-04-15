import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function Settings() {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    updateProfile({
      name: (form.get('name') ?? '').toString().trim() || user.name,
      email: (form.get('email') ?? '').toString().trim() || user.email,
      role: (form.get('role') ?? '').toString().trim() || user.role,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <div className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="inline-block" aria-label="AVL Copilot home">
          <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="AVL Copilot" className="h-8 w-auto" />
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary"
        >
          ← Back to chat
        </Link>
      </div>

      <div className="flex-1 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase mb-3">
            // Settings
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight mb-10">
            Your account.
          </h1>

          <section className="bg-surface-container-low border border-white/5 p-8 mb-6">
            <h2 className="font-headline font-bold text-lg mb-6">Profile</h2>
            <form onSubmit={handleSave}>
              <LabeledInput label="Name" name="name" defaultValue={user.name} />
              <LabeledInput label="Email" name="email" type="email" defaultValue={user.email} />
              <LabeledInput label="Role" name="role" defaultValue={user.role} />
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-primary text-black font-mono font-black uppercase tracking-[0.3em] text-xs px-6 py-3 hover:bg-white transition-all rounded-full"
                >
                  Save changes
                </button>
                {saved && (
                  <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                    Saved
                  </span>
                )}
              </div>
            </form>
          </section>

          <section className="bg-surface-container-low border border-white/5 p-8 mb-6">
            <h2 className="font-headline font-bold text-lg mb-6">Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Current plan
                </div>
                <div className="font-headline text-xl font-bold">
                  {user.plan === 'active' ? 'Active' : 'Trial'}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/30 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  {user.plan === 'active' ? 'Active' : 'Trial'}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low border border-white/5 p-8">
            <h2 className="font-headline font-bold text-lg mb-2">Sign out</h2>
            <p className="text-sm text-on-surface-variant mb-5">
              Ends the session on this device.
            </p>
            <button
              type="button"
              onClick={() => {
                signOut();
                navigate('/signin');
              }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono font-bold uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-full transition-all"
            >
              Sign out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  name,
  defaultValue,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-surface border border-white/10 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 font-mono text-sm focus:border-primary focus:outline-none focus:ring-0 transition-colors"
      />
    </div>
  );
}
