import { Injectable } from '@nestjs/common';
import { Mail } from './types';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: configService.get('AWS_REGION'),
    });
  }

  async sendMail(mail: Mail) {
    const sendEmailCommand = new SendEmailCommand({
      Source: mail.from,
      Destination: {
        ToAddresses: [mail.to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: mail.body,
          },
          Text: {
            Charset: 'UTF-8',
            Data: mail.body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: mail.subject,
        },
      },
    });

    try {
      await this.sesClient.send(sendEmailCommand);
    } catch (error) {
      console.log(error);
    }
  }
}
