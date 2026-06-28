import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
      <AlertCircle className="h-5 w-5 shrink-0" />
      <div>{message}</div>
    </div>
  );
}
