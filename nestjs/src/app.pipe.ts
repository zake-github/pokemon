import { ArgumentMetadata, Injectable, PipeTransform, HttpStatus, HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator'

@Injectable()
export class AppPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const DTO = plainToInstance(metadata.metatype, value)
    const errors = await validate(DTO);
    if(errors.length) {
      throw new HttpException({success: false, status: HttpStatus.BAD_REQUEST, data: errors}, HttpStatus.BAD_REQUEST)
    }
    return value;
  }
}
