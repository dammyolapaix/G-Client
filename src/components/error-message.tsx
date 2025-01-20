export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-md bg-red-500 p-3 text-white shadow-md">
      {message}
    </div>
  )
}
