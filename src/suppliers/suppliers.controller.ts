import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { NewFarmersDto } from 'src/farmers/dto/farmersDto';
import { NewSupplierDto } from './dto/newSupplierDto';
import { SupplierLogDto } from './dto/supplierLogDto';
import { NewInputsDto } from './dto/newInputsDto';
import { NewEopInputsDto } from './dto/eopInputsDto';
import { PinSettingsDto } from './dto/settingsDto';
import { ChangePassDto } from './dto/changePassDto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private supplierService: SuppliersService) {}

  @Post(':apiKey')
  supplierReg(@Body() dto: NewSupplierDto, @Param('apiKey') api: string) {
    return this.supplierService.newSupplier(dto, api);
  }

  @Post('/login/:apiKey')
  supplierLog(@Body() dto: SupplierLogDto, @Param('apiKey') api: string) {
    return this.supplierService.supplierLog(dto, api);
  }

  //   @Post('input')
  //   newInput(@Body() dto: NewInputsDto) {
  //     return this.supplierService.newInputs(dto);
  //   }
  @Post('eop/input/:email/:apiKey')
  newEopInput(
    @Body() dto: NewEopInputsDto,
    @Param('email') email: string,
    @Param('apiKey') api: string,
  ) {
    return this.supplierService.newEopInputs(dto, email, api);
  }

  @Post('activate/eop/:eopId/:email/:apiKey')
  activateEopInput(
    @Param('eopId') eopId: string,
    @Param('email') email: string,
    @Param('apiKey') api: string,
  ) {
    return this.supplierService.activateEopInput(eopId, email, api);
  }

  @Get(':email/:apiKey')
  supplierData(@Param('email') email: string, @Param('apiKey') api: string) {
    return this.supplierService.getSupplier(email, api);
  }

  @Post('pin/:email/:apiKey')
  setPin(
    @Body() dto: PinSettingsDto,
    @Param('email') email: string,
    @Param('apiKey') api: string,
  ) {
    return this.supplierService.setPin(dto, email, api);
  }

  @Put('password/:email/:apiKey')
  changePassword(
    @Body() dto: ChangePassDto,
    @Param('email') email: string,
    @Param('apiKey') api: string,
  ) {
    return this.supplierService.changePassword(dto, email, api);
  }
}
