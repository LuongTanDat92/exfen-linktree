// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import uniqid from "uniqid";

// export async function POST(req) {
//   const formData = await req.formData();

//   if (formData.has("file")) {
//     const file = formData.get("file");

//     const s3Client = new S3Client({
//       region: "ap-southeast-2",
//       credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY,
//         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//       },
//     });

//     const randomId = uniqid();
//     const ext = file.name.split(".").pop();
//     const newFilename = randomId + "." + ext;
//     const bucketName = process.env.BUCKET_NAME;

//     const chunks = [];
//     for await (const chunk of file.stream()) {
//       chunks.push(chunk);
//     }

//     await s3Client.send(
//       new PutObjectCommand({
//         Bucket: bucketName,
//         Key: newFilename,
//         ACL: "public-read",
//         Body: Buffer.concat(chunks),
//         ContentType: file.type,
//       })
//     );

//     const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;

//     return Response.json(link);
//   }
// }

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const s3Client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const ext = file.name.split(".").pop();
  const fileName = `${uniqid()}.${ext}`;
  const bucketName = process.env.BUCKET_NAME;

  const buffer = Buffer.from(await file.arrayBuffer());

  // await s3Client.send(
  //   new PutObjectCommand({
  //     Bucket: bucketName,
  //     Key: fileName,
  //     Body: buffer,
  //     ContentType: file.type,
  //     // ❌ KHÔNG dùng ACL
  //   })
  // );

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000",
    })
  );

  const publicUrl = `https://${bucketName}.s3.ap-southeast-2.amazonaws.com/${fileName}`;

  return Response.json({ url: publicUrl });
}
