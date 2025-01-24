import React, { useState } from "react";

export default function TextForm(props) {
  const [text, setText] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [paragraphCount, setParagraphCount] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");


  // const [selectedFile, setSelectedFile] = useState(null);
  // const [convertedWebP, setConvertedWebP] = useState(null);
  // const [imageName, setImageName] = useState("");
// const [fontStyle, setFontStyle] = useState("");
  // Text Manipulation Handlers

  const handleUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
  };

  const handleLoClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
  };

  const handleSpeechToTextClick = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech-to-Text is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; // Set the language
    recognition.interimResults = false; // Only return final results
    recognition.continuous = false; // Stop after one result

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
      setText((prevText) => `${prevText} ${speechText}`); // Append the recognized speech to the existing text
    };

    recognition.start();
  };

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
          source: "en", // Default source language (English)
          target: targetLanguage,
          format: "text",
        }),
      });
      const data = await response.json();
      setText(data.translatedText); // Update text with the translated text
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Failed to translate text. Please try again.");
    }
  };

  const handleGenerateLoremIpsumClick = (paragraphs = 1) => {
    const loremIpsum =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    const generatedText = Array(paragraphs).fill(loremIpsum).join("\n\n");
    setText(generatedText);
  };

  const handleFindAndReplaceClick = () => {
    if (findText.trim() === "") {
      alert("Please enter text to find.");
      return;
    }
    const newText = text.replaceAll(findText, replaceText);
    setText(newText);
    alert(
      `All occurrences of "${findText}" have been replaced with "${replaceText}".`
    );
  };

  const handleTitleCaseClick = () => {
    let newText = text
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
    let textArea = document.getElementById("exampleFormControlTextarea1");
    textArea.select();
    navigator.clipboard.writeText(textArea.value);
  };

  const handleCapitalizeClick = () => {
    let newText = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(newText);
  };

  const handleExtraSpace = () => {
    let newText = text.split(/[ ]+/).join(" ");
    setText(newText);
  };

  // download file
  // const handleDownloadClick = () => {
  //   const filename = "downloaded_text.word";
  //   downloadStyledTextFile(filename, text);
  // };

  // const handleFontStyleChange = (event) => {
  //   setFontStyle(event.target.value);
  // };

  // const downloadStyledTextFile = (filename, text, fontStyle) => {
  //   const blob = new Blob([text], { type: "text/plain" });
  //   const link = document.createElement("a");
  //   link.download = filename;
  //   link.href = window.URL.createObjectURL(blob);
  //   link.style.fontFamily = fontStyle;
  //   link.click();
  //   window.URL.revokeObjectURL(link.href);
  // };

  const handleScrambleWordsClick = () => {
    let newText = text
      .split(" ")
      .sort(() => Math.random() - 0.5)
      .join(" ");
    setText(newText);
  };

  const handleRemoveNumbersClick = () => {
    let newText = text.replace(/\d+/g, "");
    setText(newText);
  };

  const handleRepeatedWordsClick = () => {
    const words = text.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
    const repeatedWords = Object.entries(wordCounts)
      .filter(([word, count]) => count > 1)
      .map(([word]) => word);
    alert(`Repeated Words: ${repeatedWords.join(", ") || "None"}`);
  };

  const handleRepeatedCharactersClick = () => {
    const charCounts = text.split("").reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});
    const repeatedChars = Object.entries(charCounts)
      .filter(([char, count]) => count > 1)
      .map(([char]) => char);
    alert(`Repeated Characters: ${repeatedChars.join(", ") || "None"}`);
  };

  const handleSortWordsClick = (order) => {
    let words = text.split(/\s+/).filter((word) => word.length > 0); // Split and remove extra spaces
    if (order === "asc") {
      words.sort((a, b) => a.localeCompare(b)); // Ascending order
    } else if (order === "desc") {
      words.sort((a, b) => b.localeCompare(a)); // Descending order
    }
    setText(words.join(" ")); // Join the sorted words back into a string
  };

  const handleSpeakClick = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Set language
      utterance.rate = 1; // Set speed (0.5 = slower, 1 = normal, 2 = faster)
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  const calculateCounts = (text) => {
    const charCount = text.length;
    const wordCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const sentenceCount = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;
    const lineCount = text.split(/\n/).length;
    return { charCount, wordCount, sentenceCount, lineCount };
  };

  const { charCount, wordCount, sentenceCount, lineCount } =
    calculateCounts(text);

  // Image to WebP Handlers
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     alert("Please select an image file.");
  //     return;
  //   }
  //   setSelectedFile(file);
  //   setImageName(file.name.split(".")[0]);
  // };

  // const handleConvert = () => {
  //   if (!selectedFile) {
  //     alert("No file selected. Please choose a file to convert.");
  //     return;
  //   }
  //   convertImageToWebP(selectedFile);
  // };

  // const convertImageToWebP = (file) => {
  //   const reader = new FileReader();
  //   const img = new Image();

  //   reader.onload = (e) => {
  //     img.src = e.target.result;
  //   };

  //   img.onload = () => {
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img, 0, 0);

  //     canvas.toBlob(
  //       (blob) => {
  //         if (blob) {
  //           setConvertedWebP(URL.createObjectURL(blob));
  //         } else {
  //           alert("Failed to convert image to WebP.");
  //         }
  //       },
  //       "image/webp",
  //       0.8
  //     );
  //   };

  //   reader.readAsDataURL(file);
  // };

  // const downloadWebP = () => {
  //   const link = document.createElement("a");
  //   link.href = convertedWebP;
  //   link.download = `${imageName}.webp`;
  //   link.click();
  // };

  return (
    <>
      <div className="container">
        <h1>{props.heading}</h1>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            // style={{ fontFamily: fontStyle }}
            id="exampleFormControlTextarea1"
            rows="8"
          ></textarea>
        </div>
        <div className="mb-3">
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
        <div className="mb-3">
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
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleFindAndReplaceClick}
        >
          Find and Replace
        </button>
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
            onChange={(e) => setParagraphCount(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={() => handleGenerateLoremIpsumClick(paragraphCount || 1)}
        >
          Generate Lorem Ipsum
        </button>
        {/* <div className="mb-3">
          <label htmlFor="fontStyleSelect">Choose font style:</label>
          <select
            id="fontStyleSelect"
            onChange={handleFontStyleChange}
            className="form-select"
          >
            <option value="cursive">Cursive</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Monospace">Monospace</option>
          </select>
        </div> */}
        
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
<button className="btn btn-primary mx-2 my-2" onClick={handleTranslateClick}>
  Translate Text
</button>
<button className="btn btn-primary mx-2 my-2" onClick={handleUpClick}>
          Convert to Uppercase
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleLoClick}>
          Convert to Lowercase
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleTitleCaseClick}
        >
          Convert to Title Case
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleScrambleWordsClick}
        >
          Scramble Words
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleRemoveNumbersClick}
        >
          Remove Numbers
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleCapitalizeClick}
        >
          Capitalize Case
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleRepeatedWordsClick}
        >
          Find Repeated Words
        </button>
        <button
          className={`btn ${
            isListening ? "btn-danger" : "btn-primary"
          } mx-2 my-2`}
          onClick={handleSpeechToTextClick}
        >
          {isListening ? "Listening..." : "Start Speech-to-Text"}
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={() => handleSortWordsClick("asc")}
        >
          Sort Words (Ascending)
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={() => handleSortWordsClick("desc")}
        >
          Sort Words (Descending)
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleRepeatedCharactersClick}
        >
          Find Repeated Characters
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleClearClick}
        >
          Clear text
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleExtraSpace}
        >
          Remove Extra Spaces
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleCopyClick}>
          Copy to Clipboard
        </button>
        <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleSpeakClick}
        >
          Speak Text
        </button>
        {/* <button
          className="btn btn-primary mx-2 my-2"
          onClick={handleDownloadClick}
        >
          Download text
        </button> */}
        <div className="container my-3">
          <h1>Your text summary</h1>
          <p>
            Character Count: {charCount} | Word Count: {wordCount} | Sentence
            Count: {sentenceCount} | Line Count: {lineCount}
          </p>
          <p>{0.008 * text.split("").length} minutes read</p>
          {/* <h3 style={{ fontFamily: fontStyle }}>{text}</h3> */}
        </div>

        {/* <div className="container my-4">
          <h2>Image to WebP Converter</h2>
          <input
            type="file"
            accept="image/png, image/jpeg, image/svg+xml"
            className="form-control my-4 mx-4 "
            onChange={handleFileChange}
          />
          <button className="btn btn-primary mx-2 my-2" onClick={handleConvert}>
            Convert to WebP
          </button>
          {convertedWebP && (
            <>
              <img src={convertedWebP} alt="Converted WebP" className="img-fluid" />
              <button className="btn btn-success my-2 mx-2" onClick={downloadWebP}>
                Download WebP
              </button>
            </>
          )}
        </div> */}
      </div>
    </>
  );
}
