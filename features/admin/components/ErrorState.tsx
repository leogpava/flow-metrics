import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
}

export function ErrorState({ title = 'Não foi possível carregar os dados', message }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-[0_16px_40px_rgba(244,63,94,0.06)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-rose-600">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-rose-800">{message}</p>
        </div>
      </div>
    </div>
  );
}
