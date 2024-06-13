import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsGuard } from 'src/core/guards';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { GetSocketUserId } from 'src/core/decorators';
import { Conversation } from 'src/core/schema/conversation.schema';
import { WsReponse, WsReponseType } from 'src/common/types';
import { Namespace } from 'socket.io';
@WebSocketGateway({
  namespace: 'conversations',
})
@UseGuards(WsGuard)
@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
// @UseFilters(ValidationSocketErrorFilter)
export class ConversationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Namespace;
  private readonly logger = new Logger(ConversationsGateway.name);
  constructor(private readonly conversationsService: ConversationsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Client connected');
    console.log(client.handshake.headers);
    const { uid } = client.handshake.headers;
    if (!uid) {
      return client.disconnect();
    }
    client.join(uid);
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected');
  }

  notifyConversation(type: WsReponseType, conversation: Conversation) {
    const response: WsReponse<Conversation> = {
      type,
      data: conversation,
    };
    // this.server.to(conversation._id.toString()).emit('conversation', response);

    for (const participant of conversation.participants) {
      this.server.to(participant.toString()).emit('conversation', response);
    }
  }
}
