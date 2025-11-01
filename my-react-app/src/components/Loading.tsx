interface LoadingProps {
  loading: boolean
  error: string | null
}

export function Loading({ loading, error }: LoadingProps) {
  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
    </>
  )
}
