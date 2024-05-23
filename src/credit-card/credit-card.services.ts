import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/PrismaService';
import { CreditCard, Prisma } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Injectable()
export class CreditCardService {
  constructor(private prisma: PrismaService) {}
  @Inject('NOTIFICATION_SERVICE') private client: ClientProxy;
  async create(data: Prisma.CreditCardCreateInput): Promise<CreditCard> {
    const creditCard = await this.prisma.creditCard.create({
      data: { ...data },
    });

    this.sendRegisterPaymentNotification(JSON.stringify(creditCard));

    this.processPaymen(creditCard);

    return creditCard;
  }

  async processPaymen(payment: CreditCard) {
    setTimeout(
      () => this.sendConfirmationPaymentNotification(JSON.stringify(payment)),
      3000,
    );
  }

  sendRegisterPaymentNotification(message: String) {
    try {
      this.client.emit('register', {
        id: randomUUID(),
        data: { notification: message },
      });
    } catch (error) {
      console.log(error);
    }
  }
  sendConfirmationPaymentNotification(message: String) {
    try {
      this.client.emit('confirmation', {
        id: randomUUID(),
        data: { notification: message },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
