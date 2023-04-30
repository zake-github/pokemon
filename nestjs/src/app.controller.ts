import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService, pokemonTypePartial } from './app.service';
import { GetListDto } from './dto/get-list.dto';

@Controller({
  version: '1'
})
export class AppController {
  constructor(private readonly appService: AppService) { }
  // 首页推荐
  @Get('random')
  getRandom(@Query('limit') limit: number): pokemonTypePartial[] {
    return this.appService.getRandom(limit);
  }
  @Get('list')
  getList(@Query() getListDto: GetListDto): pokemonTypePartial[] {
    return this.appService.getList(getListDto);
  }

  @Get('detail/:id')
  getDetail(@Param() id: string): pokemonTypePartial {
    return this.appService.getDetail(id);
  }
}
