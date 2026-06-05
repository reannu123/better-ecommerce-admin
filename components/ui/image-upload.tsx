"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { env } from "next-runtime-env";
interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const cloudName = env("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  const uploadPreset = env("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
  const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);
  const isDisabled = disabled || !isCloudinaryConfigured;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                disabled={isDisabled}
                variant="destructive"
                size={"icon"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      {isCloudinaryConfigured ? (
        <CldUploadWidget
          onSuccess={onUpload}
          uploadPreset={uploadPreset}
          config={{
            cloud: {
              cloudName,
            },
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              onClick={() => open()}
              disabled={isDisabled}
              variant={"secondary"}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          )}
        </CldUploadWidget>
      ) : (
        <div className="space-y-2">
          <Button
            type="button"
            disabled
            variant="secondary"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Image Upload Disabled
          </Button>
          <p className="text-sm text-muted-foreground">
            Configure Cloudinary in your environment to enable image uploads.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
