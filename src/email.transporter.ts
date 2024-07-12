// email.transporter.ts

import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class EmailTransporter {
  private readonly transporter: nodeMailer.Transporter;

  constructor() {
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'thuctaplachong@gmail.com',
        pass: 'clrk teeg zuwz vrcf',
      },
    });
  }

  getTransporter(): nodeMailer.Transporter {
    return this.transporter;
  }
}
