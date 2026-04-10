import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Shield, AlertTriangle, Info, Moon, Sun } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [openSummary, setOpenSummary] = useState({});

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/analyze-policy", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };
  const toggleSummary = (index) => {
  setOpenSummary((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};


  const getRiskColor = (level) => {
    const colors = {
      High: darkMode 
        ? { bar: "#ef4444", badge: "bg-red-900/50 text-red-300 border-red-800" }
        : { bar: "#ef4444", badge: "bg-red-50 text-red-700 border-red-200" },
      Medium: darkMode
        ? { bar: "#eab308", badge: "bg-yellow-900/50 text-yellow-300 border-yellow-800" }
        : { bar: "#eab308", badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      Low: darkMode
        ? { bar: "#22c55e", badge: "bg-green-900/50 text-green-300 border-green-800" }
        : { bar: "#22c55e", badge: "bg-green-50 text-green-700 border-green-200" },
    };
    return colors[level] || colors.Low;
  };

  const getImportanceColor = (level) => {
    const colors = {
      High: darkMode
        ? { bar: "#a855f7", badge: "bg-purple-900/50 text-purple-300 border-purple-800" }
        : { bar: "#a855f7", badge: "bg-purple-50 text-purple-700 border-purple-200" },
      Medium: darkMode
        ? { bar: "#3b82f6", badge: "bg-blue-900/50 text-blue-300 border-blue-800" }
        : { bar: "#3b82f6", badge: "bg-blue-50 text-blue-700 border-blue-200" },
      Low: darkMode
        ? { bar: "#64748b", badge: "bg-slate-800 text-slate-300 border-slate-700" }
        : { bar: "#64748b", badge: "bg-slate-50 text-slate-700 border-slate-200" },
    };
    return colors[level] || colors.Low;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" 
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        darkMode 
          ? "bg-slate-900 border-slate-700" 
          : "bg-white border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}>
                  Policy Document Intelligence
                </h1>
                <p className={`mt-1 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  AI-powered analysis for clear policy understanding
                </p>
              </div>
            </motion.div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all ${
                darkMode 
                  ? "bg-slate-800 hover:bg-slate-700" 
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {darkMode ? (
                <Sun size={24} className="text-yellow-500" />
              ) : (
                <Moon size={24} className="text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300 ${
            darkMode 
              ? "bg-slate-900 border-slate-700" 
              : "bg-white border-slate-200"
          }`}
        >
          <div className={`px-8 py-6 border-b ${
            darkMode 
              ? "bg-indigo-950/30 border-slate-700" 
              : "bg-gradient-to-r from-indigo-50 to-blue-50 border-slate-200"
          }`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>
              <UploadCloud size={24} className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
              Upload Document
            </h2>
            <p className={`text-sm mt-1 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>
              Upload your policy document in PDF format for intelligent analysis
            </p>
          </div>

          <div className="p-8">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              darkMode 
                ? "border-slate-600 hover:border-indigo-500" 
                : "border-slate-300 hover:border-indigo-400"
            }`}>
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${
                  darkMode ? "bg-indigo-950/50" : "bg-indigo-50"
                }`}>
                  <FileText size={32} className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
                </div>
                
                <div>
                  <label className="cursor-pointer">
                    <span className={`font-medium ${
                      darkMode 
                        ? "text-indigo-400 hover:text-indigo-300" 
                        : "text-indigo-600 hover:text-indigo-700"
                    }`}>
                      Choose a file
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <p className={`text-sm mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>or drag and drop</p>
                </div>

                {file && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? "bg-indigo-950/50 border-indigo-800" 
                      : "bg-indigo-50 border-indigo-200"
                  }`}>
                    <FileText size={16} className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
                    <span className={`text-sm font-medium ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}>
                      {file.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                darkMode ? "shadow-indigo-900/30" : "shadow-indigo-600/20"
              }`}
            >
              <UploadCloud size={20} />
              {loading ? "Analyzing Document..." : "Analyze Policy Document"}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>
                Analysis Results
              </h2>
              <p className={`mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                {result.analysis.length} clauses analyzed and simplified
              </p>
            </div>

            <div className="grid gap-6">
              {result.analysis.map((item, idx) => {
                const riskColor = getRiskColor(item.risk_level);
                const importanceColor = getImportanceColor(item.importance);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 ${
                      darkMode 
                        ? "bg-slate-900 border-slate-700" 
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {/* Color Indicator Bar */}
                    <div className="flex h-2">
                      <div 
                        className="flex-1" 
                        style={{ backgroundColor: riskColor.bar }}
                      ></div>
                      <div 
                        className="flex-1" 
                        style={{ backgroundColor: importanceColor.bar }}
                      ></div>
                    </div>

                    <div className="p-6">
                      {/* Header with Metadata */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                          darkMode 
                            ? "bg-slate-800 text-slate-300 border-slate-700" 
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          <FileText size={14} />
                          {item.clause_type}
                        </div>

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${riskColor.badge}`}>
                          <AlertTriangle size={14} />
                          <span className="uppercase text-xs tracking-wider">Risk:</span>
                          {item.risk_level}
                        </div>

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${importanceColor.badge}`}>
                          <Shield size={14} />
                          <span className="uppercase text-xs tracking-wider">Importance:</span>
                          {item.importance}
                        </div>
                      </div>

                      {/* Original Clause */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-1 h-6 rounded-full ${
                            darkMode ? "bg-slate-600" : "bg-slate-400"
                          }`}></div>
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                            Original Clause
                          </h3>
                        </div>
                        <p className={`leading-relaxed pl-4 border-l-2 ${
                          darkMode 
                            ? "text-slate-300 border-slate-700" 
                            : "text-slate-700 border-slate-200"
                        }`}>
                          {item.original_clause}
                        </p>
                      </div>

                      {/* Simplified Summary */}
                      <div className={`relative rounded-xl p-5 border-2 ${
                        darkMode 
                          ? "bg-gradient-to-br from-emerald-950/30 to-green-950/30 border-emerald-800" 
                          : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                      }`}>
                        <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full ${
                          darkMode ? "bg-emerald-600" : "bg-emerald-500"
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Info size={14} className="text-white" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Simplified
                            </span>
                          </div>
                        </div>
                        <p className={`leading-relaxed font-medium mt-2 ${
                          darkMode ? "text-emerald-100" : "text-emerald-900"
                        }`}>
                          {item.simplified}
                        </p>
                      </div>
                      <button
  onClick={() => toggleSummary(idx)}
  className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold transition ${
    darkMode
      ? "text-indigo-400 hover:text-indigo-300"
      : "text-indigo-600 hover:text-indigo-700"
  }`}
>
  <Info size={16} />
  {openSummary[idx] ? "Hide AI Summary" : "View AI Summary"}
</button>
{openSummary[idx] && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    transition={{ duration: 0.3 }}
    className={`mt-4 rounded-xl p-5 border ${
      darkMode
        ? "bg-slate-800 border-slate-700 text-slate-200"
        : "bg-slate-50 border-slate-200 text-slate-800"
    }`}
  >
    <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">
      AI Generated Summary
    </p>
    <p className="leading-relaxed">
      {item.summary}
    </p>
  </motion.div>
)}


                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className={`mt-20 border-t transition-colors duration-300 ${
        darkMode 
          ? "border-slate-700 bg-slate-900" 
          : "border-slate-200 bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className={`text-sm ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            Powered by AI • Natural Language Processing • React + Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}