import { Sparkles } from "lucide-react";

function AIInsightCard({ insight }) {
    return (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6 shadow-sm border border-purple-200 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm text-gray-700 leading-relaxed">
                    {insight}
                </p>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 192, 203, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.5);
        }
      `}</style>
        </div>
    );
}

export default AIInsightCard;