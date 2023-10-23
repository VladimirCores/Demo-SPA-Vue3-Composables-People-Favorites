export interface IPerson {
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
}

export interface IPeopleResult {
  count: number
  next: string
  previous: string
  results: IPerson[]
}

export interface IPeopleLoading {
  isProgress: boolean
  progress: {
    current: number
    final: number
  }
}
