'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 md:p-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {t('title', 'homepage')}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-slate-300">
          {t('subtitle', 'homepage')}
        </p>

        {/* Placeholder Search Bar */}
        <div className="mb-12">
          <input
            type="search"
            placeholder={t('searchPlaceholder', 'navigation')}
            className="w-full max-w-md px-4 py-3 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-lg"
            disabled // Disabled until search is implemented
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/getting-started/step-1" className="block bg-slate-700 hover:bg-slate-600 p-6 rounded-lg transition-colors shadow-md group">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">{t('gettingStarted', 'homepage')}</h3>
            </div>
            <p className="text-slate-300">{t('gettingStartedDesc', 'homepage')}</p>
          </Link>
          
          <Link href="/features/overview" className="block bg-slate-700 hover:bg-slate-600 p-6 rounded-lg transition-colors shadow-md group">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">{t('features', 'homepage')}</h3>
            </div>
            <p className="text-slate-300">{t('featuresDesc', 'homepage')}</p>
          </Link>

          <Link href="/advanced/automation" className="block bg-slate-700 hover:bg-slate-600 p-6 rounded-lg transition-colors shadow-md group">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">{t('advanced', 'homepage')}</h3>
            </div>
            <p className="text-slate-300">{t('advancedDesc', 'homepage')}</p>
          </Link>

          <Link href="/troubleshooting/common-issues" className="block bg-slate-700 hover:bg-slate-600 p-6 rounded-lg transition-colors shadow-md group">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">{t('troubleshooting', 'homepage')}</h3>
            </div>
            <p className="text-slate-300">{t('troubleshootingDesc', 'homepage')}</p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
            <div className="text-slate-300">{t('statsGuides', 'homepage')}</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-green-400 mb-2">4</div>
            <div className="text-slate-300">{t('statsCategories', 'homepage')}</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-slate-300">{t('statsSupport', 'homepage')}</div>
          </div>
        </div>

        <p className="mt-12 text-sm text-slate-400">
          {t('browseText', 'homepage')} <Link href="/getting-started/step-1" className="underline hover:text-blue-400">{t('documentationSection', 'homepage')}</Link>.
        </p>
      </div>
    </main>
  );
}
