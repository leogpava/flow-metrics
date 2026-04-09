import { FlowLogo } from '@/components/layout/FlowLogo';

export default function FlowLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[460px] min-w-0 flex-col overflow-x-clip px-4 py-5 sm:px-5">
      <div className="mb-5 flex justify-start">
        <FlowLogo compact />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">{children}</div>
    </main>
  );
}

