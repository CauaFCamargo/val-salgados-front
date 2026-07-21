interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-4 py-2 rounded shadow-lg text-sm">
      {message}
    </div>
  );
}
