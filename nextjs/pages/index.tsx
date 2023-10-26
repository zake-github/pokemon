import Image from 'next/image';
import { Inter } from 'next/font/google';
import { SetStateAction, useState, useEffect } from 'react';
import Link from 'next/link';
import pokemonService from '@/pages/api/pokemon';
import type { pokemonType } from '@/typeing/index';
import { basicUrl } from '@/pages/api/http';

export default function PokemonPage(props: any) {
  const { ability, region, type: pokemonTypes, maxId, random } = props;
  const [pokemonsAll, setPokemonsAll] = useState<pokemonType[]>([]);
  const [pokemons, setPokemons] = useState<pokemonType[]>([]);
  const [key_word, setKey_word] = useState<string[]>([]);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [sort, setSort] = useState('图鉴编号由小至大');
  const [isSort, setIsSort] = useState(false);
  const [checkType, setCheckType] = useState<Array<string>>([]);
  const [checkRegion, setCheckRegion] = useState([]);
  const [checkAbility, setCheckAbility] = useState('');

  useEffect(() => {
    search();
  }, []);
  const addType = (pokemon_type_id: string) => {
    const idx = checkType.findIndex(v => v === pokemon_type_id);
    if (idx > -1) {
      setCheckType(checkType.filter(v => v !== pokemon_type_id));
    } else {
      if (checkType.length < 2) {
        setCheckType([...checkType, pokemon_type_id]);
      }
    }
  };
  const key_wordChange = (val: any) => {
    console.log(val);
  };
  const randomAll = async () => {
    const res = await pokemonService.random();
    // @ts-ignore
    if (res?.success) {
      setPokemonsAll(res.data);
      setPokemons(res.data.slice(0, 20));
    }
  };
  const search = async (t?: string) => {
    let params = {};
    if (t === 's') {
      params = {
        pokemon_type_id: checkType,
        pokemon_ability_id: checkAbility,
        pokemon_region_id: checkRegion,
        zukan_id_from: 1,
        zukan_id_to: maxId
      };
    }
    const res = await pokemonService.getPokemons(params);
    // @ts-ignore
    if (res?.success) {
      setPokemonsAll(res.data);
      setPokemons(res.data.slice(0, 20));
    }
  };
  const checkSort = (e: any) => {
    let sortN = sort;
    // @ts-ignore
    setSort(e.target.innerHTML.trim());
    if(e.target.innerHTML.trim()) {
      sortN = e.target.innerHTML.trim();
    }
    if (sortN === '图鉴编号由小至大') {
      setPokemonsAll(
        pokemonsAll.sort((a, b) => Number(a.zukan_id) - Number(b.zukan_id))
      );
    }
    if (sortN === '图鉴编号由大至小') {
      setPokemonsAll(
        pokemonsAll.sort((a, b) => Number(b.zukan_id) - Number(a.zukan_id))
      );
    }
    if (sortN === '重量由轻至重') {
      setPokemonsAll(
        pokemonsAll.sort((a, b) => Number(a.weight) - Number(b.weight))
      );
    }
    if (sortN === '重量由重至轻') {
      setPokemonsAll(
        pokemonsAll.sort((a, b) => Number(b.weight) - Number(a.weight))
      );
    }
    if (sortN === '身高由低至高') {
      setPokemonsAll(
        pokemonsAll.sort((a, b) => Number(a.height) - Number(b.height))
      );
    }
    if (sortN === '身高由高至低') {
      setPokemonsAll(
        pokemonsAll.sort((a, b) => Number(b.height) - Number(a.height))
      );
    }
    const len = pokemons.length;
    setPokemons(pokemonsAll.slice(0, len));
  };
  const loadMore = () => {
    const len = pokemons.length;
    setPokemons(pokemonsAll.slice(0, len + 20));
  };
  const abilityChange = (e: { target: { value: SetStateAction<string> } }) => {
    setCheckAbility(e.target.value);
  };
  const addRegion = (pokemon_region: any) => {
    const idx = checkRegion.findIndex(v => v === pokemon_region);
    idx > -1
      ? setCheckRegion((prevCheckRegion) => {
        return prevCheckRegion.filter(v => v !== pokemon_region)
      })
      : // @ts-ignore
        setCheckRegion((prevCheckRegion) => {
          return prevCheckRegion.concat(pokemon_region)
        });
  };
  return (
    <div className='contents pokemon-list-contents'>
      <div className='pokemon-list'>
        <div className='pokemon-list__header'>
          <div className='pokemon-list__header__inner'>
            <Link href='/'>
              <span className='size-20'>宝可梦图鉴</span>
            </Link>
          </div>
        </div>
        <div className='pokemon-list__main'>
          <div className='pokemon-img'>
            <Image
              width={1400}
              height={700}
              src={basicUrl('/img/pokemon_list_bg.png')}
              alt=''
              className='pokemon-img__back'
              priority
            />
            {random.map((i: any, index: number) => (
              <div key={'random_' + index}>
                <div
                  className={`visible ${
                    index === 0
                      ? 'pokemon-img__center'
                      : 'pokemon-img__random' +
                        ` pokemon-img__random--${index
                          .toString()
                          .padStart(2, '0')}`
                  }`}
                >
                  <Link
                    href={`/detail/${i.zukan_id}${
                      i.zukan_sub_id > 0 ? `_${i.zukan_sub_id}` : ''
                    }`}
                  >
                    <img src={basicUrl(i.file_name)} alt='' />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <form className='pokemon-search'>
            <div className='pokemon-search__title size-16'>
              <span
                id='pokemon_search_title'
                style={{ fontSize: '100%', visibility: 'visible' }}
              >
                使用名称或图鉴编号搜索
              </span>
            </div>
            <div className='pokemon-search__form'>
              <div className='pokemon-search__form--input--wrapper'>
                <input
                  type='text'
                  name=''
                  value={key_word}
                  onChange={key_wordChange}
                  id='search_input'
                  autoComplete='off'
                  className='pokemon-search__form--input size-20'
                />
              </div>
              <div className='pokemon-search__form--button'>
                <img src={basicUrl('/img/icon_magnifying_glass.png')} alt='' />
              </div>
            </div>
            <div className='pokemon-search__surprise' onClick={randomAll}>
              <a className='size-18'>
                <span>随机显示</span>
              </a>
            </div>
          </form>
        </div>
        <div className='pokemon-list__sub'>
          <div className='pokemon-advance-search'>
            <div
              style={{ display: isShowSearch ? 'none' : 'block' }}
              id='advance_search_close'
              className='pokemon-advance-search__close'
              onClick={() => setIsShowSearch(true)}
            >
              <span
                id='advance_search_show'
                className='pokemon-advance-search__close--toggle size-16'
              >
                进阶搜索
              </span>
            </div>
            <div
              style={{ display: isShowSearch ? 'block' : 'none' }}
              id='advance_search_open'
              className='pokemon-advance-search__open'
            >
              <div
                id='advance_search_header'
                className='pokemon-advance-search__open--header'
              ></div>
              <div
                id='advance_search_body'
                className='pokemon-advance-search__open--body'
              >
                <div className='pokemon-advance-search__open--body--inner'>
                  <div className='pokemon-advance-search__open--body--inner--left'>
                    <div className='pokemon-advance-search__title size-20'>
                      属性
                    </div>
                    <div className='pokemon-advance-search__types'>
                      {pokemonTypes.map((i:any) => (
                        <div key={'type_' + i.pokemon_type_id}>
                          <label
                            htmlFor={`pokemon_type_${i.pokemon_type_id}`}
                            id={`pokemon_type_label_${i.pokemon_type_id}`}
                            data-search-type={i.pokemon_type_id}
                            className={`pokemon-advance-search__type size-14 pokemon-advance-search__type--${
                              i.pokemon_type_id
                            } ${
                              checkType.includes(i.pokemon_type_id) ? 'on' : ''
                            } ${
                              !checkType.includes(i.pokemon_type_id) &&
                              checkType.length > 1
                                ? 'off'
                                : ''
                            }`}
                            onClick={() => addType(i.pokemon_type_id)}
                          >
                            <span style={{ fontSize: '100%' }}>
                              {i.pokemon_type_name}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='pokemon-advance-search__open--body--inner--right'>
                    <div className='pokemon-advance-search__block'>
                      <div className='pokemon-advance-search__title size-20'>
                        特性
                      </div>
                      <div className='selectric-wrapper'>
                        <select
                          onChange={abilityChange}
                          id='ability_select'
                          style={{
                            borderRadius: '15px',
                            transform: 'scale(1)',
                            width: '100%',
                            height: '35px'
                          }}
                          tabIndex={-1}
                        >
                          <option value=''>所有</option>
                          {ability.map((i:any) => (
                            <option
                              key={'ability_' + i.pokemon_ability_id}
                              value={i.pokemon_ability_id}
                            >
                              {i.pokemon_ability_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='pokemon-advance-search__block'>
                      <div className='pokemon-advance-search__title pokemon-advance-search__number--title size-20'>
                        图鉴No.
                        <span className='pokemon-advance-search__number--range'>
                          <span id='number_range_0'>1</span>-
                          <span id='number_range_1'>{maxId}</span>
                        </span>
                      </div>
                      <div className='pokemon-advance-search__number size-14'>
                        <div
                          id='advance_search_number'
                          data-min='1'
                          data-max='999'
                          className='noUi-target noUi-ltr noUi-horizontal'
                        >
                          <div className='range noUi-ltr'></div>
                          <div className='noUi-base'>
                            <div className='noUi-connects'>
                              <div
                                className='noUi-connect'
                                style={{
                                  transform: 'translate(0%, 0px) scale(1, 1)'
                                }}
                              ></div>
                            </div>
                            <div
                              className='noUi-origin'
                              style={{
                                transform: 'translate(-100%, 0px)',
                                zIndex: 5
                              }}
                            >
                              <div
                                className='noUi-handle noUi-handle-lower'
                                data-handle={0}
                                tabIndex={0}
                                role='slider'
                                aria-orientation='horizontal'
                                aria-valuemin={0.0}
                                aria-valuemax={100.0}
                                aria-valuenow={0.0}
                                aria-valuetext='1.00'
                              ></div>
                            </div>
                            <div
                              className='noUi-origin'
                              style={{
                                transform: 'translate(0%, 0px)',
                                zIndex: 4
                              }}
                            >
                              <div
                                className='noUi-handle noUi-handle-upper'
                                data-handle={1}
                                tabIndex={0}
                                role='slider'
                                aria-orientation='horizontal'
                                aria-valuemin={0.0}
                                aria-valuemax={100.0}
                                aria-valuenow={100.0}
                                aria-valuetext='898.00'
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='pokemon-advance-search__open--body--inner--bottom'>
                    <div className='pokemon-advance-search__title size-20'>
                      地区
                    </div>
                    <div className='pokemon-advance-search__areas'>
                      {region.map((i:any) => (
                        <div key={'region_' + i.pokemon_region}>
                          <label
                            htmlFor={`pokemon_region_${i.pokemon_region}`}
                            data-search-area={i.pokemon_region}
                            className={
                              'pokemon-advance-search__type pokemon-advance-search__type--area size-14 ' +
                              // @ts-ignore
                              (checkRegion.includes(i.pokemon_region)
                                ? 'on'
                                : '')
                            }
                            onClick={() => addRegion(i.pokemon_region)}
                          >
                            <span style={{ fontSize: '100%' }}>
                              {i.pokemon_region_name}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className='pokemon-advance-search__buttons'>
                      <div className='pokemon-advance-search__buttons--reset size-15'>
                        <span>重置</span>
                      </div>
                      <div
                        className='pokemon-advance-search__buttons--search size-15'
                        onClick={() => search('s')}
                      >
                        <span>搜索</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  id='advance_search_hide'
                  className='pokemon-advance-search__open--toggle size-16'
                  onClick={() => setIsShowSearch(false)}
                >
                  隐藏进阶搜索
                </span>
              </div>
            </div>
            <div
              className='pokemon-advance-search-sort'
              onClick={() => setIsSort(!isSort)}
            >
              <div
                id='advance_search_sort_close'
                className='pokemon-advance-search-sort__close'
              ></div>
              <div
                style={{ display: isSort ? 'block' : 'none' }}
                id='advance_search_sort_open'
                className='pokemon-advance-search-sort__open'
              >
                <div
                  id='advance_search_sort_header'
                  className='pokemon-advance-search-sort__open--header'
                ></div>
                <div
                  id='advance_search_sort_body'
                  className='pokemon-advance-search-sort__open--body'
                >
                  <ul
                    id='advance_search_sort_items'
                    className='pokemon-advance-search-sort__open--items'
                    onClick={(e) => checkSort(e)}
                  >
                    <li className='pokemon-advance-search-sort__open--item size-14'>
                      图鉴编号由小至大
                    </li>
                    <li className='pokemon-advance-search-sort__open--item size-14'>
                      图鉴编号由大至小
                    </li>
                    <li className='pokemon-advance-search-sort__open--item size-14'>
                      重量由轻至重
                    </li>
                    <li className='pokemon-advance-search-sort__open--item size-14'>
                      重量由重至轻
                    </li>
                    <li className='pokemon-advance-search-sort__open--item size-14'>
                      身高由低至高
                    </li>
                    <li className='pokemon-advance-search-sort__open--item size-14'>
                      身高由高至低
                    </li>
                  </ul>
                </div>
              </div>
              <div
                id='advance_search_sort_selected'
                data-init={sort}
                className='pokemon-advance-search-sort--selected size-14'
              >
                {sort}
              </div>
            </div>
          </div>
          {pokemons.length ? (
            <div className='pokemon-list'>
              <div>
                {pokemons.map(i => (
                  <div
                    className='pokemon-list--box--wrapper'
                    key={'pokemons_' + i.zukan_id + '_' + i.zukan_sub_id}
                  >
                    <Link
                      href={`/detail/${i.zukan_id}`}
                      data-height={i.height}
                      data-weight={i.weight}
                      className='pokemon-list--box visible loaded'
                    >
                      <img
                        src={basicUrl(i.file_name)}
                        alt=''
                        className='pokemon-list--box__img'
                      />
                      <span className='pokemon-list--box__no size-16'>
                        {i.zukan_id}
                      </span>
                      <span className='pokemon-list--box__name size-22'>
                        {i.pokemon_name}
                      </span>
                      <span className='pokemon-list--box__subname size-20'></span>
                      <div className='pokemon-list--box__types'>
                        {i.pokemon_type_id.split(',').map((v, index) => (
                          <div
                            key={v}
                            className={`pokemon-list--box__type size-12 pokemon-list--box__type--${v}`}
                          >
                            <span>{i.pokemon_type_name.split(',')[index]}</span>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display:
                    pokemons.length < pokemonsAll.length ? 'block' : 'none'
                }}
                id='load_more'
                className='pokemon-list__load-more'
              >
                <div
                  className='pokemon-list__load-more__button size-14'
                  onClick={loadMore}
                >
                  <span>查看更多</span>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          {pokemons.length ? (
            <div className='pokemon-list-empty'>
              <div className='pokemon-list-empty__title size-20'>
                没有寻找到宝可梦。
              </div>
              <div className='pokemon-list-empty__subtitle size-14'>
                用别的条件重新搜索吧。
              </div>
              <div className='pokemon-list-empty__content size-14'></div>
            </div>
          ) : (
            ''
          )}

          <div className='pokemon-detail__sns'>
            <div className='article-sns'>
              <ul className='article-sns__body'>
                <li className='article-sns__element'>
                  <Link
                    href='http://service.weibo.com/share/share.php?url=https%3A%2F%2Fwww.pokemon.cn%2Fplay%2Fpokedex&amp;title=%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%9B%BE%E9%89%B4+%7C+The+official+Pok%C3%A9mon+Website+in+China&amp;searchPic=false'
                    target='_blank'
                  >
                    <Image
                      src={basicUrl('/img/icon_share-weibo.png')}
                      width={30}
                      height={30}
                      alt='weibo'
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res: any = await pokemonService.random(13);
  let random = [];
  if (res.success) {
    random = res.data;
  }
  return {
    props: {
      random
    }
  };
}
