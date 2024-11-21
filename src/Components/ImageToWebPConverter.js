import React, { useState } from "react";

const AdvancedImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [convertedWebP, setConvertedWebP] = useState(null);
  const [imageName, setImageName] = useState("");
  const [resolution, setResolution] = useState("100"); // Compression percentage or resolution in pixels
  const [isPercentage, setIsPercentage] = useState(true); // Flag to toggle between percentage and pixels

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select an image file.");
      return;
    }
    setSelectedFile(file);
    setImageName(file.name.split(".")[0]); // Save original image name for download
  };

  const convertImage = (format) => {
    if (!selectedFile) {
      alert("No file selected. Please choose a file to convert.");
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
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedImage(URL.createObjectURL(blob));
          } else {
            alert(`Failed to convert image to ${format}.`);
          }
        },
        `image/${format}`,
        0.8 // Quality
      );
    };

    reader.readAsDataURL(selectedFile);
  };

  const convertToWebP = () => {
    if (!selectedFile) {
      alert("No file selected. Please choose a file to convert.");
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
        0.8 // Quality
      );
    };

    reader.readAsDataURL(selectedFile);
  };

  const compressImage = () => {
    if (!selectedFile) {
      alert("No file selected. Please choose a file to compress.");
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

      let newWidth, newHeight;
      if (isPercentage) {
        const scaleFactor = parseInt(resolution) / 100;
        newWidth = img.width * scaleFactor;
        newHeight = img.height * scaleFactor;
      } else {
        newWidth = parseInt(resolution);
        newHeight = (newWidth / img.width) * img.height; // Maintain aspect ratio
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedImage(URL.createObjectURL(blob));
          } else {
            alert("Failed to compress image.");
          }
        },
        "image/jpeg",
        0.7 // Quality
      );
    };

    reader.readAsDataURL(selectedFile);
  };

  const downloadImage = (blobUrl, format) => {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${imageName}.${format}`;
    link.click();
  };

  return (
    <div className="container text-center my-3">
      <h2>Advanced Image Converter & Compressor</h2>
      <div className="mb-3">
        <input
          type="file"
          accept="image/png, image/jpeg, image/svg+xml, image/heic"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <div className="mb-3">
          <button className="btn btn-primary mx-2" onClick={() => convertImage("png")}>
            Convert to PNG
          </button>
          <button className="btn btn-success mx-2" onClick={() => convertImage("jpeg")}>
            Convert to JPEG
          </button>
          <button className="btn btn-warning mx-2" onClick={convertToWebP}>
            Convert to WebP
          </button>
          <button className="btn btn-secondary mx-2" onClick={() => convertImage("svg+xml")}>
            Convert to SVG
          </button>
          <button className="btn btn-info mx-2" onClick={compressImage}>
            Compress Image
          </button>
        </div>

      {/* {selectedFile && (
        <div className="mb-3">
          <button className="btn btn-primary mx-2" onClick={() => convertImage("png")}>
            Convert to PNG
          </button>
          <button className="btn btn-success mx-2" onClick={() => convertImage("jpeg")}>
            Convert to JPEG
          </button>
          <button className="btn btn-warning mx-2" onClick={convertToWebP}>
            Convert to WebP
          </button>
          <button className="btn btn-secondary mx-2" onClick={() => convertImage("svg+xml")}>
            Convert to SVG
          </button>
          <button className="btn btn-info mx-2" onClick={compressImage}>
            Compress Image
          </button>
        </div>
      )} */}

      {convertedImage && (
        <div className="my-3">
          <h5>Conversion Successful! Preview:</h5>
          <img src={convertedImage} alt="Converted" style={{ maxWidth: "100%", height: "auto" }} />
          <button
            className="btn btn-primary mt-3"
            onClick={() => downloadImage(convertedImage, selectedFile.type.split("/")[1])}
          >
            Download Converted Image
          </button>
        </div>
      )}

      {convertedWebP && (
        <div className="my-3">
          <h5>WebP Conversion Successful! Preview:</h5>
          <img src={convertedWebP} alt="Converted WebP" style={{ maxWidth: "100%", height: "auto" }} />
          <button className="btn btn-success mt-3" onClick={() => downloadImage(convertedWebP, "webp")}>
            Download WebP Image
          </button>
        </div>
      )}

      {compressedImage && (
        <div className="my-3">
          <h5>Compression Successful! Preview:</h5>
          <img src={compressedImage} alt="Compressed" style={{ maxWidth: "100%", height: "auto" }} />
          <button
            className="btn btn-warning mt-3"
            onClick={() => downloadImage(compressedImage, "jpeg")}
          >
            Download Compressed Image
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedImageConverter;
