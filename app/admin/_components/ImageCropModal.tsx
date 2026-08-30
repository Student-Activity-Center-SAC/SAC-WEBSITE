'use client';
import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface Props {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onComplete: (blob: Blob) => void;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedBlob(imageSrc: string, cropPixels: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
    0, 0, cropPixels.width, cropPixels.height,
  );
  return new Promise(resolve => canvas.toBlob(b => resolve(b as Blob), 'image/jpeg', 0.92));
}

export default function ImageCropModal({ imageSrc, aspect, onCancel, onComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function apply() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onComplete(blob);
    } catch {
      alert('Could not crop this image — try uploading it as a file instead of a pasted URL.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col" style={{ background: '#fff', maxHeight: '90vh' }}>

        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E4E4E7' }}>
          <p className="font-bold text-sm" style={{ color: '#0D0D0D' }}>Crop image</p>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={16} style={{ color: '#71717A' }} />
          </button>
        </div>

        <div className="relative w-full" style={{ height: '360px', background: '#111' }}>
          <style>{`
            .reactEasyCrop_Container img {
              max-width: 100% !important;
              max-height: 100% !important;
              width: auto !important;
              height: auto !important;
            }
          `}</style>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 px-5 py-4">
          <ZoomOut size={16} style={{ color: '#A1A1AA' }} />
          <input
            type="range" min={1} max={3} step={0.01} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-red-800"
          />
          <ZoomIn size={16} style={{ color: '#A1A1AA' }} />
        </div>

        <div className="flex items-center justify-end gap-3 px-5 pb-5">
          <button onClick={onCancel}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm border hover:bg-gray-50"
                  style={{ borderColor: '#E4E4E7', color: '#71717A' }}>
            Cancel
          </button>
          <button onClick={apply} disabled={processing || !croppedAreaPixels}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#8B0000', color: '#fff' }}>
            <Check size={14} /> {processing ? 'Applying…' : 'Apply Crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
