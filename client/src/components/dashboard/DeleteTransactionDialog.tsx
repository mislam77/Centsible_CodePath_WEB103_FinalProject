import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { toast } from "sonner"; // Assuming you're using sonner
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  
  interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
  }
  
  function DeleteTransactionDialog({ open, setOpen, transactionId }: Props) {
    const queryClient = useQueryClient();
  
    // Delete transaction API call
    const deleteTransaction = async (transactionId: string) => {
      const response = await fetch(`https://web103-finalproject-centsible.onrender.com/api/transactions/${transactionId}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
    };
  
    const deleteMutation = useMutation({
      mutationFn: deleteTransaction,
      onSuccess: async () => {
        toast.success("Transaction deleted successfully");
  
        // Invalidate the transactions query to refresh data
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        setOpen(false);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.info("Deleting transaction...");
                deleteMutation.mutate(transactionId);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  export default DeleteTransactionDialog;  