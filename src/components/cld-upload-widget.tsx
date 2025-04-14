import { Upload } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

import { Button } from '@/components/ui/button'

type Props = {
  onUploadSuccess: (url?: string) => void
}

export default function CustomCldUploadWidget({ onUploadSuccess }: Props) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{
        sources: ['local'],
        multiple: false,
        maxFiles: 1,
      }}
      onSuccess={(result, {}) => {
        if (result.info !== undefined && typeof result.info !== 'string') {
          onUploadSuccess(result.info.secure_url)
        }
      }}
      onQueuesEnd={(result, { widget }) => {
        widget.close()
      }}
    >
      {({ open }) => {
        function handleOnClick() {
          onUploadSuccess(undefined)
          open()
        }
        return (
          <Button asChild variant="outline" className="w-48 cursor-pointer">
            <span onClick={handleOnClick}>
              <Upload className="mr-2 h-4 w-4" /> Upload an Image
            </span>
          </Button>
        )
      }}
    </CldUploadWidget>
  )
}
