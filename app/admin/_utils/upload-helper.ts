export async function compressImageIfTooLarge(file: File, maxSizeMB: number = 5): Promise<File | Blob> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml') return file;

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size <= maxBytes) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      const MAX_DIM = 2000;
      if (width > height && width > MAX_DIM) {
        height *= MAX_DIM / width;
        width = MAX_DIM;
      } else if (height > MAX_DIM) {
        width *= MAX_DIM / height;
        height = MAX_DIM;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(blob => {
        if (!blob) return resolve(file);
        // Fallback to original if compressed is somehow larger
        resolve(blob.size < file.size ? blob : file);
      }, 'image/jpeg', 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}
