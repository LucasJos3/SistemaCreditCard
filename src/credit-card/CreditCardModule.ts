import { Module } from '@nestjs/common';
import { PrismaService } from 'src/PrismaService';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService } from './credit-card.services';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:123456@localhost'],
          queue: 'notification',
          noAck: true,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [CreditCardController],
  providers: [CreditCardService, PrismaService],
})
export class CreditCardModule {}
