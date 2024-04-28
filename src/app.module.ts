import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';

import { AdminDeskModule } from './admin-desk/admin-desk.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { FarmersModule } from './farmers/farmers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OfftakeModule } from './offtake/offtake.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminDeskModule,
    DashboardModule,
    FarmersModule,
    SuppliersModule,
    OfftakeModule,
  ],
})
export class AppModule {}
