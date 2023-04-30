import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService, pokemonTypePartial } from './app.service';
import { GetListDto } from './dto/get-list.dto';
import {AppPipe} from './app.pipe'

@Controller({
  version: '1'
})
export class AppController {
  constructor(private readonly appService: AppService) { }
  // 首页推荐
  @Get('random')
  getRandom(@Query('limit') limit: number | null): pokemonTypePartial[] {
    return this.appService.getRandom(limit);
  }

  // 查询
  @Get('search')
  getList(@Query(AppPipe) getListDto: GetListDto): pokemonTypePartial[] {
    return this.appService.getList(getListDto);
  }
  
  // 详情
  @Get('detail/:id')
  getDetail(@Param() id: string): pokemonTypePartial {
    return this.appService.getDetail(id);
  }
}
