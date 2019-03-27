export interface FileMeta {
  path: string;
  name: string;
  // TODO get type to be typesafe like ('svg' | 'stl' | 'other')
  type: string;
  description?: string;
  image?: string;
}
