import { Injectable } from '@nestjs/common';
import { GetListDto } from './dto/get-list.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import type {
  pokemonTypePartial,
  pokemonAbilityType,
  pokemonTypeType,
  pokemonRegionType,
} from './type/index';

const pok = fs.readFileSync(
  path.join(__dirname, '..', '/public/pokemons.json'),
  { encoding: 'utf-8' },
);
const pokemons = JSON.parse(pok);

const ability = fs.readFileSync(
  path.join(__dirname, '..', '/public/pokemonAbility.json'),
  { encoding: 'utf-8' },
);
const abilitys = JSON.parse(ability);

const pokemonType = fs.readFileSync(
  path.join(__dirname, '..', '/public/pokemonType.json'),
  { encoding: 'utf-8' },
);
const pokemonTypes = JSON.parse(pokemonType);

const region = fs.readFileSync(
  path.join(__dirname, '..', '/public/pokemonRegion.json'),
  { encoding: 'utf-8' },
);
const regions = JSON.parse(region);

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
        const i = pokemonsAll.splice(idx, 1)[0];
        res.push(i);
      }
    }
    return res;
  }
  // 查询
  getList(getListDto: GetListDto): pokemonTypePartial[] {
    const {
      pokemon_type_id,
      pokemon_ability_id,
      pokemon_region_id,
      key_word,
      zukan_id_from,
      zukan_id_to,
    } = getListDto;
    let pokemonsID = pokemons.slice(zukan_id_from - 1, zukan_id_to);
    if (key_word) {
      pokemonsID = pokemons.filter(
        (v) =>
          v.zukan_id.indexOf(key_word) > -1 ||
          v.pokemon_name.indexOf(key_word) > -1,
      );
    } else {
      if (pokemon_ability_id) {
        pokemonsID = pokemonsID.filter(
          (v) => v.pokemon_ability_id.indexOf(pokemon_ability_id) > -1,
        );
      }

      if (Array.isArray(pokemon_type_id) && pokemon_type_id.length > 0) {
        pokemonsID = pokemon_type_id.reduce((arr, type) => {
          return arr.concat(
            pokemonsID.filter((v) =>
              v.pokemon_type_id.split(',').includes(type),
            ),
          );
        }, []);
      }

      if (Array.isArray(pokemon_region_id) && pokemon_region_id.length > 0) {
        pokemonsID = pokemon_region_id.reduce((arr, region) => {
          return arr.concat(
            pokemonsID.filter((v) => v.pokemon_region_id === region),
          );
        }, []);
      }
    }

    return pokemonsID;
  }
  // 详情
  getDetail(id: string): pokemonTypePartial {
    let zukan_id: string;
    let zukan_sub_id = 0;
    if (id.indexOf('_') > -1) {
      zukan_id = id.split('_')[0];
      zukan_sub_id = Number(id.split('_')[1]);
    } else {
      zukan_id = id;
    }
    const idx = pokemons.findIndex(
      (v) => v.zukan_id === zukan_id && v.zukan_sub_id === zukan_sub_id,
    );
    const res = _.cloneDeep(pokemons[idx]);
    if (idx !== pokemons.length - 1) {
      const { zukan_id, zukan_sub_id, pokemon_name } = pokemons[idx + 1];
      res.next = {
        zukan_id,
        zukan_sub_id,
        pokemon_name,
      };
    }
    if (idx > 0) {
      const { zukan_id, zukan_sub_id, pokemon_name } = pokemons[idx - 1];
      res.last = {
        zukan_id,
        zukan_sub_id,
        pokemon_name,
      };
    }
    const allAppearance = pokemons.filter((v) => v.zukan_id === zukan_id);
    if (allAppearance.length > 1) {
      res.appearance = allAppearance;
    }
    if (res.evolutionary_route.length) {
      res.evolutionary_route_detail = res.evolutionary_route.map((id) => {
        const {
          zukan_id,
          zukan_sub_id,
          pokemon_name,
          pokemon_type_name,
          file_name,
          pokemon_type_id,
        } = pokemons.find((v) => v.zukan_id === id && v.zukan_sub_id === 0);
        return {
          zukan_id,
          zukan_sub_id,
          pokemon_name,
          pokemon_type_name,
          file_name,
          pokemon_type_id,
        };
      });
    }
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
  // 地区
  getRegion(): pokemonRegionType[] {
    return regions;
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
