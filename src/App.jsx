import React from "react";
import { useState } from "react";

const scenarios = [
  {
    id: 1,
    title: "Cold Call Objection Handling",
    prompt: "You’re calling a prospect and they say, 'We’re already working with another vendor.' How do you respond?"
  },
  {
    id: 2,
    title: "Qualifying the Lead",
    prompt: "You’re speaking with a lead. What are three questions you ask to qualify them?"
  }
];

export default function App() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const scenario = scenarios[step];

  const analyzeResponse = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Scenario: ${scenario.prompt}\n\nResponse: ${input}` })
      });
      const data = await response.json();
      setFeedback(data.reply);
    } catch {
      setFeedback("⚠️ Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const nextScenario = () => {
    setStep((prev) => (prev + 1) % scenarios.length);
    setInput("");
    setFeedback("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 font-sans">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-2">Scenario {step + 1}: {scenario.title}</h2>
        <p className="mb-4">{scenario.prompt}</p>
        <textarea
          className="w-full border rounded-lg p-2 text-base focus:outline-none focus:ring"
          rows={4}
          placeholder="Type your response here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <div className="flex gap-2 mt-3">
          <button onClick={analyzeResponse} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
            {loading ? "Analyzing..." : "Submit"}
          </button>
          <button onClick={nextScenario} className="border px-4 py-2 rounded-xl hover:bg-gray-100">Next</button>
        </div>
        {feedback && <p className="mt-3 font-medium whitespace-pre-line">{feedback}</p>}
      </div>
    </div>
  );
}
