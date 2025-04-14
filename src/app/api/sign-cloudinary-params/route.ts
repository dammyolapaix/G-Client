import { v2 as cloudinary } from 'cloudinary'

import { env as envClient } from '@/env/client'
import { env as envServer } from '@/env/server'

cloudinary.config({
  cloud_name: envClient.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: envServer.CLOUDINARY_API_SECRET,
  api_secret: envServer.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const body = await request.json()
  const { paramsToSign } = body

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    envServer.CLOUDINARY_API_SECRET
  )

  return Response.json({ signature })
}
