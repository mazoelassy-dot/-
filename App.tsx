import React, { useState } from 'react';
import { Header } from './components/Header';
import { CriteriaForm } from './components/CriteriaForm';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';
import { GradingCriteria, GradingResult, LoadingState } from './types';
import { gradeStudentPaper } from './services/geminiService';

const App: React.FC = () => {
  const [criteria, setCriteria] = useState<GradingCriteria>({
    standardAnswer: '',
    maxScore: 10,
    instructions: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGrade = async () => {
    if (!selectedFile) {
      setErrorMsg('الرجاء رفع ورقة إجابة الطالب.');
      return;
    }
    if (!criteria.standardAnswer.trim()) {
      setErrorMsg('الرجاء إدخال الإجابة النموذجية.');
      return;
    }

    setLoadingState(LoadingState.PROCESSING);
    setErrorMsg(null);
    setResult(null);

    try {
      const data = await gradeStudentPaper(selectedFile, criteria);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setLoadingState(LoadingState.ERROR);
      setErrorMsg('حدث خطأ أثناء معالجة الورقة. الرجاء المحاولة مرة أخرى والتأكد من وضوح الصورة.');
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedFile(null);
    setLoadingState(LoadingState.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-4xl">
        
        {/* Input Section - Hide only if processing */}
        <div className={loadingState === LoadingState.PROCESSING ? 'opacity-50 pointer-events-none' : ''}>
          <CriteriaForm 
            criteria={criteria} 
            setCriteria={setCriteria} 
            disabled={loadingState === LoadingState.PROCESSING || loadingState === LoadingState.SUCCESS}
          />
          
          {loadingState !== LoadingState.SUCCESS && (
             <FileUpload 
               onFileSelect={setSelectedFile} 
               disabled={loadingState === LoadingState.PROCESSING}
             />
          )}
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-col items-center gap-4">
          {errorMsg && (
            <div className="w-full bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-4">
              <p className="font-bold">تنبيه</p>
              <p>{errorMsg}</p>
            </div>
          )}

          {loadingState === LoadingState.IDLE && (
            <button
              onClick={handleGrade}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 px-12 rounded-xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              بدء التصحيح
            </button>
          )}

          {loadingState === LoadingState.PROCESSING && (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-indigo-800 font-medium animate-pulse">جاري قراءة خط اليد وتحليل الإجابة...</p>
              <p className="text-sm text-slate-500">قد يستغرق هذا بضع ثوانٍ</p>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && (
             <button
             onClick={handleReset}
             className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
             </svg>
             تصحيح ورقة أخرى
           </button>
          )}
        </div>

        {/* Results Display */}
        {result && loadingState === LoadingState.SUCCESS && (
          <ResultCard result={result} />
        )}

      </main>
    </div>
  );
};

export default App;