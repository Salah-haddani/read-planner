const poppler = require("pdf-poppler");
const fs = require("fs");
const path = require("path");
const { uploadFileToS3 } = require("./s3Service");

const TEMP_IMAGE_DIR = path.join(__dirname, "..", "tmp-images");

if (!fs.existsSync(TEMP_IMAGE_DIR)) {
  fs.mkdirSync(TEMP_IMAGE_DIR);
}

exports.convertPdfAndUpload = async (pdfPath, bookId, userId) => {
  const s3ImageUrls = [];

  const options = {
    format: "jpeg",
    out_dir: TEMP_IMAGE_DIR,
    out_prefix: `book-${bookId}-`,
    page: null,
  };

  try {
    await poppler.convert(pdfPath, options);

    const generatedFiles = fs
      .readdirSync(TEMP_IMAGE_DIR)
      .filter(
        (file) =>
          file.startsWith(`book-${bookId}-`) &&
          (file.endsWith(".jpg") || file.endsWith(".jpeg"))
      );

    generatedFiles.sort((a, b) => {
      const numA = parseInt(a.match(/-(\d+)\.jpg$/)[1]);
      const numB = parseInt(b.match(/-(\d+)\.jpg$/)[1]);
      return numA - numB;
    });

    for (const file of generatedFiles) {
      const tempFilePath = path.join(TEMP_IMAGE_DIR, file);
      const s3FileName = `users/${userId}/books/${bookId}/${file}`;

      const imageUrl = await uploadFileToS3(tempFilePath, s3FileName);
      s3ImageUrls.push(imageUrl);

      fs.unlinkSync(tempFilePath);
    }

    fs.unlinkSync(pdfPath);

    return s3ImageUrls;
  } catch (error) {
    console.error("PDF Conversion or S3 Upload Failed:", error);

    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    fs.readdirSync(TEMP_IMAGE_DIR)
      .filter((file) => file.startsWith(`book-${bookId}-`))
      .forEach((file) => {
        fs.unlinkSync(path.join(TEMP_IMAGE_DIR, file));
      });

    throw new Error("Failed to process book file.");
  }
};
