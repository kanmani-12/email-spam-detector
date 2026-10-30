import { useState } from "react";
import "./App.css";
import EmailForm from "./EmailForm.jsx";
import Results from "./Results.jsx";
import { validateSender, checkSubject, checkContent } from "./regexChecks.js";
import { findSpamKeywords, findAbnormalSequences } from "./automata.js";

function App() {
  const [result, setResult] = useState(null);

  const analyze = ({ sender, subject, message }) => {
    const patterns = [];
    const alerts = [];
    let score = 0;

    // Regex checks
    if (!validateSender(sender)) {
      alerts.push("Invalid sender email format");
      score += 2;
    }

    const subjectFlags = checkSubject(subject);
    const contentFlags = checkContent(message);
    patterns.push(...subjectFlags, ...contentFlags);
    score += subjectFlags.length + contentFlags.length;

    // Finite automata checks
    const keywordHits = findSpamKeywords(message);
    const sequenceHits = findAbnormalSequences(message);

    keywordHits.forEach((hit) => {
      patterns.push(`Spam keyword "${hit.word}" found ${hit.count} time(s)`);
      score += hit.count;
      if (hit.count >= 3) {
        alerts.push(`Repeated spam keyword: "${hit.word}"`);
      }
    });

    sequenceHits.forEach((hit) => {
      patterns.push(hit);
      score += 2;
    });

    // Classification
    let label = "safe";
    if (score >= 6) label = "spam";
    else if (score >= 3) label = "suspicious";

    if (label === "spam") alerts.push("High risk: likely spam or phishing");

    setResult({ label, patterns, alerts });
  };

  return (
    <div className="app">
      <h1>Email Security Analyzer</h1>
      <p className="subtitle">
        Check an email for spam and suspicious patterns.
      </p>
      <EmailForm onAnalyze={analyze} />
      {result && <Results result={result} />}
    </div>
  );
}

export default App;
