import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { AppService, } from './app.service';
import type { pokemonTypePartial, pokemonAbilityType, pokemonTypeType, pokemonRegionType, basicDataType} from './type/index';
import { GetListDto } from './dto/get-list.dto';
// import {AppPipe} from './app.pipe';
import { version } from './config';

@Controller({
  version
})
export class AppController {
  constructor(private readonly appService: AppService) { }
  // 首页推荐
  @Get('random')
  getRandom(@Query('limit') limit: number | null): pokemonTypePartial[] {
    return this.appService.getRandom(limit);
  }

  // 查询
  @Post('search')
  // getList(@Body(AppPipe) getListDto: GetListDto): pokemonTypePartial[] {
  getList(@Body() getListDto: GetListDto): pokemonTypePartial[] {
    return this.appService.getList(getListDto);
  }

  // 详情
  @Get('detail/:id')
  getDetail(@Param('id') id: string): pokemonTypePartial {
    return this.appService.getDetail(id);
  }

  // 特性
  @Get('ability')
  getAbility(): pokemonAbilityType[] {
    return this.appService.getAbility();
  }

  // 属性
  @Get('type')
  getType(): pokemonTypeType[] {
    return this.appService.getType();
  }

  // 地区
  @Get('region')
  getRegion(): pokemonRegionType[] {
    return this.appService.getRegion();
  }

  // 编号最大值
  @Get('max_id')
  getMaxId(): number {
    return this.appService.getMaxId();
  }
  // 所有基础数据
  @Get('basic_data')
  getBasicData(): basicDataType {
    return {
      ability: this.appService.getAbility(),
      type: this.appService.getType(),
      region: this.appService.getRegion(),
      maxId: this.appService.getMaxId()
    };
  }
}
