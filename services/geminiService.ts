import { GoogleGenAI, Type } from "@google/genai";
import { GradingCriteria, GradingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url part (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const gradeStudentPaper = async (
  file: File,
  criteria: GradingCriteria
): Promise<GradingResult> => {
  try {
    const base64Data = await fileToGenerativePart(file);
    const mimeType = file.type;

    const prompt = `
      أنت معلم خبير للغة العربية ومصحح آلي دقيق جداً.
      مهمتك هي تصحيح ورقة إجابة طالب مكتوبة بخط اليد.
      
      البيانات المرجعية:
      1. الإجابة النموذجية (أو السياق المطلوب): "${criteria.standardAnswer}"
      2. الدرجة العظمى للسؤال: ${criteria.maxScore}
      3. تعليمات إضافية: "${criteria.instructions}"

      الخطوات المطلوبة:
      1. قم بقراءة النص المكتوب بخط اليد في الصورة بدقة (OCR).
      2. قارن إجابة الطالب بالإجابة النموذجية من حيث المعنى والسياق وليس مجرد تطابق الكلمات. الإجابة قد تكون بأسلوب الطالب الخاص.
      3. حدد درجة الطالب من ${criteria.maxScore} بناءً على مدى صحة المعنى واكتمال الفكرة.
      4. قدم تغذية راجعة (Feedback) بناءة، ووضح نقاط القوة والضعف.

      ملاحظة هامة: كن عادلاً، وتجاوز عن الأخطاء الإملائية البسيطة إذا لم تخل بالمعنى، إلا إذا كانت التعليمات تنص على غير ذلك.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcribedText: { type: Type.STRING, description: "النص الذي تم استخراجه من الصورة كما كتبه الطالب" },
            score: { type: Type.NUMBER, description: "الدرجة التي حصل عليها الطالب" },
            feedback: { type: Type.STRING, description: "ملخص التقييم العام" },
            strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "نقاط القوة في الإجابة" 
            },
            weaknesses: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "نقاط الضعف أو ما ينقص الإجابة"
            },
            reasoning: { type: Type.STRING, description: "سبب منح هذه الدرجة بالتفصيل" },
          },
          required: ["transcribedText", "score", "feedback", "strengths", "weaknesses", "reasoning"],
        },
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text) as Omit<GradingResult, 'maxScore'>;
      return { ...result, maxScore: criteria.maxScore };
    } else {
      throw new Error("لم يتم استلام استجابة صالحة من النموذج.");
    }

  } catch (error) {
    console.error("Error grading paper:", error);
    throw error;
  }
};