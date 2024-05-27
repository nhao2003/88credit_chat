import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/core/schema/conversation.schema';
import { Message } from 'src/core/schema/message.schema';
import { Participant } from 'src/core/schema/participant.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,

    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async getOrCreateConversation(
    userId: string,
    createConversationDto: CreateConversationDto,
  ) {
    // Get or create conversation
    const participants = [userId, createConversationDto.otherUserId];
    let conversation = await this.conversationModel.findOne({
      participants: {
        $all: participants.map((participantId) => ({
          $elemMatch: {
            _id: participantId,
          },
        })),
      },
    });
    let isNew = false;
    if (!conversation) {
      const newConversation = new this.conversationModel({
        participants: participants.map(
          (participantId) =>
            ({
              _id: participantId,
            }) as Participant,
        ),
      });
      conversation = await newConversation.save();
      isNew = true;
    }
    return { conversation, isNew };
  }

  findAll(userId: string) {
    // Get conversations with messages
    const conversations = this.conversationModel
      .find({
        participants: {
          $elemMatch: {
            _id: userId,
          },
        },
      })
      .populate({
        path: 'lastMessage',
        model: Message.name,
      });
    return conversations;
  }

  async findOne(userId: string, id: string) {
    const conversation = await this.conversationModel.findOne({
      _id: id,
      participants: {
        $elemMatch: {
          _id: userId,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  update(
    userId: string,
    id: string,
    updateConversationDto: UpdateConversationDto,
  ) {
    const conversation = this.conversationModel.findOneAndUpdate(
      {
        _id: id,
        participants: {
          $elemMatch: {
            _id: userId,
          },
        },
      },
      updateConversationDto,
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async remove(userId: string, id: string) {
    const conversation = await this.conversationModel.findOneAndDelete({
      _id: id,
      participants: {
        $elemMatch: {
          _id: userId,
        },
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }
}
