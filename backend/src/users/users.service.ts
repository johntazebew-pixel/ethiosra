import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 1. We take the plain text password the user typed
    const plainTextPassword = createUserDto.password;

    // 2. We scramble it 10 times (Salt Rounds) so it is mathematically impossible to reverse
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    // 3. We save the user to PostgreSQL, but we swap the plain password for the scrambled one!
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // 4. For security, we delete the password from the final object before returning it to the frontend
    delete (newUser as any).password;
    
    return newUser;
  }
   async findAll() {
    return this.prisma.user.findMany({
      // We explicitly tell Prisma NOT to send passwords when fetching lists of users
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        phone: true,
        city: true,
        currentTitle: true,
        yearsOfExperience: true,
        educationLevel: true,
        fieldOfStudy: true,
        skills: true,
        isAvailableForHire: true,
        resumeUrl: true,
        portfolioUrl: true,
        linkedinUrl: true,
        githubUrl: true,
        preferredLanguage: true,
        preferredTheme: true,
        telegramChatId: true,
        emailNotificationEnabled: true,
        telegramNotificationEnabled: true,
        createdAt: true,
      }
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id } 
    });
    
    if (!user) {
      throw new NotFoundException(`Error! User with ID ${id} not found.`);
    }
    
    delete (user as any).password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // If they are trying to update their password, we must scramble the new one too!
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    delete (updatedUser as any).password;
    return updatedUser;
  }

  async remove(id: string) {
    return this.prisma.user.delete({ 
      where: { id } 
    });
  }
}