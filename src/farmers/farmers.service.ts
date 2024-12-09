import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewFarmersDto } from './dto/farmersDto';
import * as argon from 'argon2';
import { FarmersLogDto } from './dto/farmersLogDto';
import { NewFarmDto } from './dto/newFarmDto';
import { NewSoilDto } from './dto/soilDto';
import { FarmTypeDto } from './dto/farmTypeDto';
import axios, { HttpStatusCode } from 'axios';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { Mutex, Semaphore, withTimeout } from 'async-mutex';
import { InputRequestDto } from './dto/eopInputRequestDto';
import { NewWorkPlanDto } from './dto/workPlanDto';
import { NewReportDto } from './dto/reportDto';
const mutex = new Mutex();

@Injectable()
export class FarmersService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async newFarmer(dto: NewFarmersDto) {
    try {
      const checkExist = await this.prisma.farmers_data.findUnique({
        where: {
          f_phone: dto.f_phone,
        },
      });

      if (checkExist)
        throw new UnauthorizedException('Farmer already registered');

      const hashPass = await argon.hash(dto.hash);

      const farmer = await this.prisma.farmers_data.create({
        data: {
          f_cooperate: dto.f_cooperate,
          agentId: dto.agentId,
          surname: dto.surname,
          firstname: dto.firstname,
          other_name: dto.other_name,
          f_email: dto.f_email,
          f_phone: dto.f_phone,
          f_gendar: dto.f_gendar,
          f_dob: dto.f_dob,
          f_qualification: dto.f_qualification,
          zoneId: dto.zoneId,
          stateId: dto.stateId,

          hash: hashPass,
        },
      });
      return farmer;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async validateFarmer(f_phone: string) {
    return await this.prisma.$transaction(async (tx) => {
      const geFarmer = await tx.farmers_data.findUnique({
        where: {
          f_phone,
        },
      });

      if (!geFarmer)
        return new ForbiddenException(
          'Sorry the nunmber provided is not valid ',
        );

      //getting data from authorised admin

      return {
        message: 'Verification PIN sent to your number',
        status: 1,
        farmer: f_phone,
      };
    });
  }

  async activateFarmer(f_phone: string) {
    try {
      const checkData = await this.prisma.farmers_data.findUnique({
        where: {
          f_phone,
        },
      });

      if (!checkData) throw new UnauthorizedException('Icredentials');

      // const hashPass = await argon.hash(dto.hash);
      const email1 = checkData.f_email;
      const email = email1 + 'lo';
      const farmer = await this.prisma.farmers_data.create({
        data: {
          f_cooperate: checkData.f_cooperate,
          agentId: checkData.agentId,
          surname: checkData.surname,
          firstname: checkData.firstname,
          other_name: checkData.other_name,
          f_email: email,
          f_phone: checkData.f_phone,
          f_gendar: checkData.f_gendar,
          f_dob: checkData.f_dob,
          f_qualification: checkData.f_qualification,
          zoneId: checkData.zoneId,
          stateId: checkData.zoneId,

          hash: checkData.hash,
        },
      });

      if (!farmer)
        return new UnprocessableEntityException(
          'Something went wrong activating farmer',
        );

      return farmer;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async famersW(f_phone: string, apiKey: string) {
    const dateTime = new Date();

    const date = dateTime.toDateString();
    const time = dateTime.toTimeString();

    const request = Math.floor(1000000000 + Math.random() * 9000000000);
    const customer = Math.floor(1000000 + Math.random() * 9000000);
    //types declaration
    const customerId: any = customer;
    const requestId: any = request;

    const submitRequestId = requestId.toString();

    const APIKEY = this.config.get('APIKEY');
    const APITOKEN = this.config.get('TOKEN');

    const hashString = APIKEY + requestId + APITOKEN;
    const MARCHANT: any = this.config.get('MARCHANT');

    const requestTime = date + 'T' + time + '000000';

    const apiHash = createHash('sha512').update(hashString).digest('hex');
    console.log(apiHash);
    //check if user is authorised admin
    const getKey = await this.prisma.cooperate_account.findFirst({
      where: {
        publicKey: apiKey,
      },
    });

    if (!getKey) return new ForbiddenException('Invalid API key');

    const farmerData = await this.prisma.farmers_data.findUnique({
      where: {
        f_phone,
      },
    });
    if (!farmerData) return new ForbiddenException('Invalid farmer');

    if (!getKey) return new ForbiddenException('Invalid API key');

    const farmer = farmerData.farmer_id;

    // const checkDupW = await mutex.runExclusive(async () => {
    //   this.prisma.farmers_wallet.findUnique({
    //   where: {
    //     farmerId: farmer,
    //   },
    // });
    // )}}
    // const release = await Mutex.acquire();
    // try {
    //     // ...
    // } finally {
    //     release();
    // }

    const checkDp = await this.prisma.farmers_wallet.findUnique({
      where: {
        farmerId: farmer,
      },
    });
    await mutex.runExclusive(async () => {
      checkDp;
    });

    console.log(mutex.isLocked);

    if (checkDp) return new ForbiddenException('Dupplicate wallet createion');
    const accountNa = farmerData.firstname + ' ' + farmerData.surname;

    const famerID = farmer;
    const firstname = farmerData.firstname;
    const surname = farmerData.surname;
    // const accountName = accountNa;
    const email = farmerData.f_email;
    const phone = farmerData.f_phone;
    const dob = '12-02-2000';
    const gender = farmerData.f_gendar;

    const type = 'PERSONAL';
    //  declairing headers
    const headers = {
      'Content-type': 'application/json',
      ' MERCHANT_ID': MARCHANT,
      ' API_KEY ': APIKEY,
      ' REQUEST_ID ': requestId,
      ' REQUEST_TS ': requestTime,
      ' API_DETAILS_HASH ': apiHash,
    };

    const data = {
      requestId: requestId,
      firstName: firstname,
      lastName: surname,
      accountName: accountNa,
      email: email,
      phoneNumber: phone,
      dateOfBirth: dob,

      customerId: customerId,
      accountTypeId: type,
      gender: gender,
      isRestrictedWallet: 'false',
      otherAccounts: [
        {
          requestId: requestId,
          accountName: accountNa,
          accountTypeId: type,
          isRestrictedWallet: 'True',
        },
      ],
    };
    const generate = await axios.post(
      'https://login.remita.net/remita/exapp/api/v1/send/api/schedulesvc/remitawallet/open',
      data,
      { headers: headers },
    );
    //console.log(response);
    const walletData = generate.data;

    const accountN = walletData.responseData[0].accountName;
    const bankCoD = walletData.responseData[0].bankCode;
    const customerID = walletData.responseData[0].customerId;
    const accountId = walletData.responseData[0].accountNo;

    const accountN2 = walletData.responseData[1].accountName;
    const bankCoD2 = walletData.responseData[1].accountName;
    const customerID2 = walletData.responseData[1].customerId;
    const accountId2 = walletData.responseData[1].accountNo;

    console.log(accountId);

    const saveWallet = await this.prisma.farmers_wallet.create({
      data: {
        farmerId: famerID,
        customerId: customerID,
        requestId: submitRequestId,
        Account_name: accountN,
        open_accountId: accountId,
        close_accountId: accountId2,
        bank_code: bankCoD,
      },
    });

    if (!saveWallet)
      return new UnprocessableEntityException(
        'Unable to generate new wallet please try again',
      );

    return {
      message: 'Admin wallet generates successfully',
      status: 1,
      farmer: f_phone,
      name: firstname,
      accountName: accountNa,
    };
  }

  async addFarm(dto: NewFarmDto, f_phone: string, apiKey: string) {
    try {
      const getKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!getKey) return new ForbiddenException('Invalid API key');

      const farmerData = await this.prisma.farmers_data.findUnique({
        where: {
          f_phone,
        },
      });

      if (!farmerData) return new ForbiddenException('Invalid farmer');
      const farmer = farmerData.farmer_id;

      const farm = await this.prisma.farms.create({
        data: {
          farmerId: farmer,
          soilId: dto.soilId,
          farmT_id: dto.farmT_id,
          ents_id: dto.ents_id,
          size: dto.size,
          farm_name: dto.farm_name,
          farm_location: dto.farm_location,
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
      });
      return farm;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async farmerLog(dto: FarmersLogDto, apiKey: string) {
    try {
      const getKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!getKey) return new ForbiddenException('Invalid API key');

      const checkAccount = await this.prisma.farmers_data.findUnique({
        where: {
          f_phone: dto.f_phone,
        },
      });
      if (!checkAccount)
        return new UnauthorizedException('Invalid phone number');

      const checPass = await argon.verify(checkAccount.hash, dto.hash);
      if (!checPass) return new UnauthorizedException('Invalid password');
      delete checkAccount.hash;
      delete checkAccount.createdAt;
      delete checkAccount.updatedAt;

      return checkAccount;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'something went wrong registering',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getfarmer(f_phone: string, apiKey: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      const farmer = await this.prisma.farmers_data.findFirst({
        where: {
          f_phone,
        },
        include: {
          farms: true,
          wallet: true,
          state: true,
          zones: true,
          epInputs: true,
        },
      });
      return {
        response: farmer,
        statusCode: HttpStatus.OK,
      };

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'something went wrong registering',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getfarm(f_phone: string, apiKey: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      const farmer = await this.prisma.farmers_data.findFirst({
        where: {
          f_phone,
        },
      });

      const famrerId = farmer.farmer_id;

      const farms = await this.prisma.farms.findMany({
        where: {
          farmerId: famrerId,
        },
        include: {
          soil: true,
          store: true,
          plan: true,
          report: true,
        },
      });

      return {
        response: farms,
        statusCode: HttpStatus.OK,
      };

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'something went wrong registering',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async inputsRequest(dto: InputRequestDto) {
    try {
      const farmersData = await this.prisma.farmers_data.findUnique({
        where: {
          f_phone: dto.f_phone,
        },
      });
      if (!farmersData)
        return new ForbiddenException(
          'Only registered farmers can make input request',
        );
      const farmer = farmersData.farmer_id;
      //   const checkDupp = await this.prisma.eopInput_request.findUnique({
      //     where: {
      //       famersId: farmer,
      //     },
      //   });

      //   await mutex.runExclusive(async () => {
      //     checkDupp;
      //   });

      //   if (checkDupp)
      //     return new ForbiddenException({
      //       message: 'You can not make dupplicate request to thesame input',
      //       statusCode: HttpStatus.FORBIDDEN,
      //     });

      const inputRequest = await this.prisma.eopInput_request.create({
        data: {
          famersId: farmer,
          eopInt_id: dto.eopInt_id,
        },
      });
      return inputRequest;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'something went wrong registering',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async newWorkPlan(dto: NewWorkPlanDto, apiKey: string) {
    try {
      const getKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!getKey) return new ForbiddenException('Invalid API key');

      const checkExist = await this.prisma.workplan.findFirst({
        where: {
          farmId: dto.farmId,
          plan: dto.plan,
        },
      });
      await mutex.runExclusive(async () => {
        checkExist;
      });
      if (checkExist)
        return new ForbiddenException({
          message: 'Dupplicate work plan entry',
          statusCode: HttpStatus.FORBIDDEN,
        });

      const farm = await this.prisma.workplan.create({
        data: {
          farmId: dto.farmId,
          plan: dto.plan,
          plan_description: dto.plan_description,
        },
      });

      return farm;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async farmWeather(farmId: string) {
    //const newM = marketName.charAt(0) + marketName.slice(1).toLowerCase;
    const farmsId = parseInt(farmId);
    try {
      const farm = await this.prisma.farms.findUnique({
        where: {
          farm_id: farmsId,
        },
      });
      if (!farm)
        return new ForbiddenException(
          'You can only view weather for valid farm',
        );

      const latitude = farm.latitude; //'9.0765'; //market.latitude;
      const longitude = farm.longitude; //'7.3986'; //market.longitude;

      const generateWeather = await axios.post(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=b1b7127ffa2036c7509ffbb99fac64fa&units=metric`,
      );
      //console.log(response);
      const weather = generateWeather.data;

      return weather;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'something went wrong try again',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async newReports(dto: NewReportDto, apiKey: string) {
    try {
      const getKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!getKey) return new ForbiddenException('Invalid API key');

      //   const checkExist = await this.prisma.reports.findFirst({
      //     where: {
      //       farmId: dto.farmId,
      //       plan: dto.plan,
      //     },
      //   });
      //   await mutex.runExclusive(async () => {
      //     checkExist;
      //   });
      //   if (checkExist)
      //     return new ForbiddenException({
      //       message: 'Dupplicate work plan entry',
      //       statusCode: HttpStatus.FORBIDDEN,
      //     });

      const farm = await this.prisma.reports.create({
        data: {
          farmId: dto.farmId,
          title: dto.title,
          report_data: dto.report_data,
        },
      });

      return farm;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
