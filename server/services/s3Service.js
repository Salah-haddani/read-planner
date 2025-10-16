const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const { s3Client, AWS_BUCKET_NAME } = require("../config/aws");

exports.uploadFileToS3 = async (filePath, fileName) => {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
    ContentType: `image/${path.extname(fileName).slice(1)}`,
    ACL: "public-read",
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  const publicUrl = `https://${AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  return publicUrl;
};
