import React, { useState } from "react";

export default function TextForm(props) {
  const [text, setText] = useState("");
  const [fontStyle, setFontStyle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedWebP, setConvertedWebP] = useState(null);
  const [imageName, setImageName] = useState("");

  // Text Manipulation Handlers
  const handleUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
  };

  const handleLoClick = () => {
    let newText = text.toLowerCase();
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

  const handleFontStyleChange = (event) => {
    setFontStyle(event.target.value);
  };

  const calculateCounts = (text) => {
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length;
    const lineCount = text.split(/\n/).length;
    return { charCount, wordCount, sentenceCount, lineCount };
  };

  const { charCount, wordCount, sentenceCount, lineCount } = calculateCounts(text);

  // Image to WebP Handlers
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select an image file.");
      return;
    }
    setSelectedFile(file);
    setImageName(file.name.split(".")[0]);
  };

  const handleConvert = () => {
    if (!selectedFile) {
      alert("No file selected. Please choose a file to convert.");
      return;
    }
    convertImageToWebP(selectedFile);
  };

  const convertImageToWebP = (file) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedWebP(URL.createObjectURL(blob));
          } else {
            alert("Failed to convert image to WebP.");
          }
        },
        "image/webp",
        0.8
      );
    };

    reader.readAsDataURL(file);
  };

  const downloadWebP = () => {
    const link = document.createElement("a");
    link.href = convertedWebP;
    link.download = `${imageName}.webp`;
    link.click();
  };

  return (
    <>
      <div className="container">
        <h1>{props.heading}</h1>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ fontFamily: fontStyle }}
            id="exampleFormControlTextarea1"
            rows="8"
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="fontStyleSelect">Choose font style:</label>
          <select id="fontStyleSelect" onChange={handleFontStyleChange} className="form-select">
            <option value="cursive">Cursive</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Monospace">Monospace</option>
          </select>
        </div>
        <button className="btn btn-primary mx-2 my-2" onClick={handleUpClick}>
          Convert to Uppercase
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleLoClick}>
          Convert to Lowercase
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleCapitalizeClick}>
          Capitalize Case
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleClearClick}>
          Clear text
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleExtraSpace}>
          Remove Extra Spaces
        </button>
        <button className="btn btn-primary mx-2 my-2" onClick={handleCopyClick}>
          Copy to Clipboard
        </button>
        {/* <div className="container my-4">
          <h2>Image to WebP Converter</h2>
          <input
            type="file"
            accept="image/png, image/jpeg, image/svg+xml"
            className="form-control"
            onChange={handleFileChange}
          />
          <button className="btn btn-primary my-2" onClick={handleConvert}>
            Convert to WebP
          </button>
          {convertedWebP && (
            <>
              <img src={convertedWebP} alt="Converted WebP" className="img-fluid" />
              <button className="btn btn-success my-2" onClick={downloadWebP}>
                Download WebP
              </button>
            </>
          )}
        </div> */}
      </div>
      <div className="container my-3">
        <h1>Your text summary</h1>
        <p>
          Character Count: {charCount} | Word Count: {wordCount} | Sentence Count: {sentenceCount} | Line Count:{" "}
          {lineCount}
        </p>
        <p>{0.008 * text.split("").length} minutes read</p>
        <h3 style={{ fontFamily: fontStyle }}>{text}</h3>
      </div>
    </>
  );
}
