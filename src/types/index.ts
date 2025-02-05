import { LinkProps } from 'next/link'

export type SessionUser = {
  user: {
    id: string
  }
  expires: string
}

export type Columns<Entity> = {
  columns?: {
    [Key in keyof Entity]?: boolean
  }
}

type TrueEntity = {
  [key: string]: true | TrueEntity
}

export type With<Entity extends TrueEntity> = {
  with?: {
    [Key in keyof Entity]?: Entity[Key] extends TrueEntity
      ? With<Entity[Key]>
      : true
  }
}

export type NoItemFoundProps = {
  title?: string
  description?: string
  className?: string
} & (LinkCTA | ModalCTA | NoCTA)

type LinkCTA = {
  ctaType: 'link'
  cta: string
  href: LinkProps<string>['href']
}

type ModalCTA = {
  ctaType: 'modal'
  cta: React.ReactNode
}

type NoCTA = {
  ctaType: 'none'
}
