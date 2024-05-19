import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from 'src/core/schema/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}
  create(conversationId: string, createMessageDto: CreateMessageDto) {
    return this.messageModel.create({
      ...createMessageDto,
      conversation: conversationId,
    });
  }

  findAll(conversationId: string) {
    // return this.messageModel.find().populate('conversation');
    return this.messageModel.find({ conversation: conversationId });
  }

  findOne(id: string) {
    return this.messageModel.findById(id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.messageModel.findByIdAndDelete(id);
  }
}
