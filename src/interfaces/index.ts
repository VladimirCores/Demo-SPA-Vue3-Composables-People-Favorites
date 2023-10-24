export interface IPeopleState {
  data: IPeopleData | undefined;
  favorites: boolean[];
}

export interface IPerson {
  id?: number
  position?: number
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  created: string
  edited: string
  url: string
  favorite?: boolean
}

export interface IPeopleData {
  count: number
  next: string | null
  previous: string | null
  results: IPerson[]
}

export interface IPeopleLoading {
  isProgress: boolean
  progress: {
    current: number
    final: number
  }
}
