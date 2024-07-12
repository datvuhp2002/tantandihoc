import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { PayosService } from './payos.service';
import { Response, Request } from 'express'; // Import Request from express

@Controller('payos')
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  @SetMetadata('isPublic', true)
  @Post('create-payment-link')
  async createPaymentLink(@Body() order: any, @Res() res: Response) {
    try {
      const paymentLink = await this.payosService.createPaymentLink(order);
      return res.status(HttpStatus.OK).json({ paymentLink });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating payment link',
        error: error.message,
      });
    }
  }

  @SetMetadata('isPublic', true)
  @Post('receive-hook')
  receiveHook(@Body() body: any, @Req() req: Request) {
    console.log(req.body);
    return req.body;
  }
}
