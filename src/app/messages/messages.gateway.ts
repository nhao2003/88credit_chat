import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/core/guards';
import { Namespace } from 'socket.io';
import { Server } from 'http';
import { WsReponse, WsReponseType } from 'src/common/types';
import { Message } from 'src/core/schema/message.schema';
@WebSocketGateway({
  namespace: '/messages',
})
@UseGuards(WsGuard)
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessagesGateway.name);
  @WebSocketServer()
  server: Namespace;
  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('Client connected');
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected');
  }

  notifyMessage(conversationId: string, message: any) {
    const response: WsReponse<Message> = {
      type: WsReponseType.NEW,
      data: message,
    };
    this.server.to(conversationId).emit('message', response);
  }
}
