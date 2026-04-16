import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useModeStore } from '../store/modeStore';
import PersonaSelector from './PersonaSelector';

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personaId, setPersonaId] = useState('standard');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const mode = useModeStore((state) => state.mode) || 'founder';
  
  // Theme colors based on mode
  const isVC = mode === 'vc';
  const themeAccentClass = isVC ? 'text-amber-forensic' : 'text-green-forensic';
  const themeBorderClass = isVC ? 'border-amber-forensic' : 'border-green-forensic';
  const themeBgClass = isVC ? 'bg-amber-forensic' : 'bg-green-forensic';
  const themeHoverClass = isVC ? 'neon-hover-amber' : 'neon-hover-green';
  const themeGlassClass = isVC ? 'glass-amber tracking-widest border-amber-forensic/30' : 'glass-green tracking-widest border-green-forensic/30';
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported format. Please upload a PDF pitch deck.');
      return;
    }
    
    if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit
      setError('File size too large. Maximum size is 20MB.');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await api.analyzeDeck(file, mode as 'founder' | 'vc', personaId);
      // Redirect to dashboard with the session ID
      navigate(`/dashboard/${result.session_id}`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : 'An expected error occurred during upload.');
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12">
      <div 
        className={`relative glass p-10 border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center text-center
          ${isDragging ? `${themeBorderClass} bg-black/60` : 'border-white/10 bg-black/40'}
          ${isVC ? 'hover:border-amber-forensic/50' : 'hover:border-green-forensic/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden" 
        />
        
        {!file ? (
          <>
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center ${themeGlassClass}`}
            >
              <Upload className={`w-8 h-8 ${themeAccentClass}`} />
            </motion.div>
            
            <h3 className="font-bebas text-3xl text-off-white tracking-[0.1em] mb-2">
              UPLOAD PITCH DECK
            </h3>
            <p className="font-pixel text-[10px] text-muted-forensic leading-relaxed mb-8 uppercase tracking-wider">
              Drag and drop your PDF here, or click to browse.
              <br />Max file size: 20MB.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`glass px-8 py-4 border border-white/20 text-off-white font-pixel text-[10px] tracking-[0.2em] uppercase ${themeHoverClass} transition-all duration-300`}
            >
              Select File
            </button>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full"
          >
            <div className={`p-6 border ${themeBorderClass} bg-black/40 rounded flex items-center gap-4 mb-8 text-left`}>
              <div className={`p-3 rounded bg-white/5`}>
                <File className={`w-6 h-6 ${themeAccentClass}`} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-pixel text-[12px] text-off-white truncate tracking-wider">{file.name}</p>
                <p className="font-pixel text-[8px] text-muted-forensic mt-1 tracking-widest">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
              {!isUploading && (
                <button 
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-forensic hover:text-red-forensic" />
                </button>
              )}
            </div>

            {isVC && !isUploading && (
              <div className="mb-8 w-full">
                <div className="font-pixel text-[8px] text-muted-forensic uppercase tracking-[0.2em] mb-3 text-left">
                  SELECT INVESTOR FINGERPRINT
                </div>
                <PersonaSelector selectedId={personaId} onSelect={setPersonaId} />
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 border border-red-forensic/30 bg-red-forensic/10 rounded flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-red-forensic shrink-0 mt-0.5" />
                <p className="font-pixel text-[9px] text-red-100 leading-relaxed tracking-wider uppercase">{error}</p>
              </div>
            )}

            <button 
              onClick={handleAnalyze}
              disabled={isUploading}
              className={`w-full glass py-5 border ${themeBorderClass} ${themeAccentClass} font-pixel text-[12px] tracking-[0.2em] uppercase ${themeHoverClass} transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  INITIATING FORENSIC SCAN...
                </>
              ) : (
                <>START ANALYSIS</>
              )}
            </button>

            {!isUploading && (
              <button 
                onClick={() => navigate(`/dashboard/demo-${mode}`)}
                className="w-full mt-4 glass py-4 border border-white/10 text-muted-forensic font-pixel text-[9px] tracking-[0.2em] uppercase hover:text-off-white hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Target className="w-4 h-4" />
                TRY DEMO (FOODDEL.PDF)
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
