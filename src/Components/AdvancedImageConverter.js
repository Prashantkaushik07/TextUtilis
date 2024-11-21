import React, { useState } from "react";
import heic2any from "heic2any";

const AdvancedImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select an image file.");
      return;
    }
    setSelectedFile(file);
    setImageName(file.name.split(".")[0]); // Save original image name for download
  };

  const convertImage = async (format) => {
    if (!selectedFile) {
      alert("No file selected. Please choose a file to convert.");
      return;
    }

    if (selectedFile.type === "image/heic") {
      try {
        const convertedBlob = await heic2any({ blob: selectedFile, toType: `image/${format}` });
        setConvertedImage(URL.createObjectURL(convertedBlob));
      } catch (error) {
        alert("HEIC conversion failed. Please try another file.");
      }
      return;
    }

    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Resize logic
      canvas.width = resizeWidth ? parseInt(resizeWidth) : img.width;
      canvas.height = resizeHeight ? parseInt(resizeHeight) : img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedImage(URL.createObjectURL(blob));
          } else {
            alert(`Failed to convert image to ${format}.`);
          }
        },
        `image/${format}`,
        0.8 // Quality (0.1 - 1.0)
      );
    };

    reader.readAsDataURL(selectedFile);
  };

  const downloadConvertedImage = (format) => {
    if (!convertedImage) {
      alert("No converted image available for download.");
      return;
    }

    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = `${imageName}.${format}`;
    link.click();
  };

  return (
    <div className="container text-center my-3">
      <h2>Advanced Image Converter</h2>
      <div className="mb-3">
        <input
          type="file"
          accept="image/png, image/jpeg, image/svg+xml, image/heic"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      {selectedFile && (
        <div className="my-3">
          <h5>Resize Options (Optional)</h5>
          <div className="d-flex justify-content-center mb-3">
            <input
              type="number"
              className="form-control mx-2"
              placeholder="Width"
              value={resizeWidth}
              onChange={(e) => setResizeWidth(e.target.value)}
            />
            <input
              type="number"
              className="form-control mx-2"
              placeholder="Height"
              value={resizeHeight}
              onChange={(e) => setResizeHeight(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary mx-2"
            onClick={() => convertImage("png")}
          >
            Convert to PNG
          </button>
          <button
            className="btn btn-success mx-2"
            onClick={() => convertImage("jpeg")}
          >
            Convert to JPEG
          </button>
          <button
            className="btn btn-warning mx-2"
            onClick={() => convertImage("webp")}
          >
            Convert to WebP
          </button>
          <button
            className="btn btn-info mx-2"
            onClick={() => convertImage("svg+xml")}
          >
            Convert to SVG
          </button>
          <button
            className="btn btn-secondary mx-2"
            onClick={() => convertImage("jpg")}
          >
            Convert HEIC to JPG
          </button>
        </div>
      )}
      {convertedImage && (
        <div className="my-3">
          <h5>Conversion Successful! Preview below:</h5>
          <img
            src={convertedImage}
            alt="Converted"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={() =>
                downloadConvertedImage(selectedFile.type.split("/")[1])
              }
            >
              Download Converted Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedImageConverter;
