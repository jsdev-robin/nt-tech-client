'use client';

import { useCreateTwoFaBackupMutation } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
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
import { Spinner } from '@repo/ui/components/spinner';
import { toast } from 'sonner';

const TwoFaBackupAction = () => {
  const [createTwoFaBackup, { isLoading }] = useCreateTwoFaBackupMutation();

  const handleGenerate = async () => {
    await toast.promise(
      createTwoFaBackup()
        .unwrap()
        .then((res) => res),
      {
        loading: 'Generating new codes...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          {isLoading && <Spinner />}
          Generate new backup codes
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Regenerate backup codes?</AlertDialogTitle>
          <AlertDialogDescription>
            This will invalidate your existing backup codes and generate a new
            set. Make sure to store the new codes securely—you won’t be able to
            use the old ones again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerate}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TwoFaBackupAction;
