import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from 'src/core/schema/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/core/schema/conversation.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  private async getConversation(userId: string, conversationId: string) {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      participants: {
        $elemMatch: {
          $eq: userId,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async create(
    userId: string,
    conversationId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const conversation = await this.getConversation(userId, conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Create new message and update conversation lastMessage
    const newMessage = new this.messageModel({
      content: createMessageDto,
      conversation: conversationId,
      senderId: userId,
    });

    conversation.lastMessage = newMessage;

    await Promise.all([newMessage.save(), conversation.save()]);

    return newMessage;
  }

  async findAll(userId: string, conversationId: string) {
    await this.getConversation(userId, conversationId);
    return this.messageModel.find({
      conversation: conversationId,
    });
  }

  findOne(id: string) {
    return this.messageModel.findById(id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, {
      new: true,
    });
  }

  async remove(userId: string, conversationId: string, id: string) {
    await this.getConversation(userId, conversationId);
    const message = await this.messageModel.findOne({
      _id: id,
      conversation: conversationId,
      senderId: userId,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.messageModel.deleteOne({ _id: id });

    return message;
  }
}
