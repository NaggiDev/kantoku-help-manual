'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useLanguage();
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16 flex items-center shadow-sm">
      <div className="w-full flex justify-between items-center px-6">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          Kantoku Help
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/download"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('downloadButton', 'download')}
          </Link>
          <div className="relative">
            <input
              type="search"
              placeholder={t('search', 'navigation')}
              className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}