import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@WebSocketGateway()
export class ConversationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly conversationsService: ConversationsService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
    console.log(client.handshake);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('createConversation')
  create(@MessageBody() createConversationDto: CreateConversationDto) {
    // return this.conversationsService.create(createConversationDto);
  }

  @SubscribeMessage('findAllConversations')
  findAll() {
    // return this.conversationsService.findAll();
  }

  @SubscribeMessage('findOneConversation')
  findOne(@MessageBody() id: string) {
    // return this.conversationsService.findOne(id);
  }

  @SubscribeMessage('updateConversation')
  update(@MessageBody() updateConversationDto: UpdateConversationDto) {
    // return this.conversationsService.update(
    //   updateConversationDto.id,
    //   updateConversationDto,
    // );
  }

  @SubscribeMessage('removeConversation')
  remove(@MessageBody() id: string) {
    // return this.conversationsService.remove(id);
  }
}
