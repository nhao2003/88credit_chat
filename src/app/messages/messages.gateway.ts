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
import { ConversationsService } from '../conversations/conversations.service';
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
  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
  ) {}

  handleConnection(client: any, ...args: any[]) {
    const { cid } = client.handshake.query;
    if (!cid) {
      return client.disconnect();
    }
    client.join(cid);
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected');
  }

  notifyMessage(type: WsReponseType, message: Message) {
    const response: WsReponse<Message> = {
      type,
      data: message,
    };
    this.server.to(message.conversation.toString()).emit('message', response);
  }
}
