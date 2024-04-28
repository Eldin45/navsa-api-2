import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { NewDashDto } from './dto/newDashDto';
import { DashLogDto } from './dto/dashLoginDto';
import { AgentLogDto } from './dto/agentLogDto';
import { NewAgentDto } from './dto/newAgentDto';
import { NewZoneDto } from './dto/newZoneDto';
import { NewStateDto } from './dto/newStateDto';
import { NewLocalDto } from './dto/newLocalDto';
import { getAdmin } from 'src/auth/decorator';
import { AuthGuard } from '@nestjs/passport';
import { CooperateWalletDto } from './dto/dashWallet';
import { AllocatedInputDto } from './dto/allocateInputDto';
import { FarmersFundDto } from './dto/farmerFundDTO';

@Controller('dashboard')
export class DashboardController {
  constructor(private dasService: DashboardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  CooperateReg(
    @getAdmin('admin_id') admin_id: number,
    @Body() dto: NewDashDto,
  ) {
    return this.dasService.newCooperate(admin_id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('wallet/:cooperate_emai')
  CooperateWallet(
    @getAdmin('admin_id') admin_id: number,
    @Param('cooperate_emai') email: string,
  ) {
    return this.dasService.cooperateW(admin_id, email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('validateWallet/:cooperate_email')
  ValidateCooperateWalletCreation(
    @getAdmin('admin_id') admin_id: number,
    @Param('cooperate_email') email: string,
  ) {
    return this.dasService.validateWalletCreation(admin_id, email);
  }

  @Post('agent/:apiKey')
  AgentReg(@Param('apiKey') apiKey: string, @Body() dto: NewAgentDto) {
    return this.dasService.newAgent(apiKey, dto);
  }

  @Post('login')
  CooperateLog(@Body() dto: DashLogDto) {
    return this.dasService.cooperateLog(dto);
  }

  @Post('farmers/funding')
  farmersFunding(@Body() dto: FarmersFundDto) {
    return this.dasService.farmerFunding(dto);
  }

  @Post('agent/login')
  AgentLog(@Body() dto: AgentLogDto) {
    return this.dasService.agentLog(dto);
  }

  @Post('agent-login')
  Cooperateog(@Body() dto: AgentLogDto) {
    return this.dasService.agentLog(dto);
  }

  @Post('state')
  AddState() {
    return this.dasService.inputs();
  }

  @Post('zone')
  AddZone() {
    return this.dasService.Addzone();
  }

  @Post('soil')
  AddSoil() {
    return this.dasService.inputs();
  }

  @Put('approve/supplier/:email/:apiKey')
  verifySupplier(@Param('email') email: string, @Param('apiKey') api: string) {
    return this.dasService.verifySupplier(email, api);
  }

  @Post('approve/request/:email/:phone/:rqsId')
  approval(
    @Param('email') email: string,
    @Param('phone') phone: string,
    @Param('rqsId') requestId: string,
  ) {
    return this.dasService.requestApproval(email, phone, requestId);
  }

  @Post('activate/supplier/:email/:apiKey')
  activateSupplierWallet(
    @Param('email') email: string,
    @Param('apiKey') api: string,
  ) {
    return this.dasService.activateSupplierWallet(email, api);
  }

  @Post('allocate/input/:apiKey')
  allocateInput(@Body() dto: AllocatedInputDto, @Param('apiKey') api: string) {
    return this.dasService.allocateInput(dto, api);
  }

  @Get(':apiKey')
  CooperateData(@Param('apiKey') api: string) {
    return this.dasService.getCooperate(api);
  }

  @Get('farmers/:arg/:apiKey')
  farmers(@Param('apiKey') api: string, @Param('arg') arg: string) {
    return this.dasService.farmers(api, arg);
  }

  @Get('wallets/:arg/:apiKey')
  FarmersWallets(@Param('apiKey') api: string, @Param('arg') arg: string) {
    return this.dasService.farmersWallet(api, arg);
  }

  @Get('agents/:arg/:apiKey')
  agents(@Param('apiKey') api: string, @Param('arg') arg: string) {
    return this.dasService.getAgents(api, arg);
  }

  @Get('suppliers/:arg/:apiKey')
  suppliers(@Param('apiKey') api: string, @Param('arg') arg: string) {
    return this.dasService.getSuppliers(api, arg);
  }

  @Get('suppliers/inputs/:arg/:apiKey')
  SuppliersInput(@Param('apiKey') api: string, @Param('arg') arg: string) {
    return this.dasService.getEopInput(api, arg);
  }

  @Get('farms/:arg/:apiKey')
  farms(@Param('apiKey') api: string, @Param('arg') arg: string) {
    return this.dasService.allFarms(api, arg);
  }

  //   @Post('local')
  //   AddLocal(@Body() dto: NewLocalDto) {
  //     return this.dasService.newLocal(dto);
  //   }
}
