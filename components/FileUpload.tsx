import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء رفع ملف صورة فقط (JPG, PNG)');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">2</span>
        رفع ورقة الطالب
      </h2>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed border-slate-200' : 'cursor-pointer border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input 
            type="file" 
            ref={inputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
            disabled={disabled}
        />
        
        {preview ? (
            <div className="relative inline-block">
                <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center rounded-lg">
                    <span className="bg-white px-3 py-1 rounded-full text-sm text-slate-700 shadow opacity-0 hover:opacity-100">تغيير الصورة</span>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
                <div>
                    <p className="text-lg font-medium text-slate-700">اضغط للرفع أو اسحب الصورة هنا</p>
                    <p className="text-sm text-slate-500">يدعم ملفات الصور (PNG, JPG)</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};