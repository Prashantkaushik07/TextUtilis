import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";
import { jsPDF } from "jspdf";
import { Base64 } from "js-base64"; // For Base64 encryption/decryption

// ------------------------------ Possible Extra Imports ------------------------------
import Tesseract from 'tesseract.js'; // For OCR
import { franc } from 'franc'; // For language detection
import { fetchDefinition } from './dictionaryApi'; // Example for dictionary
// import { fetchSynonyms } from './dictionaryApi';
export default function TextForm(props) {
  // ------------------------------ STATE HOOKS ------------------------------
  const [text, setText] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [paragraphCount, setParagraphCount] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");
  // eslint-disable-next-line
  const [selectedWord, setSelectedWord] = useState("");
  
  const [definition, setDefinition] = useState("");

  // Additional states for new features
  const [theme, setTheme] = useState("light"); // For dark/light mode
  const [highlightColor, setHighlightColor] = useState("#FFFF00"); // For preview highlight
  const [secondText, setSecondText] = useState(""); // For text comparison
  const [isReadingMode, setIsReadingMode] = useState(false); // For reading mode (fullscreen)

  // For advanced Regex replace
  const [regexPattern, setRegexPattern] = useState("");
  const [regexReplaceText, setRegexReplaceText] = useState("");

  // For line-based utilities
  const [linesRemoved, setLinesRemoved] = useState(false);

  // ------------------------------ THEME TOGGLE -----------------------------
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // ------------------------------ READING MODE TOGGLE ----------------------
  const handleToggleReadingMode = () => {
    setIsReadingMode(!isReadingMode);
  };

  // ------------------------------ FILE UPLOAD (TXT/DOCX) -------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    if (fileType === "txt") {
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    } else if (fileType === "docx") {
      // Lazy-load docx-parser only when needed
      const docxParser = await import("docx-parser");
      reader.onload = async (event) => {
        const content = await docxParser.parseDocx(event.target.result);
        setText(content);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload a .txt or .docx file.");
    }
  };

  // ------------------------------ OCR INTEGRATION (Placeholder) -----------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If Tesseract is installed
    Tesseract.recognize(file, 'eng').then(({ data: { text: ocrResult } }) => {
      setText(prev => prev + "\n" + ocrResult);
    }).catch(err => console.error(err));

    alert("Placeholder for OCR. Install Tesseract.js and uncomment the code to use it.");
  };

  // ------------------------------ FILE EXPORTS ------------------------------
  const handleExportAsTxt = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "exported_text.txt");
  };

  const handleExportAsPdf = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(text, 180); // Wrap text for typical page width
    pdf.text(lines, 10, 10);
    pdf.save("exported_text.pdf");
  };

  const handleExportAsDocx = () => {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(text)],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "exported_text.docx");
    });
  };

  // ------------------------------ TEXT TRANSFORMS ------------------------------
  const handleUpClick = () => {
    setText(text.toUpperCase());
  };

  const handleLoClick = () => {
    setText(text.toLowerCase());
  };

  const handleTitleCaseClick = () => {
    const newText = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(newText);
  };

  const handleClearClick = () => {
    setText("");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!");
  };

  const handleCapitalizeClick = () => {
    const newText = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(newText);
  };

  const handleExtraSpace = () => {
    // Remove extra spaces
    const newText = text.split(/[ ]+/).join(" ");
    setText(newText);
  };

  const handleScrambleWordsClick = () => {
    const newText = text.split(" ").sort(() => Math.random() - 0.5).join(" ");
    setText(newText);
  };

  const handleRemoveNumbersClick = () => {
    const newText = text.replace(/\d+/g, "");
    setText(newText);
  };

  // New advanced transform: reverse text
  const handleReverseText = () => {
    setText(text.split("").reverse().join(""));
  };

  // ------------------------------ FIND & REPLACE ------------------------------
  const handleFindAndReplaceClick = () => {
    if (!findText.trim()) {
      alert("Please enter text to find.");
      return;
    }
    const newText = text.replaceAll(findText, replaceText);
    setText(newText);
    alert(
      `All occurrences of "${findText}" have been replaced with "${replaceText}".`
    );
  };

  // ------------------------------ ADVANCED REGEX REPLACE ----------------------
  const handleRegexReplace = () => {
    if (!regexPattern) {
      alert("Please enter a valid regex pattern.");
      return;
    }
    try {
      const pattern = new RegExp(regexPattern, "g");
      const newText = text.replace(pattern, regexReplaceText);
      setText(newText);
      alert("Regex replacement done!");
    } catch (error) {
      alert("Invalid regex pattern: " + error.message);
    }
  };

  // ------------------------------ LINE-BASED UTILITIES ------------------------
  const handleRemoveDuplicateLines = () => {
    const lines = text.split("\n");
    const uniqueLines = Array.from(new Set(lines));
    setText(uniqueLines.join("\n"));
    setLinesRemoved(true);
  };

  const handleRemoveEmptyLines = () => {
    const lines = text.split("\n");
    const nonEmpty = lines.filter((l) => l.trim() !== "");
    setText(nonEmpty.join("\n"));
  };

  // ------------------------------ LOREM IPSUM ------------------------------
  const handleGenerateLoremIpsumClick = (paragraphs = 1) => {
    const loremIpsum =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    const generatedText = Array(paragraphs).fill(loremIpsum).join("\n\n");
    setText(generatedText);
  };

  // ------------------------------ SPEECH RECOGNITION ------------------------------
  const handleSpeechToTextClick = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech-to-Text is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      alert(`Error occurred: ${event.error}`);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setText((prevText) => `${prevText} ${speechText}`);
    };

    recognition.start();
  };

  // ------------------------------ TRANSLATION ------------------------------
  const handleTranslateClick = async () => {
    if (text.trim() === "") {
      alert("Please enter text to translate.");
      return;
    }

    try {
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: targetLanguage,
          format: "text",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.translatedText) {
        throw new Error("Translation API returned invalid data.");
      }

      setText(data.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Failed to translate text. Please try again.");
    }
  };

  // ------------------------------ REPEATED WORDS/CHARS ------------------------------
  const handleRepeatedWordsClick = () => {
    const words = text.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
    const repeatedWords = Object.entries(wordCounts)
      .filter(([_, count]) => count > 1)
      .map(([word]) => word);

    alert(`Repeated Words: ${repeatedWords.join(", ") || "None"}`);
  };

  const handleRepeatedCharactersClick = () => {
    const charCounts = text.split("").reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});
    const repeatedChars = Object.entries(charCounts)
      .filter(([_, count]) => count > 1)
      .map(([char]) => char);

    alert(`Repeated Characters: ${repeatedChars.join(", ") || "None"}`);
  };

  // ------------------------------ SORT WORDS ------------------------------
  const handleSortWordsClick = (order) => {
    let words = text.split(/\s+/).filter((word) => word.length > 0);
    if (order === "asc") {
      words.sort((a, b) => a.localeCompare(b));
    } else if (order === "desc") {
      words.sort((a, b) => b.localeCompare(a));
    }
    setText(words.join(" "));
  };

  // ------------------------------ TEXT-TO-SPEECH ------------------------------
  const handleSpeakClick = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Set the language or voice here:
      utterance.lang = "hi-IN";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  // ------------------------------ TEXT COMPARISON ------------------------------
  const getTextDifferences = () => {
    const words1 = text.trim().split(/\s+/);
    const words2 = secondText.trim().split(/\s+/);
    const uniqueInFirst = words1.filter((w) => !words2.includes(w));
    const uniqueInSecond = words2.filter((w) => !words1.includes(w));
    return { uniqueInFirst, uniqueInSecond };
  };

  const handleCompareTexts = () => {
    const { uniqueInFirst, uniqueInSecond } = getTextDifferences();
    alert(
      `Unique in First: ${uniqueInFirst.join(", ")}\nUnique in Second: ${uniqueInSecond.join(
        ", "
      )}`
    );
  };

  // ------------------------------ GRAMMAR CHECK (Placeholder) ------------------------------
  const handleGrammarCheck = () => {
    alert("Placeholder for grammar check. Integrate with an API to enable.");
  };

  // ------------------------------ EMOJI SUPPORT ------------------------------
  const handleReplaceWithEmojis = () => {
    let newText = text;
    // Simple examples
    newText = newText.replace(/\bhappy\b/gi, "😊");
    newText = newText.replace(/\blove\b/gi, "❤️");
    setText(newText);
  };

  // ------------------------------ SECURITY FEATURES (Base64) ------------------------------
  const handleEncryptBase64 = () => {
    setText(Base64.encode(text));
  };

  const handleDecryptBase64 = () => {
    try {
      setText(Base64.decode(text));
    } catch (error) {
      alert("Invalid Base64 string");
    }
  };

  // ------------------------------ COLLABORATION (Placeholder) ------------------------------
  const handleStartCollaboration = () => {
    alert("Placeholder for real-time collaboration. Integrate Firebase/WebSockets here.");
  };

  // ------------------------------ GAMIFICATION ------------------------------
  const handleTypingTest = () => {
    alert("Placeholder for typing speed test. Implement timers, WPM calculation, etc.");
  };

  const handleGenerateAnagrams = () => {
    const words = text.trim().split(/\s+/);
    const shuffledWords = words.map((word) => shuffleString(word));
    setText(shuffledWords.join(" "));
  };

  function shuffleString(str) {
    return str
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  // ------------------------------ AI FEATURES (Placeholders) ------------------------------
  const handleSummarizeText = () => {
    alert("Placeholder for AI summary. Integrate with OpenAI or another NLP API.");
  };

  const handleSentimentAnalysis = () => {
    alert("Placeholder for sentiment analysis. Integrate with an NLP library or external API.");
  };

  // ------------------------------ ANALYTICS (Placeholder) ------------------------------
  const handleShowAnalytics = () => {
    alert("Placeholder for analytics. Track user actions and show stats or word clouds.");
  };

  // ------------------------------ LANGUAGE DETECTION (Placeholder) -----------
  const handleDetectLanguage = () => {
    // If using franc:
    const langCode = franc(text);
    alert("Detected language code: " + langCode);
    alert("Placeholder for language detection. Integrate with 'franc' or an API.");
  };

  // ------------------------------ DICTIONARY/THESAURUS (Placeholder) ---------
  const handleDictionaryLookup = async () => {
    const definition = await fetchDefinition(selectedWord);
    setDefinition(definition);
    alert("Placeholder for dictionary API. Implement a real dictionary or thesaurus call here.");
  };

  // ------------------------------ REGEX-BASED EXTRACTION ---------------------
  const handleExtractEmails = () => {
    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    const found = text.match(emailRegex);
    alert(`Extracted Emails:\n${found ? found.join("\n") : "None found"}`);
  };

  const handleExtractURLs = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const found = text.match(urlRegex);
    alert(`Extracted URLs:\n${found ? found.join("\n") : "None found"}`);
  };

  // ------------------------------ RANDOM TEXT (Markov) (Placeholder) ---------
  const handleGenerateRandomText = () => {
    alert("Placeholder for Markov chain or random text generation. Implement if desired.");
  };

  // ------------------------------ SAVE/LOAD SESSIONS (localStorage) ----------
  const handleSaveSession = () => {
    localStorage.setItem("textSession", text);
    alert("Session saved to localStorage!");
  };

  const handleLoadSession = () => {
    const stored = localStorage.getItem("textSession");
    if (stored) {
      setText(stored);
      alert("Session loaded from localStorage!");
    } else {
      alert("No saved session found in localStorage.");
    }
  };

  // ------------------------------ READING-LEVEL ANALYSIS ---------------------
  const handleReadingLevel = () => {
    // Simple Flesch-Kincaid approximation
    // (This is a rough formula; real formula is more involved)
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const syllables = Math.floor(text.length / 3); // crude approximation
    const fleschScore = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    alert(`Approximate Flesch Reading-Ease score: ${fleschScore.toFixed(2)}`);
  };

  // ------------------------------ TEXT STATISTICS ------------------------------
  const calculateCounts = (textString) => {
    const charCount = textString.length;
    const wordCount = textString
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const sentenceCount = textString
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;
    const lineCount = textString.split(/\n/).length;
    return { charCount, wordCount, sentenceCount, lineCount };
  };

  const { charCount, wordCount, sentenceCount, lineCount } = calculateCounts(text);

  // ------------------------------ RENDER ------------------------------
  // If reading mode is ON, show a minimal UI with just the text area
  if (isReadingMode) {
    return (
      <div style={{ padding: "1rem" }}>
        <button className="btn btn-danger mb-2" onClick={handleToggleReadingMode}>
          Exit Reading Mode
        </button>
        <div style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>{text}</div>
      </div>
    );
  }

  return (
    <div className={`container my-3 ${theme === "light" ? "textform-light" : "textform-dark"}`}>
      <h1>{props.heading || "Text Utilities"}</h1>
      <div>{definition}</div>

      {/* Theme Toggle + Reading Mode */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button className="btn btn-secondary" onClick={handleToggleTheme}>
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
        <button className="btn btn-secondary" onClick={handleToggleReadingMode}>
          {isReadingMode ? "Exit" : "Enter"} Reading Mode
        </button>
      </div>

      {/* Choose Highlight Color (for Live Preview) */}
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <label htmlFor="highlightColor" className="form-label">
          Highlight Color for Preview:
        </label>
        <input
          type="color"
          id="highlightColor"
          className="form-control form-control-color"
          value={highlightColor}
          onChange={(e) => setHighlightColor(e.target.value)}
        />
      </div>

      {/* OCR Image Upload */}
      <div className="mb-3">
        <label htmlFor="imageUpload" className="form-label">
          (OCR) Upload an image to extract text:
        </label>
        <input
  type="file"
  accept="image/*"
  className="form-control"
  id="imageUpload"
  onChange={handleImageUpload}
/>
      </div>

      {/* File Upload (TXT, DOCX) */}
      <div className="mb-3">
        <label htmlFor="fileUpload" className="form-label">
          Upload .txt or .docx File
        </label>
        <input
          type="file"
          className="form-control"
          id="fileUpload"
          onChange={handleFileUpload}
        />
      </div>

      {/* Text Area */}
      <div className="mb-3">
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="8"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      {/* Find and Replace */}
      <div className="mb-3 d-flex flex-wrap" style={{ gap: "1rem" }}>
        <div>
          <label htmlFor="findText" className="form-label">
            Find:
          </label>
          <input
            type="text"
            className="form-control"
            id="findText"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="replaceText" className="form-label">
            Replace With:
          </label>
          <input
            type="text"
            className="form-control"
            id="replaceText"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
          />
        </div>
        <button className="btn btn-primary align-self-end" onClick={handleFindAndReplaceClick}>
          Find and Replace
        </button>
      </div>

      {/* Advanced Regex Replace */}
      <div className="mb-3 d-flex flex-wrap" style={{ gap: "1rem" }}>
        <div>
          <label htmlFor="regexPattern" className="form-label">
            Regex Pattern:
          </label>
          <input
            type="text"
            className="form-control"
            id="regexPattern"
            placeholder="e.g. \d+"
            value={regexPattern}
            onChange={(e) => setRegexPattern(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="regexReplace" className="form-label">
            Replace With:
          </label>
          <input
            type="text"
            className="form-control"
            id="regexReplace"
            placeholder="Replacement text"
            value={regexReplaceText}
            onChange={(e) => setRegexReplaceText(e.target.value)}
          />
        </div>
        <button className="btn btn-primary align-self-end" onClick={handleRegexReplace}>
          Regex Replace
        </button>
      </div>

      {/* Line-Based Utilities */}
      <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button className="btn btn-info" onClick={handleRemoveDuplicateLines}>
          Remove Duplicate Lines
        </button>
        <button className="btn btn-info" onClick={handleRemoveEmptyLines}>
          Remove Empty Lines
        </button>
        {linesRemoved && <span>Duplicates Removed!</span>}
      </div>

      {/* Lorem Ipsum */}
      <div className="mb-3">
        <label htmlFor="loremParagraphs" className="form-label">
          Number of Paragraphs:
        </label>
        <input
          type="number"
          className="form-control"
          id="loremParagraphs"
          placeholder="Enter number of paragraphs"
          min="1"
          value={paragraphCount}
          onChange={(e) => setParagraphCount(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => handleGenerateLoremIpsumClick(paragraphCount || 1)}
      >
        Generate Lorem Ipsum
      </button>

      {/* Translation */}
      <div className="mb-3">
        <label htmlFor="languageSelect" className="form-label">
          Select Target Language:
        </label>
        <select
          id="languageSelect"
          className="form-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
      <button className="btn btn-primary mb-3" onClick={handleTranslateClick}>
        Translate Text
      </button>

      {/* Buttons for Text Operations */}
      <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button className="btn btn-primary" onClick={handleUpClick}>
          Uppercase
        </button>
        <button className="btn btn-primary" onClick={handleLoClick}>
          Lowercase
        </button>
        <button className="btn btn-primary" onClick={handleTitleCaseClick}>
          Title Case
        </button>
        <button className="btn btn-primary" onClick={handleScrambleWordsClick}>
          Scramble Words
        </button>
        <button className="btn btn-primary" onClick={handleRemoveNumbersClick}>
          Remove Numbers
        </button>
        <button className="btn btn-primary" onClick={handleCapitalizeClick}>
          Capitalize Case
        </button>
        <button className="btn btn-primary" onClick={handleRepeatedWordsClick}>
          Repeated Words
        </button>
        <button
          className={`btn ${isListening ? "btn-danger" : "btn-primary"}`}
          onClick={handleSpeechToTextClick}
        >
          {isListening ? "Listening..." : "Start Speech-to-Text"}
        </button>
        <button className="btn btn-primary" onClick={() => handleSortWordsClick("asc")}>
          Sort (A-Z)
        </button>
        <button className="btn btn-primary" onClick={() => handleSortWordsClick("desc")}>
          Sort (Z-A)
        </button>
        <button className="btn btn-primary" onClick={handleRepeatedCharactersClick}>
          Repeated Characters
        </button>
        <button className="btn btn-primary" onClick={handleClearClick}>
          Clear
        </button>
        <button className="btn btn-primary" onClick={handleExtraSpace}>
          Remove Extra Spaces
        </button>
        <button className="btn btn-primary" onClick={handleCopyClick}>
          Copy
        </button>
        <button className="btn btn-primary" onClick={handleSpeakClick}>
          Speak (TTS)
        </button>
        <button className="btn btn-warning" onClick={handleReverseText}>
          Reverse Text
        </button>
      </div>

      {/* Text Comparison */}
      <div className="mb-3">
        <h3>Text Comparison</h3>
        <textarea
          placeholder="Enter second text here..."
          className="form-control"
          rows="3"
          value={secondText}
          onChange={(e) => setSecondText(e.target.value)}
        />
        <button className="btn btn-secondary mt-2" onClick={handleCompareTexts}>
          Compare Texts
        </button>
      </div>

      {/* Extra Feature Buttons Row */}
      <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button className="btn btn-info" onClick={handleGrammarCheck}>
          Grammar Check
        </button>
        <button className="btn btn-info" onClick={handleReplaceWithEmojis}>
          Emoji Support
        </button>
        <button className="btn btn-info" onClick={handleEncryptBase64}>
          Encrypt (Base64)
        </button>
        <button className="btn btn-info" onClick={handleDecryptBase64}>
          Decrypt (Base64)
        </button>
        <button className="btn btn-info" onClick={handleStartCollaboration}>
          Start Collaboration
        </button>
        <button className="btn btn-info" onClick={handleTypingTest}>
          Typing Speed Test
        </button>
        <button className="btn btn-info" onClick={handleGenerateAnagrams}>
          Anagram Generator
        </button>
        <button className="btn btn-info" onClick={handleSummarizeText}>
          Summarize (AI)
        </button>
        <button className="btn btn-info" onClick={handleSentimentAnalysis}>
          Sentiment Analysis
        </button>
        <button className="btn btn-info" onClick={handleShowAnalytics}>
          Show Analytics
        </button>
      </div>

      {/* Additional Feature Buttons Row */}
      <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button className="btn btn-dark" onClick={handleDetectLanguage}>
          Detect Language
        </button>
        <button className="btn btn-dark" onClick={handleDictionaryLookup}>
          Dictionary Lookup
        </button>
        <button className="btn btn-dark" onClick={handleExtractEmails}>
          Extract Emails
        </button>
        <button className="btn btn-dark" onClick={handleExtractURLs}>
          Extract URLs
        </button>
        <button className="btn btn-dark" onClick={handleGenerateRandomText}>
          Random Text (Markov)
        </button>
        <button className="btn btn-dark" onClick={handleSaveSession}>
          Save Session
        </button>
        <button className="btn btn-dark" onClick={handleLoadSession}>
          Load Session
        </button>
        <button className="btn btn-dark" onClick={handleReadingLevel}>
          Reading Level
        </button>
      </div>

      {/* Export Buttons */}
      <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button className="btn btn-success" onClick={handleExportAsTxt}>
          Export as .txt
        </button>
        <button className="btn btn-success" onClick={handleExportAsPdf}>
          Export as .pdf
        </button>
        <button className="btn btn-success" onClick={handleExportAsDocx}>
          Export as .docx
        </button>
      </div>

      {/* Text Summary */}
      <div className="container my-3">
        <h2>Your text summary</h2>
        <p>
          Characters: {charCount} | Words: {wordCount} | Sentences: {sentenceCount} | Lines:{" "}
          {lineCount}
        </p>
        <p>{(0.008 * wordCount).toFixed(2)} minutes read</p>
      </div>

      {/* Live Preview Panel */}
      <div
        className="mb-3"
        style={{
          backgroundColor: highlightColor,
          padding: "1rem",
          borderRadius: "5px",
        }}
      >
        <h3>Live Preview</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
