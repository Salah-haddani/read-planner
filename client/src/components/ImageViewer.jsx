import React from "react";

const ImageViewer = ({ imageUrl, pageNumber, altText = "Book Page Image" }) => {
  if (!imageUrl) {
    return (
      <div className="image-viewer-placeholder">Select a page to view.</div>
    );
  }

  return (
    <div className="image-viewer">
      <img
        src={imageUrl}
        alt={`${altText} - Page ${pageNumber}`}
        className="page-image"
      />
    </div>
  );
};

export default ImageViewer;
