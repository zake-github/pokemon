import { Injectable } from '@nestjs/common';
import { GetListDto } from './dto/get-list.dto';
import * as fs from 'fs';
import * as path from 'path';
// @ts-igorn
import _ from 'lodash';

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

export interface pokemonAbilityType {
  pokemon_ability_id: string;
  pokemon_ability_name: string;
}
export interface pokemonTypeType {
  pokemon_type_id: string;
  pokemon_type_name: string;
}

const pok = fs.readFileSync(path.join(__dirname, '..', '/public/pokemons.json'), { encoding: 'utf-8' });
let pokemons = JSON.parse(pok);

const ability = fs.readFileSync(path.join(__dirname, '..', '/public/pokemonAbility.json'), { encoding: 'utf-8' });
let abilitys = JSON.parse(ability);

const pokemonType = fs.readFileSync(path.join(__dirname, '..', '/public/pokemonType.json'), { encoding: 'utf-8' });
let pokemonTypes = JSON.parse(pokemonType);

const region = fs.readFileSync(path.join(__dirname, '..', '/public/pokemonRegion.json'), { encoding: 'utf-8' });
let regions = JSON.parse(region);

@Injectable()
export class AppService {
  // 推荐
  getRandom(limit: number | null): pokemonTypePartial[] {
    const res: pokemonTypePartial[] = [];
    if (limit && limit > 0) {

      for (let i = 0; i < limit; i++) {
        const idx = Math.floor(Math.random() * (pokemons.length + 1));
        res.push(pokemons[idx]);
      }
    } else {
      const pokemonsAll = _.cloneDeep(pokemons);
      while (pokemonsAll.length > 0) {
        const idx = Math.floor(Math.random() * (pokemonsAll.length + 1));
        const i = pokemonsAll.splice(idx, 1);
        res.push(i);
      }
    }
    return res;
  }
  // 查询
  getList(getListDto: GetListDto): pokemonTypePartial[] {
    const { pokemon_type_id, pokemon_ability_id, pokemon_region_id, key_word, zukan_id_from, zukan_id_to } = getListDto;
    let abilityFilter: pokemonTypePartial[];
    let typeFilter: pokemonTypePartial[];
    let regionFilter: pokemonTypePartial[];
    const pokemonsID = pokemons.slice(zukan_id_from - 1, zukan_id_to);
    if (key_word) {
      regionFilter = pokemons.filter((v) => v.zukan_id.indexOf(key_word) > -1 || v.pokemon_name.indexOf(key_word))
    } else {
      if (pokemon_ability_id) {
        abilityFilter = pokemonsID.filter((v) => v.pokemon_ability_id === pokemon_ability_id)
      }

      if (Array.isArray(pokemon_type_id)) {
        typeFilter = pokemon_type_id.reduce((arr, type) => {
          return arr.concat(abilityFilter.filter((v) => v.pokemon_type_id.split(',').includes(type)));
        }, [])
      }

      if (Array.isArray(pokemon_region_id)) {
        regionFilter = pokemon_region_id.reduce((arr, region) => {
          return arr.concat(typeFilter.filter((v) => v.pokemon_region_id === region));
        }, [])
      }
    }

    return regionFilter;
  }
  // 详情
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
  // 特性
  getAbility(): pokemonAbilityType[] {
    return abilitys;
  }
  // 属性
  getType(): pokemonTypeType[] {
    return pokemonTypes;
  }
  getMaxId(): number {
    return pokemons.reduce((n, i) => {
      if (Number(i.zukan_id) > n) {
        n = Number(i.zukan_id);
      }
      return n;
    }, 1);
  }
}
