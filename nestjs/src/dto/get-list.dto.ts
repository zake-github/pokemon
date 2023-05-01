import { IsNotEmpty, IsString, Length, IsNumber, IsArray, IsInt, Min, Max, ArrayMaxSize, ValidateIf } from 'class-validator'
export class GetListDto {
    // 未传值忽略验证 o 验证数据对象
    @ValidateIf(o => {
        return Boolean(o.pokemon_type_id)
    })
    @IsArray({
        message: '属性格式错误'
    })
    @ArrayMaxSize(2, {
        message: '属性最多只能选择两个'
    })
    @IsString({
        each: true
    })
    pokemon_type_id: string[] | null

    // 未传值忽略验证
    @ValidateIf(o => {
        return Boolean(o.pokemon_ability_id)
    })
    @IsString()
    pokemon_ability_id: string | null

    @ValidateIf(o => {
        return Boolean(o.key_word)
    })
    @IsString({
        message: '请输入正确名称或编号'
    })
    key_word: string | null

    // 未传值忽略验证
    @ValidateIf(o => {
        return Boolean(o.pokemon_region_id)
    })
    @IsArray({
        message: '地区格式错误'
    })
    @IsString({
        each: true
    })
    pokemon_region_id: string[] | null
    @ValidateIf(o => {
        return Boolean(o.zukan_id_from)
    })
    @IsInt()
    @Min(1)
    @Max(898)
    zukan_id_from: number

    @ValidateIf(o => {
        return Boolean(o.zukan_id_to)
    })
    @IsInt()
    @Min(1)
    @Max(898)
    zukan_id_to: number

}