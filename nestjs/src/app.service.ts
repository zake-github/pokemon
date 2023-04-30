import { Injectable } from '@nestjs/common';
import { GetListDto } from './dto/get-list.dto';
import fs from 'fs';
import path from 'path';
import { type } from 'os';

export interface pokemonType {
  "zukan_id": string,
  "zukan_sub_id": number,
  "pokemon_name": string,
  "pokemon_sub_name": string,
  "weight": number,
  "height": number,
  "file_name": string,
  "pokemon_type_id": string,
  "pokemon_type_name": string,
  "pokemon_region_name": string,
  "pokemon_region_id": string,
  "pokemon_ability_name": string,
  "pokemon_ability_id": string,
  "male": boolean,
  "female": boolean,
  "pokemon-weakness": string[],
  "pokemon_info_category": "-",
  "pokemon-story": string,
  "hp": number,
  "attack": number,
  "defense": number,
  "special_merit": number,
  "Special_defense": number,
  "speed": number,
  "evolutionary_route": string[]
}
export type pokemonTypePartial = Partial<pokemonType>;

const pok = fs.readFileSync(path.join(__dirname, './pokemons.json'), { encoding: 'utf-8' });
let pokemons = JSON.parse(pok);
@Injectable()
export class AppService {
  getRandom(limit: number): pokemonTypePartial[] {
    const res: pokemonTypePartial[] = [];
    for (let i = 0; i < limit; i++) {
      const idx = Math.floor(Math.random() * (pokemons.length + 1));
      res.push(pokemons[idx]);
    }
    return res;
  }
  getList(getListDto: GetListDto): pokemonTypePartial[] {
    const res: pokemonTypePartial[] = []

    const { pokemon_type_id, pokemon_ability_id, pokemon_region_id } = getListDto;
    const abilityFilter: pokemonTypePartial[] = pokemons.filter((v) => v.pokemon_ability_id === pokemon_ability_id)
    const typeFilter: pokemonTypePartial[] = pokemon_type_id.reduce((arr, type) => {
      return arr.concat(abilityFilter.filter((v) => v.pokemon_type_id.split(',').includes(type)));
    }, [])
    const regionFilter: pokemonTypePartial[] = pokemon_region_id.reduce((arr, region) => {
      return arr.concat(typeFilter.filter((v) => v.pokemon_region_id === region));
    }, [])

    return regionFilter;
  }
  getDetail(id: string): pokemonTypePartial {
    let zukan_id: string;
    let zukan_sub_id: number = 0;
    if (id.indexOf('_') > -1) {
      zukan_id = id.split('_')[0];
      zukan_sub_id = Number(id.split('_')[1]);
    } else {
      zukan_id = id;
    }
    const res = pokemons.find(v => v.zukan_id === zukan_id && zukan_sub_id === zukan_sub_id);
    return res;
  }
}
