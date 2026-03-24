'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Fatal Error
            </h2>
            <p className="text-lg leading-7 text-gray-600 mb-8">
              A critical application error occurred.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
