import { IsNotEmpty, IsString, Length, IsNumber, IsArray, IsInt, Min, Max } from 'class-validator'
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
    pokemon_ability_id: string | null

    @IsString()
    key_word: string | null

    @IsArray({
        message: '属性格式错误'
    })
    @IsString({
        each: true
    })
    pokemon_region_id: string[] | null

    @IsInt()
    @Min(1)
    @Max(898)
    zukan_id_from: number

    @IsInt()
    @Min(1)
    @Max(898)
    zukan_id_to: number

}