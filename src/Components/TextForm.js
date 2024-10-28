import React, {useState} from 'react' 


export default function TextForm(props) {
 const [text , setText]= useState("")
 const [fontStyle, setFontStyle] = useState("");
 
 const handleUpClick=()=>{
  console.log("Uppercase was Clicked");
  let newText = text.toUpperCase();
  setText(newText)
 }

 const handleLoClick=()=>{
  console.log("Lowercase was Clicked");
  let newText = text.toLowerCase();
  setText(newText)
 }

 const handleClearClick=()=>{
  console.log("Clear was Clicked");
  let newText='';
  setText(newText)
 }

 const handleCopyClick=()=>{
  // console.log("Copied to Clipboard");
  let newText=document.getElementById("exampleFormControlTextarea1");
  newText.select();
  navigator.clipboard.writeText(newText.value);
  }

 const handleDownloadClick = () => {
 const filename = "downloaded_text.word";
  downloadStyledTextFile(filename, text, fontStyle);
 };

 const handleCapitalizeClick = () => {
  let newText = text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  setText(newText);
 };

 const handleExtraSpace = () => {
  let newText = text.split(/ [ ]+/);
  setText(newText.join(" "));
 }
 
 const handleOnChange=(event)=>{
  console.log("On change");
  setText(event.target.value)
 }

 const handleFontStyleChange = (event) => {
  setFontStyle(event.target.value);
 };

 const downloadStyledTextFile = (filename, text, fontStyle) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.style.fontFamily = fontStyle;
  link.click();
  window.URL.revokeObjectURL(link.href);
 }

 const calculateCounts = (text) => {
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length;
  const lineCount = text.split(/\n/).length;
  return { charCount, wordCount, sentenceCount, lineCount };
 };

 const { charCount, wordCount, sentenceCount, lineCount } = calculateCounts(text);

 return (
    <>
    <div className='container'>
    <h1>{props.heading}</h1>
      <div className="mb-3">
      <textarea className="form-control" value={text} onChange={handleOnChange} style={{ fontFamily: fontStyle }} id="exampleFormControlTextarea1" rows="8"></textarea>
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
      <button className="btn btn-primary mx-2 my-2" onClick={handleUpClick}>Convert to Uppercase</button>
      <button className="btn btn-primary mx-2 my-2" onClick={handleLoClick}>Convert to Lowercase</button>
      <button className="btn btn-primary mx-2 my-2" onClick={handleCapitalizeClick}>Capitalize Case</button>
      <button className="btn btn-primary mx-2 my-2" onClick={handleClearClick}>Clear text</button>
      <button className="btn btn-primary mx-2 my-2" onClick={handleExtraSpace}>Remove Extra Spaces</button>
      <button className="btn btn-primary mx-2 my-2" onClick={handleCopyClick}>Copy to Clipboard</button>
      <button className="btn btn-primary mx-2 my-2" onClick={handleDownloadClick}>Download text</button>
    </div>
    <div className='container my-3'>
      <h1>Your text summary</h1>
      <p>Character Count: {charCount} | Word Count: {wordCount} | Sentence Count: {sentenceCount} | Line Count: {lineCount}</p>
      {/* <p>{text.split("").length} words, {text.length} character</p> */}
      <p>{0.008*text.split("").length} minutes read</p>
      <p>Preview</p>
      <h3 style={{ fontFamily: fontStyle }}>{text}</h3>
    </div> 
     </>
  )
}
