import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OfftakeService {
  constructor(){} // private wallet: AuthService, // private config: ConfigService, // private prisma: PrismaService,
}
