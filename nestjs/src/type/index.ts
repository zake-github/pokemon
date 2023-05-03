export interface pokemonType {
  zukan_id: string;
  zukan_sub_id: number;
  pokemon_name: string;
  pokemon_sub_name: string;
  weight: number;
  height: number;
  file_name: string;
  pokemon_type_id: string;
  pokemon_type_name: string;
  pokemon_region_name: string;
  pokemon_region_id: string;
  pokemon_ability_name: string;
  pokemon_ability_id: string;
  male: boolean;
  female: boolean;
  'pokemon-weakness': string[];
  pokemon_info_category: string;
  'pokemon-story': string;
  hp: number;
  attack: number;
  defense: number;
  special_merit: number;
  Special_defense: number;
  speed: number;
  evolutionary_route: string[];
}
export type pokemonTypePartial = Partial<pokemonType>;

export interface pokemonAbilityType {
  pokemon_ability_id: string;
  pokemon_ability_name: string;
}
export interface pokemonTypeType {
  pokemon_type_id: string;
  pokemon_type_name: string;
}
export interface pokemonRegionType {
  pokemon_region: string;
  pokemon_region_name: string;
}

export interface basicDataType {
  ability: pokemonAbilityType[],
  type: pokemonTypeType[],
  region: pokemonRegionType[],
  maxId: number
}