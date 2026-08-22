import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

let _client: S3Client | null = null;

function s3() {
  if (!_client) {
    _client = new S3Client({
      endpoint:    process.env.RUSTFS_ENDPOINT!,
      region:      process.env.RUSTFS_REGION ?? 'ap-south-1',
      credentials: {
        accessKeyId:     process.env.RUSTFS_ACCESS_KEY!,
        secretAccessKey: process.env.RUSTFS_SECRET_KEY!,
      },
      forcePathStyle: true, // required for S3-compatible servers
    });
  }
  return _client;
}

const BUCKET = () => process.env.RUSTFS_BUCKET ?? 'sac-assets';

// ── Upload a file ──────────────────────────────────────────────────────────────
export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await s3().send(new PutObjectCommand({
    Bucket:      BUCKET(),
    Key:         key,
    Body:        body,
    ContentType: contentType,
  }));
}

// ── Fetch a file ───────────────────────────────────────────────────────────────
export async function getObject(key: string): Promise<{ body: Buffer; contentType: string }> {
  const res = await s3().send(new GetObjectCommand({ Bucket: BUCKET(), Key: key }));
  const stream = res.Body as AsyncIterable<Uint8Array>;
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return {
    body:        Buffer.concat(chunks),
    contentType: res.ContentType ?? 'application/octet-stream',
  };
}

// ── Delete a file ──────────────────────────────────────────────────────────────
export async function deleteObject(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: BUCKET(), Key: key }));
}

// ── Key helpers ────────────────────────────────────────────────────────────────
export function makeKey(folder: string, filename: string) {
  return `${folder}/${filename}`;
}

export function keyFromUrl(url: string): string {
  // /api/uploads/council/foo.jpg → council/foo.jpg
  return url.replace(/^\/api\/uploads\//, '');
}
