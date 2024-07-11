import { Injectable } from '@nestjs/common';
const Payos = require('@payos/node');

@Injectable()
export class PayosService {
  private payos;

  constructor() {
    this.payos = new Payos(
      '94cd8617-e898-4490-ba15-878c049327c5',
      '5dbfad3e-4328-479a-81ee-71da9822493f',
      '5eb99e6fb1678bc3ef376bf154a1e5bb5b32e0ee76cc43919fbb3826d6aef5a9',
    );
  }

  async createPaymentLink(order: any) {
    const paymentLink = await this.payos.createPaymentLink(order);
    return paymentLink.checkoutUrl;
  }
}
