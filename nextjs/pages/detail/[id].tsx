import Image from 'next/image';
import React, { useState } from 'React';
import { random, getDetail } from '../api/http';
import type {
  pokemonType,
  pokemonDetailType,
  pokemonTypeType
} from '../../typeing';
import Link from 'next/link';
import pokemonService from '@/pages/api/pokemon';
import { basicUrl } from '@/pages/api/http';
export default function Detail(props: any) {
  const detail: pokemonDetailType = props.detail;
  const type: pokemonTypeType[] = Array.isArray(props.type) ? props.type : [];
  const [showAbility, setShowAbility] = useState(false);
  const isShowAbility = () => {
    setShowAbility(!showAbility);
  };
  return (
    <div className='contents pokemon-detail-contents' data-max-status='15'>
      <div className='pokemon-detail'>
        <div className='pokemon-detail__header'>
          <div className='pokemon-detail__header__inner'>
            <span className='size-20'>
              <Link className='pokemon-detail__header__back-to-top' href='/'>
                宝可梦图鉴
              </Link>
            </span>
          </div>
        </div>
        <div className='pokemon-detail__slider'>
          <div className='pokemon-slider'>
            <div className='pokemon-slider__wrapper pokemon-slider__wrapper--left'>
              {detail.last ? (
                <React.Fragment>
                  <Link
                    href={`/detail/${detail.last.zukan_id}${
                      detail.last.zukan_sub_id > 0
                        ? '_' + detail.last.zukan_sub_id
                        : ''
                    }`}
                  >
                    <img
                      className='pokemon-slider__arrow pokemon-slider__arrow--left hover_image'
                      src={basicUrl('/img/arrow_left_btn.png')}
                    />
                  </Link>
                  <span className='pokemon-slider__sub-no pokemon-slider__sub-no--left size-14'>
                    {detail.last.zukan_id}
                  </span>
                  <span className='pokemon-slider__sub-name pokemon-slider__sub-name--left size-15'>
                    {detail.last.pokemon_name}
                  </span>
                </React.Fragment>
              ) : (
                ''
              )}
            </div>
            <div className='pokemon-slider__main'>
              <p className='pokemon-slider__main-no size-28'>
                {detail.zukan_id}
              </p>
              <p className='pokemon-slider__main-name size-35'>
                {detail.pokemon_name}
              </p>
              <p className='pokemon-slider__main-subname size-20'></p>
            </div>
            <div className='pokemon-slider__wrapper pokemon-slider__wrapper--right'>
              {detail.next ? (
                <React.Fragment>
                  <Link
                    href={`/detail/${detail.next.zukan_id}${
                      detail.next.zukan_sub_id > 0
                        ? '_' + detail.next.zukan_sub_id
                        : ''
                    }`}
                  >
                    <img
                      className='pokemon-slider__arrow pokemon-slider__arrow--right hover_image'
                      src={basicUrl('/img/arrow_right_btn.png')}
                    />
                  </Link>
                  <span className='pokemon-slider__sub-name pokemon-slider__sub-name--right size-15'>
                    {detail.next.pokemon_name}
                  </span>
                  <span className='pokemon-slider__sub-no pokemon-slider__sub-no--right size-14'>
                    {detail.next.zukan_id}
                  </span>
                </React.Fragment>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className='pokemon-detail__profile'>
          <div className='pokemon-main'>
            <div className='pokemon-main__center'>
              <div className='pokemon-img'>
                <img
                  className='pokemon-img__back'
                  src={basicUrl('/img/pokemon_bg.png')}
                />
                <img
                  className='pokemon-img__blur'
                  src={basicUrl('/img/pokemon_circle_bg.png')}
                />
                <img
                  className='pokemon-img__front'
                  src={basicUrl(detail.file_name)}
                />
              </div>
            </div>
            <div className='pokemon-main__upper-left'>
              <div className='pokemon-type__title size-20'>属性</div>
              {detail.pokemon_type_id ? (
                <div className='pokemon-type'>
                  {detail.pokemon_type_id
                    .split(',')
                    .map(
                      (
                        i: React.Key | null | undefined,
                        index: string | number
                      ) => (
                        <div
                          key={i}
                          className={
                            'pokemon-type__type pokemon-type__type--has_second size-14' +
                            ` pokemon-type__type--${i}`
                          }
                        >
                          <Link href={`/?type=${i}`}>
                            <span
                              style={{
                                fontSize: '100%',
                                visibility: 'visible'
                              }}
                            >
                              {detail.pokemon_type_name.split(',')[index]}
                            </span>
                          </Link>
                        </div>
                      )
                    )}
                </div>
              ) : (
                ''
              )}
            </div>
            <div className='pokemon-main__bottom-left'>
              <div className='pokemon-weakness__title size-20'>弱点</div>
              <div className='pokemon-weakness'>
                <div className='pokemon-weakness__items'>
                  {detail.pokemon_weakness.map((i: any) => (
                    <div
                      key={i}
                      className={
                        'pokemon-weakness__btn size-14' +
                        ` pokemon-weakness__btn--${
                          type.find(v => v.pokemon_type_name === i)
                            ?.pokemon_type_id
                        }`
                      }
                    >
                      <Link
                        href={`/?type=${
                          type.find(v => v.pokemon_type_name === i)
                            ?.pokemon_type_id
                        }`}
                      >
                        <span
                          style={{ fontSize: '100%', visibility: 'visible' }}
                        >
                          {i}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='pokemon-main__right'>
              <div className='pokemon-info'>
                {!showAbility ? (
                  <div className='pokemon-info--inner'>
                    <div className='pokemon-info__height'>
                      <span className='pokemon-info__title size-14'>身高</span>
                      <span className='pokemon-info__value size-14'>
                        {detail.height} m
                      </span>
                    </div>
                    <div className='pokemon-info__category'>
                      <span className='pokemon-info__title size-14'>分类</span>
                      <span className='pokemon-info__value size-14'>
                        <span>{detail.pokemon_info_category}</span>
                      </span>
                    </div>
                    <div className='pokemon-info__weight'>
                      <span className='pokemon-info__title size-14'>体重</span>
                      <span className='pokemon-info__value size-14'>
                        {detail.weight === 999.9 ? '???.?' : detail.weight}
                        kg
                      </span>
                    </div>
                    <div className='pokemon-info__gender'>
                      <span className='pokemon-info__title size-14'>性别</span>
                      <span className='pokemon-info__value size-14'>
                        {detail.male ? (
                          <img
                            src={basicUrl('/img/icon_male.png')}
                            alt=''
                            className='pokemon-info__gender-icon'
                          />
                        ) : (
                          ''
                        )}
                        <span className='pokemon-info__gender-separator'>
                          /
                        </span>
                        {detail.female ? (
                          <img
                            src={basicUrl('/img/icon_female.png')}
                            alt=''
                            className='pokemon-info__gender-icon'
                          />
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                    <div className='pokemon-info__abilities'>
                      <span className='pokemon-info__title size-14'>特性</span>
                      <span className='pokemon-info__value size-14'>
                        {detail.pokemon_ability_name}
                        <img
                          onClick={isShowAbility}
                          src={basicUrl('/img/icon_question.png')}
                          className='pokemon-info__question-icon'
                        />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='pokemon-info__ability_info'>
                    <span className='pokemon-info__title size-14'>特性</span>
                    <img
                    onClick={isShowAbility}
                      src={basicUrl('/img/close_btn.png')}
                      className='pokemon-info__ability_info--close_btn'
                    />
                    <span className='pokemon-info__value pokemon-info__value--title size-18'>
                      {detail.pokemon_ability_name}
                    </span>
                    <span className='pokemon-info__value pokemon-info__value--body size-14'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        {detail.pokemon_story}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='pokemon-detail__stats'>
          <div className='pokemon-stats'>
            <div className='pokemon-stats__story-wrapper'>
              <div className='pokemon-stats__story-inner'>
                <div data-init-disp-story='1' className='pokemon-story'>
                  <div className='pokemon-story__header'>
                    <span className='pokemon-story__title size-20'>
                      图鉴版本
                    </span>
                    <div className='pokemon-story__icon-wrapper'>
                      <img
                        src={basicUrl('/img/icon_ball_on.png')}
                        alt=''
                        className='pokemon-story__icon'
                      />
                      <img
                        src={basicUrl('/img/icon_ball.png')}
                        alt=''
                        className='pokemon-story__icon'
                      />
                    </div>
                  </div>
                  <p className='pokemon-story__body size-14'>
                    <span style={{ fontSize: '100%', visibility: 'visible' }}>
                      {detail.pokemon_story}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className='pokemon-stats__status-wrapper'>
              <div className='pokemon-stats__title size-20'>
                <span>能力</span>
              </div>
              <div className='pokemon-stats__wrapper-status'>
                <div className='pokemon-status__block'>
                  <div className='pokemon-status'>
                    <div className='pokemon-status__scale-box'>
                      {Array.from({ length: 16 - detail.hp }).map((v, i) => (
                        <span className='pokemon-status__scale' key={i}></span>
                      ))}
                      {Array.from({ length: detail.hp - 1 }).map((v, i) => (
                        <span
                          key={i}
                          className={
                            `d${detail.hp - i}` +
                            ' pokemon-status__scale appear'
                          }
                        ></span>
                      ))}
                    </div>
                    <div className='pokemon-status__title size-10'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        HP
                      </span>
                    </div>
                  </div>
                  <div className='pokemon-status'>
                    <div className='pokemon-status__scale-box'>
                      {Array.from({ length: 16 - detail.attack }).map(
                        (v, i) => (
                          <span
                            className='pokemon-status__scale'
                            key={i}
                          ></span>
                        )
                      )}
                      {Array.from({ length: detail.attack - 1 }).map((v, i) => (
                        <span
                          key={i}
                          className={
                            `d${detail.attack - i}` +
                            ' pokemon-status__scale appear'
                          }
                        ></span>
                      ))}
                    </div>
                    <div className='pokemon-status__title size-10'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        攻击
                      </span>
                    </div>
                  </div>
                  <div className='pokemon-status'>
                    <div className='pokemon-status__scale-box'>
                      {Array.from({ length: 16 - detail.defense }).map(
                        (v, i) => (
                          <span
                            className='pokemon-status__scale'
                            key={i}
                          ></span>
                        )
                      )}
                      {Array.from({ length: detail.defense - 1 }).map(
                        (v, i) => (
                          <span
                            key={i}
                            className={
                              `d${detail.defense - i}` +
                              ' pokemon-status__scale appear'
                            }
                          ></span>
                        )
                      )}
                    </div>
                    <div className='pokemon-status__title size-10'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        防御
                      </span>
                    </div>
                  </div>
                </div>
                <div className='pokemon-status__block'>
                  <div className='pokemon-status'>
                    <div className='pokemon-status__scale-box'>
                      {Array.from({ length: 16 - detail.special_merit }).map(
                        (v, i) => (
                          <span
                            className='pokemon-status__scale'
                            key={i}
                          ></span>
                        )
                      )}
                      {Array.from({ length: detail.special_merit - 1 }).map(
                        (v, i) => (
                          <span
                            key={i}
                            className={
                              `d${detail.special_merit - i}` +
                              ' pokemon-status__scale appear'
                            }
                          ></span>
                        )
                      )}
                    </div>
                    <div className='pokemon-status__title size-10'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        特攻
                      </span>
                    </div>
                  </div>
                  <div className='pokemon-status'>
                    <div className='pokemon-status__scale-box'>
                      {Array.from({ length: 16 - detail.special_defense }).map(
                        (v, i) => (
                          <span
                            className='pokemon-status__scale'
                            key={i}
                          ></span>
                        )
                      )}
                      {Array.from({ length: detail.special_defense - 1 }).map(
                        (v, i) => (
                          <span
                            key={i}
                            className={
                              `d${detail.special_defense - i}` +
                              ' pokemon-status__scale appear'
                            }
                          ></span>
                        )
                      )}
                    </div>
                    <div className='pokemon-status__title size-10'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        特防
                      </span>
                    </div>
                  </div>
                  <div className='pokemon-status'>
                    <div className='pokemon-status__scale-box'>
                      {Array.from({ length: 16 - detail.speed }).map((v, i) => (
                        <span className='pokemon-status__scale' key={i}></span>
                      ))}
                      {Array.from({ length: detail.speed - 1 }).map((v, i) => (
                        <span
                          key={i}
                          className={
                            `d${detail.speed - i}` +
                            ' pokemon-status__scale appear'
                          }
                        ></span>
                      ))}
                    </div>
                    <div className='pokemon-status__title size-10'>
                      <span style={{ fontSize: '100%', visibility: 'visible' }}>
                        速度
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='pokemon-detail__style'>
          <div className='pokemon-style__title size-20'>
            <span>样子</span>
          </div>

          <div
            className={
              'pokemon-style' +
              `${detail.appearance ? '' : ' pokemon-style--empty'}`
            }
          >
            <div className='pokemon-style__boxes-wrapper'>
              <div className='pokemon-style__boxes'>
                {detail.appearance ? (
                  <div className='pokemon-style__boxes-inner'>
                    {detail.appearance.map((i, index) => (
                      <div
                        className='pokemon-style-box'
                        key={i.zukan_id + i.zukan_sub_id}
                      >
                        <Link
                          href={`/detail/${i.zukan_id}${
                            i.zukan_sub_id > 0 ? '_' + i.zukan_sub_id : ''
                          }`}
                        >
                          <img
                            className='pokemon-style-box__img'
                            src={basicUrl(i.file_name)}
                          />
                          <span className='pokemon-style-box__no size-16'>
                            {i.zukan_id}
                          </span>
                          <span className='pokemon-style-box__name size-16'>
                            {i.pokemon_name}
                          </span>
                          <span className='pokemon-style-box__subname size-14'>
                            {
                              i.pokemon_sub_name
                            }
                          </span>
                          <div className='pokemon-style-box__types'>
                            {i.pokemon_type_id.split(',').map((j: any, index: number) => (
                              <div
                                key={j}
                                className={
                                  'pokemon-style-box__type size-12' +
                                  ` pokemon-style-box__type--${j}`
                                }
                              >
                                <div>
                                  <span
                                    style={{
                                      fontSize: '100%',
                                      visibility: 'visible'
                                    }}
                                  >
                                    {i.pokemon_type_name.split(',')[index]}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='pokemon-style__boxes-inner'>
                    <span className='size-14'>没有不同的样子</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='pokemon-detail__evolutions'>
          <div className='pokemon-evolution bg-x-22 pokemon-evolution--3 pokemon-evolution--h'>
            <div className='pokemon-evolution__inner innerNormalStyle innerSimpleStyle'>
              <div className='pokemon-evolution__title size-20'>
                <span>进化</span>
              </div>
              <div className='pokemon-evolution-contents'>
                {detail.evolutionary_route_detail ? (
                  <div className='pokemon-evolution-contents_flow'>
                    {detail.evolutionary_route_detail.map(i => (
                      <div
                        key={i.zukan_id + i.zukan_sub_id}
                        className='pokemon-evolutionlevel'
                      >
                        <div className='pokemon-evolution-itembox'>
                          <Link
                            href={`/detail/${i.zukan_id}${
                              i.zukan_sub_id > 0 ? '_' + i.zukan_sub_id : ''
                            }`}
                          >
                            <div className='pokemon-evolution-item__image'>
                              <img
                                className='pokemon-evolution-box__image'
                                src={basicUrl(i.file_name)}
                              />
                            </div>
                            <div className='pokemon-evolution-item__info'>
                              <p className='pokemon-evolution-box__no size-14'>
                                {i.zukan_id}
                              </p>
                              <p className='pokemon-evolution-item__info-name size-14'>
                                {i.pokemon_name}
                              </p>
                              <p className='pokemon-evolution-item__info-subname size-10'></p>
                              <div className='pokemon-evolution-box__types'>
                                {i.pokemon_type_id
                                  .split(',')
                                  .map((j: any, index: number) => (
                                    <div
                                      key={j}
                                      className={
                                        'pokemon-evolution-item__info-type size-12' +
                                        ` pokemon-evolution-box__type--${j}`
                                      }
                                    >
                                      <div>
                                        <span
                                          style={{
                                            fontSize: '100%',
                                            visibility: 'visible'
                                          }}
                                        >
                                          {
                                            i.pokemon_type_name.split(',')[index]
                                          }
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </Link>

                          <div className='pokemon-evolution-item__narrow'>
                            <div className='pokemon-evolution__arrow-wrapper'>
                              <img
                                className='pokemon-evolution__arrow'
                                src={basicUrl('/img/arrow_down.png')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='pokemon-detail__sns'>
          <div className='article-sns'>
            <ul className='article-sns__body'>
              <li className='article-sns__element'>
                <Link
                  href='http://service.weibo.com/share/share.php?url=https%3A%2F%2Fwww.pokemon.cn%2Fplay%2Fpokedex%2F0006_1&amp;title=%E8%B6%85%E7%BA%A7%E5%96%B7%E7%81%AB%E9%BE%99%EF%BC%B8+%7C+%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%9B%BE%E9%89%B4+%7C+The+official+Pok%C3%A9mon+Website+in+China&amp;pic=https%3A%2F%2Fwww.pokemon.cn%2Fplay%2Fresources%2Fpokedex%2Fimg%2Fpm%2Fca3db4aad5c85a525d9be86852b26db1db7a22c0.png&amp;searchPic=false'
                  target='_blank'
                >
                  <img
                    src={basicUrl('/img/icon_share-weibo.png')}
                    width='30'
                    alt='weibo'
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='pokemon-detail__back-to-top'>
          <div className='pokemon-back-to-top'>
            <Link href='/'>
              <div className='pokemon-back-to-top__button size-14'>
                <span>返回Pokédex</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const res: any = await random();
  let datas: pokemonType[] = [];
  if (res.success) {
    datas = res.data;
  }
  return {
    paths: datas
      .map(i => {
        if (i && i.zukan_id) {
          return {
            params: {
              id: i.zukan_id + (i.zukan_sub_id > 0 ? '_' + i.zukan_sub_id : '')
            }
          };
        } else {
          return null;
        }
      })
      .filter(Boolean),
    fallback: true
  };
}

export async function getStaticProps(context: any) {
  const { id } = context.params;
  const res: any = await getDetail(id);
  let detail: pokemonDetailType = {};
  if (res.success) {
    detail = res.data;
  }
  return {
    props: {
      detail
    }
  };
}
