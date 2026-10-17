'use client';

import { useUnregisterPasskeyMutation } from '@/lib/redux/features/endpoints/auth/passkey/authPasskeyApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import { Button } from '@repo/ui/components/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PasskeyRemoveAction = ({ id }: { id: string }) => {
  const [unregisterPasskey, { isLoading }] = useUnregisterPasskeyMutation();
  const router = useRouter();

  const handleUnregisterPasskey = async (id: string) => {
    await toast.promise(
      unregisterPasskey(id)
        .unwrap()
        .then((res) => {
          router.refresh();
          return res;
        }),
      {
        loading: 'Removing device securely...',
        success: 'Device removed successfully.',
        error: (err) => err?.data?.message,
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon-sm"
          variant="destructive"
          onClick={() => router.refresh()}
        >
          <X />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Passkey Device?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the selected device from your account. You will no
            longer be able to use this passkey to log in. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleUnregisterPasskey(id);
            }}
            disabled={isLoading}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyRemoveAction;
