import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Upload, Image, Save, ArrowLeft } from 'lucide-react';
import LogoUpload from './LogoUpload';
import { useLogo } from '../contexts/LogoContext';

function AdminPanel({ onBackClick }) {
  const { logoUrl, logoSize, updateLogo, updateLogoSize, clearLogo } = useLogo();
  const [activeTab, setActiveTab] = useState('logo');

  const tabs = [
    { id: 'logo', name: 'Logo', icon: Image },
    { id: 'general', name: 'Allgemein', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBackClick}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Zurück zur Website</span>
          </button>
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Panel</h1>
          <p className="text-gray-300">Verwalten Sie Ihre Website-Einstellungen</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-xl backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-lovable-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div className="glassmorphism p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Logo verwalten</h2>
                <p className="text-gray-300 mb-6">
                  Laden Sie Ihr Logo hoch, um es in der Navigation und im Footer zu verwenden.
                </p>

                <LogoUpload 
                  onLogoUpload={updateLogo} 
                  logoSize={logoSize}
                  onLogoSizeChange={updateLogoSize}
                />

                {logoUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Save className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-400">Logo erfolgreich hochgeladen!</h3>
                        <p className="text-sm text-gray-300">Das Logo wird jetzt auf der Website angezeigt.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Current Logo Preview */}
              {logoUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glassmorphism p-6 rounded-2xl"
                >
                  <h3 className="text-xl font-bold mb-4">Aktuelles Logo</h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={logoUrl}
                        alt="Current Logo"
                        className="object-contain bg-white/10 rounded-lg p-2 transition-all duration-300"
                        style={{
                          width: `${logoSize}px`,
                          height: `${logoSize}px`
                        }}
                      />
                      <div>
                        <p className="text-gray-300 mb-2">Dieses Logo wird in der Navigation angezeigt</p>
                        <div className="text-sm text-gray-400 mb-3">
                          Aktuelle Größe: {logoSize}px
                        </div>
                        <button
                          onClick={clearLogo}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                          Logo entfernen
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Size Presets */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Schnelle Größenauswahl:</p>
                      <div className="flex space-x-2">
                        {[20, 32, 48, 64, 80].map((size) => (
                          <button
                            key={size}
                            onClick={() => updateLogoSize(size)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              logoSize === size
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="glassmorphism p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Allgemeine Einstellungen</h2>
              <p className="text-gray-300">
                Weitere Einstellungen werden in Kürze verfügbar sein.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminPanel;
