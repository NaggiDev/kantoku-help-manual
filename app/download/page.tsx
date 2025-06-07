'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AppVersion {
  version: string;
  releaseDate: string;
  fileSize: string;
  downloadUrl: string;
  type: 'latest' | 'beta' | 'stable';
}

// Mock data for Android app versions
const appVersions: AppVersion[] = [
  {
    version: '2.1.0',
    releaseDate: '2024-01-15',
    fileSize: '45.2 MB',
    downloadUrl: '/downloads/kantoku-v2.1.0.apk',
    type: 'latest'
  },
  {
    version: '2.0.5',
    releaseDate: '2024-01-10',
    fileSize: '44.8 MB',
    downloadUrl: '/downloads/kantoku-v2.0.5.apk',
    type: 'stable'
  },
  {
    version: '2.1.0-beta.3',
    releaseDate: '2024-01-12',
    fileSize: '45.5 MB',
    downloadUrl: '/downloads/kantoku-v2.1.0-beta.3.apk',
    type: 'beta'
  },
  {
    version: '2.0.4',
    releaseDate: '2023-12-20',
    fileSize: '44.5 MB',
    downloadUrl: '/downloads/kantoku-v2.0.4.apk',
    type: 'stable'
  },
  {
    version: '2.0.3',
    releaseDate: '2023-12-15',
    fileSize: '44.2 MB',
    downloadUrl: '/downloads/kantoku-v2.0.3.apk',
    type: 'stable'
  }
];

export default function DownloadPage() {
  const { t } = useLanguage();
  const [showVersions, setShowVersions] = useState(false);

  const latestVersion = appVersions.find(v => v.type === 'latest') || appVersions[0];

  const handleDownload = (downloadUrl: string, version: string) => {
    // In a real application, you would handle the actual download here
    // For now, we'll just show an alert
    alert(`Download started for Kantoku v${version}. In a real app, this would download from: ${downloadUrl}`);
  };

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case 'latest':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'stable':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 md:p-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <div className="language-switcher-dark">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('home', 'navigation')}
        </Link>
      </div>

      <div className="text-center max-w-4xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {t('title', 'download')}
        </h1>
        <p className="text-lg md:text-xl mb-12 text-slate-300">
          {t('subtitle', 'download')}
        </p>

        {/* Main Download Button */}
        <div className="mb-12">
          <button
            onClick={() => handleDownload(latestVersion.downloadUrl, latestVersion.version)}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('downloadButton', 'download')} v{latestVersion.version}
          </button>
          <p className="text-sm text-slate-400 mt-3">
            {t('fileSize', 'download')}: {latestVersion.fileSize} • {t('releaseDate', 'download')}: {latestVersion.releaseDate}
          </p>
        </div>

        {/* Show/Hide Versions Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
          >
            <svg className={`w-4 h-4 mr-2 transition-transform ${showVersions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showVersions ? t('hideVersions', 'download') : t('showVersions', 'download')}
          </button>
        </div>

        {/* Versions List */}
        {showVersions && (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              {t('availableVersions', 'download')}
            </h3>
            <div className="space-y-4">
              {appVersions.map((version, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-semibold mr-3">
                        {t('version', 'download')} {version.version}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVersionTypeColor(version.type)}`}>
                        {t(version.type, 'download')}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>{t('releaseDate', 'download')}: {version.releaseDate}</p>
                      <p>{t('fileSize', 'download')}: {version.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleDownload(version.downloadUrl, version.version)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('downloadLink', 'download')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
            <div className="text-slate-300 space-y-2">
              <p>• Android 6.0 (API level 23) or higher</p>
              <p>• 100 MB free storage space</p>
              <p>• Internet connection required</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
