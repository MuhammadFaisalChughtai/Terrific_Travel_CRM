import { rabbitMQConnection, config, logger } from '../config';
import { ChannelWrapper } from 'amqp-connection-manager';

export class RabbitMQService {
  private channelWrapper: ChannelWrapper;

  constructor() {
    this.channelWrapper = rabbitMQConnection.createChannel({
      json: true,
      setup: async (channel: any) => {
        await channel.assertExchange(config.rabbitmq.exchange, 'topic', { durable: true });
      },
    });
  }

  async publish(routingKey: string, message: any) {
    try {
      await this.channelWrapper.publish(config.rabbitmq.exchange, routingKey, message, {
        persistent: true,
      } as any);
      logger.info(`Published event: ${routingKey}`);
    } catch (error) {
      logger.error(`Failed to publish event ${routingKey}`, error);
    }
  }

  async subscribe(queueName: string, routingKeys: string[], onMessage: (msg: any) => Promise<void> | void) {
    rabbitMQConnection.createChannel({
      json: true,
      setup: async (channel: any) => {
        await channel.assertQueue(queueName, { durable: true });
        for (const key of routingKeys) {
          await channel.bindQueue(queueName, config.rabbitmq.exchange, key);
        }
        await channel.consume(queueName, async (msg: any) => {
          if (msg !== null) {
            try {
              const content = JSON.parse(msg.content.toString());
              await onMessage(content);
              channel.ack(msg);
            } catch (err) {
              logger.error(`Error processing message from queue ${queueName}`, err);
              channel.nack(msg, false, false);
            }
          }
        });
      },
    });
  }
}

export const rabbitMQService = new RabbitMQService();
