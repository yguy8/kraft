"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-medium">Algo salió mal</h2>
      <p className="text-gray-500">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Reintentar
      </button>
    </div>
  );
}
