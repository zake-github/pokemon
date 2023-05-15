import pokemonType from './index'
export interface pokemonDetailType extends Partial<pokemonType> {
  appearance?: pokemonType[];
  evolutionary_route_detail?: pokemonType[];
  [k: string]: any;
}