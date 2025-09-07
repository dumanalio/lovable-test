import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

function LogoUpload({ onLogoUpload, logoSize, onLogoSizeChange }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Maximale Größe: 5MB");
      return;
    }

    setUploadedLogo(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Call parent callback
    if (onLogoUpload) {
      onLogoUpload(file);
    }
  };

  const removeLogo = () => {
    setUploadedLogo(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Logo Hochladen
        </h3>
        <p className="text-gray-300">Laden Sie Ihr Logo für die Website hoch</p>
      </div>

      {!uploadedLogo ? (
        <motion.div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? "border-lovable-400 bg-lovable-400/10"
              : "border-white/20 hover:border-white/40"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-lovable-400" />
            <h4 className="text-lg font-semibold mb-2">Logo hier ablegen</h4>
            <p className="text-gray-400 mb-4">
              oder klicken Sie hier, um eine Datei auszuwählen
            </p>
            <p className="text-sm text-gray-500">
              Unterstützte Formate: PNG, JPG, SVG (max. 5MB)
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="glassmorphism p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Logo Vorschau</h4>
              <button
                onClick={removeLogo}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <img
                src={previewUrl}
                alt="Logo Preview"
                className={`object-contain rounded-lg transition-all duration-300`}
                style={{
                  width: `${logoSize}px`,
                  height: `${logoSize}px`,
                }}
              />
            </div>

            {/* Logo Size Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Logo Größe
                </label>
                <span className="text-sm text-gray-400">{logoSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={logoSize}
                onChange={(e) => onLogoSizeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    ((logoSize - 20) / (100 - 20)) * 100
                  }%, #e5e7eb ${
                    ((logoSize - 20) / (100 - 20)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Klein</span>
                <span>Groß</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                {uploadedLogo.name} (
                {(uploadedLogo.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Das Logo wird automatisch in der Navigation und im Footer angezeigt
        </p>
      </div>
    </div>
  );
}

export default LogoUpload;
