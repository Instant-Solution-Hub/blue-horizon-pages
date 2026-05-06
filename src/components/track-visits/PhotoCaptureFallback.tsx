// PhotoCaptureFallback.tsx

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, RefreshCw, Check, X } from "lucide-react";

interface PhotoCaptureFallbackProps {
  onPhotoCapture: (photoDataUrl: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function PhotoCaptureFallback({ onPhotoCapture, onCancel, isOpen }: PhotoCaptureFallbackProps) {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Use back camera
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  // Start camera when component opens
  useEffect(() => {
    if (isOpen && !photoDataUrl) {
      startCamera();
    }
    
    // Cleanup when component closes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]); // Re-run when isOpen changes

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoDataUrl(dataUrl);
        
        // Stop the camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const retakePhoto = () => {
    setPhotoDataUrl(null);
    startCamera(); // This will now work as expected
  };

  const confirmPhoto = () => {
    if (photoDataUrl) {
      onPhotoCapture(photoDataUrl);
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setPhotoDataUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Capture Photo Proof</h3>
          <button onClick={() => { cleanup(); onCancel(); }} className="text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {!photoDataUrl ? (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <Button onClick={capturePhoto} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>
            </>
          ) : (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <img src={photoDataUrl} alt="Captured" className="w-full h-full object-contain" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={retakePhoto} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={confirmPhoto} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}