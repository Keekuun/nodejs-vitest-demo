import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(4, 20, { message: '用户名长度必须在4到20个字符之间' })
  username: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 40, { message: '密码长度必须在8到40个字符之间' })
  password: string;
}
