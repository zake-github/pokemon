import { IsNotEmpty, IsString, Length, IsNumber, IsArray, ValidationArguments } from 'class-validator'
export class GetListDto {
    @IsArray({
        message: '属性格式错误'
    })
    @Length(0, 2, {
        message: '不能超过2个属性'
    })
    @IsString({
        each: true
    })
    pokemon_type_id: string[] | null
    @IsString()
    pokemon_ability_id: string
    @IsArray({
        message: '属性格式错误'
    })
    @IsString({
        each: true
    })
    pokemon_region_id: string[] | null

}