import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { facilityApi, handleApiSuccess } from "@/services/api";

const PhotoUpload = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast("Only image files are allowed");
    }

    if (photos.length + imageFiles.length > 10) {
      toast("Maximum 10 photos allowed");
      return;
    }

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    
    setPhotos(prev => [...prev, ...imageFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      toast("Please select at least one photo");
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      const response = await facilityApi.uploadPhotos(formData);
      const data = await handleApiSuccess(response);
      
      toast("Photos uploaded successfully!");
      
      // Clear the form
      setPhotos([]);
      previews.forEach(preview => URL.revokeObjectURL(preview));
      setPreviews([]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload photos error:', error);
      toast(error instanceof Error ? error.message : "Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Facility Photos
        </CardTitle>
        <CardDescription>
          Upload multiple photos of your facility (Maximum 10 photos)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Drag and drop your photos here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= 10}
              >
                Choose Photos
              </Button>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP up to 5MB each
              </p>
            </div>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Selected Photos ({photos.length}/10)
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setPhotos([]);
                  previews.forEach(preview => URL.revokeObjectURL(preview));
                  setPreviews([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : `Upload ${photos.length} Photo${photos.length > 1 ? 's' : ''}`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;