import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [JwtModule.register({}), HttpModule, AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
