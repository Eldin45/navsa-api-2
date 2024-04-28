import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminRegDto } from './dto';
import { adminLogDto } from './dto/adminLogDto';
import { AuthGuard } from '@nestjs/passport';
import { getAdmin } from './decorator';
import { NewDashDto } from './dto/newDashDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  AdminLogin(@Body() dto: adminLogDto) {
    return this.authService.adminLog(dto);
  }

  @Post('register')
  AdminReg(@Body() dto: AdminRegDto) {
    return this.authService.adminReg(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  GetAdmin(@getAdmin('admin_id') admin_id: number) {
    return this.authService.getAdmin(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/number/allfarmers')
  AllNumberF(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allNumberOFarmers(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/number/dashfarmers')
  DashNumberF(@getAdmin('admin_id') admin_id: number) {
    return this.authService.dashNumberOFarmers(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/number/cooperate')
  numberOfCooperate(@getAdmin('admin_id') admin_id: number) {
    return this.authService.numberOfCooperate(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/number/allcooperate')
  AllnumberOfCooperate(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allnumberOfCooperate(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/farmers')
  Allfarmers(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allFarmers(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admins')
  AllAdmins(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allAdmins(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/allsuppliers')
  Allsuppliers(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allsuppliers(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all')
  AdminData(@getAdmin('admin_id') admin_id: number) {
    return this.authService.getAdminData(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('wallet/open')
  GenerateWallet(@getAdmin('admin_id') admin_id: number) {
    return this.authService.generateWallet(admin_id);
  }

  @Post('otp/:phone/:apiKey')
  generateOtp(@Param('phone') phone: string, @Param('apiKey') apiKey: string) {
    return this.authService.generateOtp(phone, apiKey);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('payment/dashboard/:email')
  cooperateTranfer(
    @getAdmin('admin_id') admin_id: number,
    @Param('email') email: string,
  ) {
    return this.authService.cooperateTransfer(admin_id, email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/suppliers')
  UserSuppliers(@getAdmin('admin_id') admin_id: number) {
    return this.authService.suppliersByUser(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/numsuppliers')
  UserNumSuppliers(@getAdmin('admin_id') admin_id: number) {
    return this.authService.suppliersNumByUser(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all/farms')
  allFarms(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allFarms(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all/numfarms')
  allNumFarms(@getAdmin('admin_id') admin_id: number) {
    return this.authService.allNumFarms(admin_id);
  }
  // @Get('test')

  // GetP() {
  //   return this.authService.getUser();
  // }
  @UseGuards(AuthGuard('jwt'))
  @Post('test1')
  AddP(@getAdmin('admin_id') admin_id: number) {
    return this.authService.generateWallet(admin_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cooperate')
  newCooperate(
    @Body() @getAdmin('admin_id') admin_id: number,
    dto: NewDashDto,
  ) {
    return this.authService.newCooperate(admin_id, dto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('cooperate1')
  newCooperate1(
    @Body()
    dto: NewDashDto,
  ) {
    return this.authService.newCooperate1(dto);
  }
}
