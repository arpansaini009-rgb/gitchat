import { useState } from "react";
import "./button.css";

type Format = "uppercase" | "lowercase" | "titlecase" | "trim";

const formatText = (value: string, format: Format): string => {
  switch (format) {
    case "uppercase":
      return value.toUpperCase();
    case "lowercase":
      return value.toLowerCase();
    case "titlecase":
      return value.replace(/\b\w/g, (character) => character.toUpperCase());
    case "trim":
      return value.trim().replace(/\s+/g, " ");
  }
};

export default function Formatter() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<Format>("uppercase");
  const [copied, setCopied] = useState(false);
  const result = formatText(text, format);

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Text formatter</h1>
      <label htmlFor="format">Format</label>
      <select
        id="format"
        value={format}
        onChange={(event) => setFormat(event.target.value as Format)}
        style={{ display: "block", margin: "0.5rem 0 1rem", padding: "0.5rem" }}
      >
        <option value="uppercase">UPPERCASE</option>
        <option value="lowercase">lowercase</option>
        <option value="titlecase">Title Case</option>
        <option value="trim">Trim and normalize spaces</option>
      </select>

      <label htmlFor="input">Text</label>
      <textarea
        id="input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste text here"
        rows={6}
        style={{ display: "block", boxSizing: "border-box", width: "100%", marginTop: "0.5rem", padding: "0.75rem" }}
      />

      <div className="result-heading">
        <h2>Result</h2>
        <button className="button" type="button" onClick={copyResult} disabled={!result}>
          {copied ? "Copied!" : "Copy result"}
        </button>
      </div>
      <output className="result" aria-live="polite">
        {result}
      </output>
    </main>
  );
}
