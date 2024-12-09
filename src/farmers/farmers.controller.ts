import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { NewFarmersDto } from './dto/farmersDto';
import { FarmersLogDto } from './dto/farmersLogDto';
import { NewFarmDto } from './dto/newFarmDto';
import { NewSoilDto } from './dto/soilDto';
import { FarmTypeDto } from './dto/farmTypeDto';
import { InputRequestDto } from './dto/eopInputRequestDto';
import { NewWorkPlanDto } from './dto/workPlanDto';
import { NewReportDto } from './dto/reportDto';

@Controller('farme')
export class FarmersController {
  constructor(private farmerService: FarmersService) {}

  @Post()
  farmerReg(@Body() dto: NewFarmersDto) {
    return this.farmerService.newFarmer(dto);
  }

  @Post('/login/:apiKey1')
  farmerLog(@Body() dto: FarmersLogDto, @Param('apiKey1') api: string) {
    return this.farmerService.farmerLog(dto, api);
  }

  @Post('farm/:phone/:apiKey')
  newFarm(
    @Body() dto: NewFarmDto,
    @Param('phone') phone: string,
    @Param('apiKey') api: string,
  ) {
    return this.farmerService.addFarm(dto, phone, api);
  }

  @Post('/:phone')
  ValidateFarmer(@Param('phone') phone: string) {
    return this.farmerService.validateFarmer(phone);
  }

  @Post('activate/:phone')
  ActivateFarmer(@Param('phone') phone: string) {
    return this.farmerService.activateFarmer(phone);
  }

  @Post('wallet/:phone/:apiKey')
  ActivateFWallet(@Param('phone') phone: string, @Param('apiKey') api: string) {
    return this.farmerService.famersW(phone, api);
  }
  @Post('workplan/:apiKey')
  farmWorkPlan(@Body() dto: NewWorkPlanDto, @Param('apiKey') api: string) {
    return this.farmerService.newWorkPlan(dto, api);
  }

  @Post('report/:apiKey')
  farmReport(@Body() dto: NewReportDto, @Param('apiKey') api: string) {
    return this.farmerService.newReports(dto, api);
  }

  @Get(':phone/:apiKey')
  FarmerData(@Param('phone') phone: string, @Param('apiKey') api: string) {
    return this.farmerService.getfarmer(phone, api);
  }

  @Get('farm/:phone/:apiKey')
  FarmData(@Param('phone') phone: string, @Param('apiKey') api: string) {
    return this.farmerService.getfarm(phone, api);
  }

  @Post('input/request')
  inputRequest(@Body() dto: InputRequestDto) {
    return this.farmerService.inputsRequest(dto);
  }

  @Get('farms/weather/:farmId')
  getFarmWeather(@Param('farmId') farm: string) {
    return this.farmerService.farmWeather(farm);
  }
}
