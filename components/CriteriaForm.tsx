import React from 'react';
import { GradingCriteria } from '../types';

interface CriteriaFormProps {
  criteria: GradingCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<GradingCriteria>>;
  disabled: boolean;
}

export const CriteriaForm: React.FC<CriteriaFormProps> = ({ criteria, setCriteria, disabled }) => {
  const handleChange = (field: keyof GradingCriteria, value: string | number) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">1</span>
        إعدادات التصحيح
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">الإجابة النموذجية (المرجع)</label>
          <textarea
            disabled={disabled}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-700 disabled:bg-slate-100"
            placeholder="اكتب هنا الإجابة المثالية التي سيقيس الذكاء الاصطناعي عليها..."
            value={criteria.standardAnswer}
            onChange={(e) => handleChange('standardAnswer', e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">يمكن للذكاء الاصطناعي فهم المعنى حتى لو اختلفت صياغة الطالب عن هذا النص.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">الدرجة العظمى</label>
             <input
                type="number"
                disabled={disabled}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 disabled:bg-slate-100"
                value={criteria.maxScore}
                onChange={(e) => handleChange('maxScore', Number(e.target.value))}
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">تعليمات إضافية (اختياري)</label>
             <input
                type="text"
                disabled={disabled}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 disabled:bg-slate-100"
                placeholder="مثال: تجاهل الأخطاء الإملائية، ركز على التواريخ..."
                value={criteria.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
             />
          </div>
        </div>
      </div>
    </div>
  );
};