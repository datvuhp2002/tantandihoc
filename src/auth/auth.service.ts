import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto/registerUserDto.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { EmailTransporter } from 'src/email.transporter';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configServer: ConfigService,
    private readonly emailTransporter: EmailTransporter,
  ) {}
  replacePlaceholder = (template, params) => {
    Object.keys(params).forEach((k) => {
      const placeholder = `{{${k}}}`; // Verify key
      template = template.replace(new RegExp(placeholder, 'g'), params[k]);
    });
    return template;
  };
  register = async (userData: RegisterUserDto): Promise<User> => {
    // step 1 : checking email has already used
    const user = await this.prismaService.user.findUnique({
      where: {
        username: userData.username,
        email: userData.email,
        status: 1,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'Email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // step 2: hash password and store to db
    const hashPassword = await this.hashPassword(userData.password);
    const res = await this.prismaService.user.create({
      data: { ...userData, password: hashPassword },
    });
    return res;
  };
  login = async (data: { email: string; password: string }): Promise<any> => {
    // step 1: checking is exist by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
        status: 1,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Tài khoản không tồn tại' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    //step 2: check password
    const verify = await bcrypt.compareSync(data.password, user.password);
    if (!verify)
      throw new HttpException(
        { message: 'Mật khẩu không đúng' },
        HttpStatus.UNAUTHORIZED,
      );
    // step 3: generate access token and refresh token
    const payload = { id: user.id, email: user.email };
    const tokens = await this.generateToken(payload);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      role: user.roles,
    };
  };
  private generatorTokenRandom = () => {
    // Generate 3 random bytes
    const randomBytes = crypto.randomBytes(3);
    // Convert the bytes to an integer
    const otp = randomBytes.readUIntBE(0, 3) % 1000000;
    // Convert the integer to a string and pad it with leading zeros if necessary
    return otp.toString().padStart(6, '0');
  };
  async sendEmailToken(email: string): Promise<any> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // 1. Create new token or OTP (assuming you have a separate OTP service or function)
    const token = await this.newOtp(email);

    // 2. Get HTML content from a server-side file (assuming you have the content in a file)
    const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #333;
      background-color: #fff;
    }

    .container {
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      padding: 0 0px;
      padding-bottom: 10px;
      border-radius: 5px;
      line-height: 1.8;
    }

    .header {
      border-bottom: 1px solid #eee;
    }

    .header a {
      font-size: 1.4em;
      color: #000;
      text-decoration: none;
      font-weight: 600;
    }

    .content {
      min-width: 700px;
      overflow: auto;
      line-height: 2;
    }

    .otp {
      background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
      margin: 0 auto;
      width: max-content;
      padding: 0 10px;
      color: #fff;
      border-radius: 4px;
    }

    .footer {
      color: #aaa;
      font-size: 0.8em;
      line-height: 1;
      font-weight: 300;
    }

    .email-info {
      color: #666666;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      padding-bottom: 6px;
    }

    .email-info a {
      text-decoration: none;
      color: #00bc69;
    }
  </style>
</head>

<body>
  <!--Subject: Yêu cầu xác minh đăng nhập cho tài khoản tantandihoc của bạn-->
  <div class="container">
    <div class="header">
      <div>Chứng minh danh tính tài khoản <b>Tantandihoc</b> của bạn</div>
    </div>
    <br />
    <strong>Kính thưa,</strong>
    <p>
      Chúng tôi đã nhận được yêu cầu quên mật khẩu tài khoản <b>Tantandihoc</b> của bạn. Vì mục đích bảo mật, vui lòng xác minh danh tính của bạn bằng cách cung cấp Mật khẩu một lần (OTP) sau đây.
      <br />
      <b>Mã xác minh Mật khẩu dùng một lần (OTP) của bạn là:</b>
    </p>
    <h2 class="otp">{{link_verify}}</h2>
    <p style="font-size: 0.9em">
      <strong>Mật khẩu dùng một lần (OTP) có hiệu lực trong 3 phút.</strong>
      <br />
      <br />
      Nếu bạn không thực hiện yêu cầu đăng nhập này, vui lòng bỏ qua thông báo này. Vui lòng đảm bảo tính bảo mật của OTP của bạn và không chia sẻ nó với bất kỳ ai.<br />
      <strong>Không chuyển tiếp hoặc đưa mã này cho bất kỳ ai.</strong>
      <br />
      <br />
      <strong>Chúc một ngày tốt lành.</strong>
      <br />
      <br />
      Trân trọng,
      <br />
      <strong>Tantan</strong>
    </p>

    <hr style="border: none; border-top: 0.5px solid #131111" />
    <div class="footer">
      <p>Email này không thể nhận được thư trả lời.</p>
      <p>
        Để biết thêm thông tin về <strong>Tantandihoc</strong> và tài khoản của bạn, hãy truy cập
        <strong>Tantandihoc Website</strong>
      </p>
    </div>
  </div>
  <div style="text-align: center">
    <div class="email-info">
      <span>
        Email này đã được gửi tới
        <a href="mailto:{{email}}">{{email}}</a>
      </span>
    </div>
    <div class="email-info">
      <a href="{{link_verify}}">Tantandihoc</a> | Viet Nam
      | Hoang Mai - Ha Noi
    </div>
    <div class="email-info">
      &copy; 2024 Tantandihoc. All rights
      reserved.
    </div>
  </div>
</body>
</html>`;

    // 3. Replace placeholder with params (assuming you have a function to replace placeholders)
    const content = this.replacePlaceholder(templateHtml, {
      link_verify: token,
      email: `${email}`,
    });

    // 4. Send email
    return await this.sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: 'Vui lòng xác nhận địa chỉ email đăng ký',
    });
  }
  private async sendEmailLinkVerify({
    html,
    toEmail,
    subject = 'Xác nhận email đăng ký',
    text = 'xác nhận..',
  }): Promise<any> {
    const mailOptions = {
      from: '"Tantandihoc" <tantandihoc@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };

    try {
      const transporter = this.emailTransporter.getTransporter();
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      console.error('Error sending email:', err.message);
      throw err; // Re-throw the error after logging it
    }
  }
  async changePassword({ email, password }) {
    const hashPassword = await this.hashPassword(password);
    const res = await this.prismaService.user.update({
      where: { email },
      data: { password: hashPassword },
    });
    if (res) return true;
    throw new BadRequestException('Hệ thống gặp trục trặc, vui lòng thử lại');
  }
  async verifyToken(token: string): Promise<{ email: string }> {
    const getToken = await this.prismaService.otp.findFirst({
      where: {
        token,
        expireAt: {
          gt: new Date(),
        },
      },
    });
    if (!getToken) {
      throw new NotFoundException(
        'Mã không đúng hoặc đã hết hạn, vui lòng thử lại',
      );
    }
    const deleteToken = await this.prismaService.otp.delete({
      where: { id: getToken.id },
    });
    if (deleteToken) {
      return { email: getToken.email };
    }
    throw new BadRequestException('Hệ thống gặp trục trặc, vui lòng thử lại');
  }

  private newOtp = async (email) => {
    // check otp exist
    const isOtpExist = await this.prismaService.otp.findUnique({
      where: { email },
    });
    if (isOtpExist) {
      await this.prismaService.otp.delete({ where: { email } });
    }
    const token = this.generatorTokenRandom();
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 5);
    const newOTP = await this.prismaService.otp.create({
      data: {
        token: token.toString(),
        email,
        expireAt,
      },
    });
    return newOTP.token;
  };
  private async generateToken(payload: {
    id: number;
    email: string;
  }): Promise<any> {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configServer.get<string>('SECRET'),
      expiresIn: this.configServer.get<string>('EXP_ACCESS_TOKEN'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configServer.get<string>('SECRET'),
      expiresIn: this.configServer.get<string>('EXP_IN_REFRESH_TOKEN'),
    });
    await this.prismaService.user.update({
      where: { id: payload.id },
      data: {
        email: payload.email,
        refresh_token,
      },
    });
    return { access_token, refresh_token };
  }
  private async hashPassword(password: String): Promise<string> {
    const SALT_ROUND = this.configServer.get<String>('SALT_ROUND');
    let salt = await bcrypt.genSalt(Number(SALT_ROUND));
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configServer.get<string>('SECRET'),
      });
      const checkExist = await this.prismaService.user.findUnique({
        where: { id: verify.id, refresh_token },
      });
      if (checkExist) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        'refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
