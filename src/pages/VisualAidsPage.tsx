// VisualAidsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchDoctorVisualAidByCategory } from "@/services/DoctorService";

interface VisualAid {
  id: string;
    name: string,
    category: string,
    fileUrl: string,
    uploadedAt: string
}
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export function VisualAidsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const designation = queryParams.get('designation');
  
  const [visualAids, setVisualAids] = useState<VisualAid[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (designation) {
      fetchVisualAids();
    }
  }, [designation]);

  const fetchVisualAids = async () => {
    try {
      setLoading(true);
      const response = await fetchDoctorVisualAidByCategory(designation);
      // const data = await response.json();
      setVisualAids(response || []);
    } catch (error) {
      console.error("Error fetching visual aids:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < visualAids.length - 1 ? prev + 1 : prev));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getFileEmbedUrl = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    const fullPath = baseUrl+fileUrl;
    // const fullPath = 'https://file-examples.com/storage/fea398523f699077e9e34f7/2017/08/file_example_PPT_250kB.ppt';
    console.log(baseUrl+fileUrl)
    
    if (extension === 'ppt' || extension === 'pptx') {
      return `https://docs.google.com/gview?url=${encodeURIComponent(fullPath)}&embedded=true`;
    }
    
    if (extension === 'pdf') {
      return fileUrl;
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return fileUrl;
    }
    
    return fileUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visual aids...</p>
        </div>
      </div>
    );
  }

  if (visualAids.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>No Visual Aids Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No visual aids available for {designation} designation.
            </p>
            <Button onClick={handleGoBack} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentAid = visualAids[currentIndex];
  const embedUrl = getFileEmbedUrl(currentAid.fileUrl);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gray-50 p-4'}`}>
      {/* Header */}
      <div className={`${isFullscreen ? 'absolute top-0 left-0 right-0 bg-white border-b z-10' : 'mb-4'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Visual Aids - {designation}
            </h1>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {visualAids.length} • {currentAid.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isFullscreen ? 'pt-16 h-full' : 'mt-4'}`}>
        <div className={`max-w-7xl mx-auto ${isFullscreen ? 'h-[calc(100vh-80px)]' : ''}`}>
          {/* File Viewer */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isFullscreen ? 'h-full' : 'h-[70vh]'}`}>
            {embedUrl.endsWith('.pdf') ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                title={currentAid.name}
              />
            ) : embedUrl.includes('docs.google.com') ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                title={currentAid.name}
                allowFullScreen
              />
            ) : ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(embedUrl.split('.').pop()?.toLowerCase() || '') ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <img
                  src={embedUrl}
                  alt={currentAid.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                title={currentAid.name}
              />
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto max-w-2xl px-4 py-2">
              {visualAids.map((aid, index) => (
                <button
                  key={aid.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  {aid.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={baseUrl+ aid.fileUrl}
                      alt={aid.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                      {aid.name.substring(0, 3)}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentIndex === visualAids.length - 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* File Info */}
          <Card className="mt-4">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{currentAid.name}</h3>
                  <p className="text-sm text-gray-500">
                    File: {currentAid.category}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(baseUrl+currentAid.fileUrl, '_blank')}
                >
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}