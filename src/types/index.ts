export type SessionUser = {
  user: {
    id: string
  }
  expires: string
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
