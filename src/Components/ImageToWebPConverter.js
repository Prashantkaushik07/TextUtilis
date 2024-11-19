import React, { useState } from "react";

const MageToWebPConverter = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [convertedWebP, setConvertedWebP] = useState(null);
    const [imageName, setImageName] = useState("");
    const [resolution, setResolution] = useState("100"); // Compression percentage or resolution in pixels
    const [isPercentage, setIsPercentage] = useState(true); // Flag to toggle between percentage and pixels
    const [compressedImage, setCompressedImage] = useState(null); // To hold the compressed image

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Please select an image file.");
            return;
        }
        setSelectedFile(file);
        setImageName(file.name.split(".")[0]); // Save original image name for download
    };

    const handleConvert = () => {
        if (!selectedFile) {
            alert("No file selected. Please choose a file to convert.");
            return;
        }
        convertImageToWebP(selectedFile);
    };

    const handleCompress = () => {
        if (!selectedFile) {
            alert("No file selected. Please choose a file to compress.");
            return;
        }
        compressImage(selectedFile);
    };

    const compressImage = (file) => {
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
                // Resize based on percentage
                const scaleFactor = parseInt(resolution) / 100;
                newWidth = img.width * scaleFactor;
                newHeight = img.height * scaleFactor;
            } else {
                // Resize based on pixels
                newWidth = parseInt(resolution);
                newHeight = (newWidth / img.width) * img.height; // Maintain aspect ratio
            }

            // Set canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw the resized image on the canvas
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert canvas to compressed image (JPEG/PNG)
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        setCompressedImage(URL.createObjectURL(blob));
                    } else {
                        alert("Failed to compress image.");
                    }
                },
                "image/jpeg", // Change this to "image/png" if you want PNG compression
                0.7 // Quality (0.1 - 1.0) for JPEG compression, you can adjust
            );
        };

        reader.readAsDataURL(file);
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

            let newWidth, newHeight;

            if (isPercentage) {
                // Resize based on percentage
                const scaleFactor = parseInt(resolution) / 100;
                newWidth = img.width * scaleFactor;
                newHeight = img.height * scaleFactor;
            } else {
                // Resize based on pixels
                newWidth = parseInt(resolution);
                newHeight = (newWidth / img.width) * img.height; // Maintain aspect ratio
            }

            // Set canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw the resized image on the canvas
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert canvas to WebP
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        setConvertedWebP(URL.createObjectURL(blob));
                    } else {
                        alert("Failed to convert image to WebP.");
                    }
                },
                "image/webp",
                0.8 // Quality (0.1 - 1.0)
            );
        };

        reader.readAsDataURL(file);
    };

    const downloadCompressedImage = () => {
        const link = document.createElement("a");
        link.href = compressedImage;
        link.download = `${imageName}-compressed.jpg`; // For JPEG format
        link.click();
    };

    const downloadWebP = () => {
        const link = document.createElement("a");
        link.href = convertedWebP;
        link.download = `${imageName}.webp`;
        link.click();
    };

    return (
        <div className="container text-center my-3">
            <h2>Image to WebP Converter & Image Compressor</h2>
            <div className="mb-3">
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="form-control"
                    onChange={handleFileChange}
                />
            </div>
            <div className="mb-3">
                <label>Resolution (in pixels or percentage):</label>
                <input
                    type="number"
                    className="form-control"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                />
                <div>
                    <input
                        type="radio"
                        id="percentage"
                        checked={isPercentage}
                        onChange={() => setIsPercentage(true)}
                    />
                    <label htmlFor="percentage">Percentage</label>
                    <input
                        type="radio"
                        id="pixels"
                        checked={!isPercentage}
                        onChange={() => setIsPercentage(false)}
                    />
                    <label htmlFor="pixels">Pixels</label>
                </div>
            </div>

            <button
                className="btn btn-primary ml-3"
                onClick={handleConvert}
                disabled={!selectedFile}
            >
                Convert to WebP
            </button>

            <button
                className="btn btn-warning ml-3"
                onClick={handleCompress}
                disabled={!selectedFile}
            >
                Compress Image
            </button>

            <br />
            {compressedImage && (
                <>
                    <div className="my-3">
                        <h5>Compression Successful! Preview below:</h5>
                        <img
                            src={compressedImage}
                            alt="Compressed Image"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </div>
                    <button
                        className="btn btn-success"
                        onClick={downloadCompressedImage}
                    >
                        Download Compressed Image
                    </button>
                </>
            )}

            {convertedWebP && (
                <>
                    <div className="my-3">
                        <h5>Conversion Successful! Preview below:</h5>
                        <img
                            src={convertedWebP}
                            alt="Converted WebP"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </div>
                    <button
                        className="btn btn-success"
                        onClick={downloadWebP}
                    >
                        Download WebP
                    </button>
                </>
            )}
        </div>
    );
};

export default MageToWebPConverter;
