import { Brain, TrendingUp, Target, Globe, Zap } from "lucide-react";

export default function AIAnalysis() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative animate-slide-up">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse-glow"></div>
          <div className="relative bg-slate-800/90 backdrop-blur-sm border-slate-700 p-6 transform hover:scale-105 transition-all duration-300 rounded-2xl">
            <div className="space-y-4 p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Arthik AI Analysis</h3>
                </div>
                <div className="flex items-center text-green-400 font-semibold">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Live
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                <div className="text-slate-300 text-sm">
                  💬 "What's the best investment strategy for 2025?"
                </div>
                <div className="bg-blue-600/20 rounded-lg p-3 border-l-4 border-blue-400">
                  <p className="text-blue-100 text-sm">
                    Based on current market analysis, I recommend a diversified approach focusing on AI-driven sectors, clean energy, and emerging markets...
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <Target className="h-6 w-6 text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300">Precision</p>
                  <p className="text-sm font-bold text-white">94%</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <Globe className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300">Markets</p>
                  <p className="text-sm font-bold text-white">Global</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300">Speed</p>
                  <p className="text-sm font-bold text-white">Real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
