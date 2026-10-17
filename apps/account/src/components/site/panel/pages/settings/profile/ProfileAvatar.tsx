'use client';

import { useUploadMutation } from '@/lib/redux/features/endpoints/media/cloudinaryApi';
import { useLazySignatureMediaQuery } from '@/lib/redux/features/endpoints/media/mediaApi';
import { ProfileInput } from '@/validations/ZAuthSchema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Upload } from 'lucide-react';
import { serialize } from 'object-to-formdata';
import { useCallback, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { useDropzone } from 'react-dropzone';
import { useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const ProfileAvatar = () => {
  const { control, setValue } = useFormContext<ProfileInput>();
  const [familyName, avatar] = useWatch({
    control: control,
    name: ['profile.familyName', 'profile.avatar'],
  });

  const [signatureMedia] = useLazySignatureMediaQuery();
  const [upload] = useUploadMutation();
  const [step, setStep] = useState<'idle' | 'upload'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  const reset = useCallback(() => {
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  }, [src]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setStep('idle');
    setUploadProgress(0);
    setSrc(URL.createObjectURL(file));
    setOpen(true);
  }, []);

  const onSave = useCallback(async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob(async (blob) => {
      if (!blob) return;
      setOpen(false);

      try {
        await toast.promise(
          (async () => {
            setStep('upload');
            const { data } = await signatureMedia();

            const formData = serialize({
              file: new File([blob], 'avatar.jpg', { type: 'image/jpeg' }),
              ...data?.payload?.cloudinary,
            });

            const res = await upload({
              formData,
              onUploadProgress: setUploadProgress,
            }).unwrap();

            setValue(
              'profile.avatar',
              {
                public_id: res.public_id,
                url: res.secure_url,
              },
              { shouldDirty: true, shouldValidate: true },
            );

            setStep('idle');
            setUploadProgress(0);
            reset();
          })(),
          {
            loading: 'Uploading...',
            success: () => 'Upload successful',
            error: (err) => err?.data?.message || 'Upload failed',
          },
        );
      } catch {
        setStep('idle');
        setUploadProgress(0);
      }
    }, 'image/jpeg');
  }, [signatureMedia, upload, setValue, reset]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <Label>Photo</Label>
      <Avatar className="size-20 relative cursor-pointer" {...getRootProps()}>
        <Input {...getInputProps()} />
        <AvatarImage src={avatar?.url} className="object-cover" />
        <AvatarFallback>{familyName?.slice(0, 2)}</AvatarFallback>
        {step !== 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full">
            {step === 'upload' && (
              <span className="text-xs font-medium">{uploadProgress}%</span>
            )}
          </div>
        )}
        <Button
          size="icon-xs"
          variant="secondary"
          className=" absolute bottom-0 right-0"
          type="button"
        >
          <Upload />
        </Button>
      </Avatar>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop avatar</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          {src && (
            <div className="flex items-center justify-center">
              <Cropper
                ref={cropperRef}
                src={src}
                style={{ height: 300, width: 300 }}
                aspectRatio={1}
                initialAspectRatio={1}
                guides={false}
                viewMode={1}
                autoCropArea={1}
                background={false}
                responsive
                cropBoxResizable={false}
                cropBoxMovable={true}
                dragMode="move"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileAvatar;
