type Props = {
  messageType: 'success' | 'error'
  message: string
}

export default function SuccessErrorMessage({ message, messageType }: Props) {
  return (
    <div
      className={`mb-5 rounded-md ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-3 text-white shadow-md`}
    >
      {message}
    </div>
  )
}
