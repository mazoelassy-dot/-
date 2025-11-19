import React from 'react';
import { GradingResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  result: GradingResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const percentage = Math.round((result.score / result.maxScore) * 100);
  
  const chartData = [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: result.maxScore - result.score },
  ];
  
  const COLORS = ['#4f46e5', '#e2e8f0'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-indigo-500 animate-fade-in">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">نتيجة التصحيح</h2>
        <div className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
          مدعوم بـ Gemini 2.5
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Score Section */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl">
          <div className="relative w-40 h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">{result.score}</span>
              <span className="text-sm text-slate-500">من {result.maxScore}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700 mb-1">
                {percentage >= 90 ? 'ممتاز!' : percentage >= 75 ? 'جيد جداً' : percentage >= 50 ? 'جيد' : 'يحتاج تحسين'}
            </p>
            <p className="text-sm text-slate-500">النسبة المئوية: {percentage}%</p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="lg:col-span-2 space-y-6">
            
          {/* Transcribed Text */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">النص المستخرج من الصورة</h3>
            <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded border border-slate-200">
              "{result.transcribedText}"
            </p>
          </div>

          {/* Reasoning & Feedback */}
          <div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">التقييم العام</h3>
             <p className="text-slate-600 leading-relaxed mb-4">{result.feedback}</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center">
                        <svg className="w-5 h-5 ms-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        نقاط القوة
                    </h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                        {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center">
                        <svg className="w-5 h-5 ms-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        نقاط تحتاج تحسين
                    </h4>
                    <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                        {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
             </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
            <span className="font-bold block mb-1">سبب الدرجة:</span>
            {result.reasoning}
          </div>

        </div>
      </div>
    </div>
  );
};