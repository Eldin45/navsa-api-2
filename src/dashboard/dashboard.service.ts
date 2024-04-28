import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/prisma/prisma.service';
import { NewDashDto } from './dto/newDashDto';
import * as argon from 'argon2';
import { DashLogDto } from './dto/dashLoginDto';
import { NewAgentDto } from './dto/newAgentDto';
import { AgentLogDto } from './dto/agentLogDto';

import { createHash } from 'crypto';
import axios from 'axios';
import { Mutex } from 'async-mutex';
import { AllocatedInputDto } from './dto/allocateInputDto';
import { FarmersFundDto } from './dto/farmerFundDTO';
import { AuthService } from 'src/auth/auth.service';

const mutex = new Mutex();
@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private wallet: AuthService,
  ) {}

  async newCooperate(admin_id: number, dto: NewDashDto) {
    return await this.prisma.$transaction(async (tx) => {
      const checkExist = await tx.cooperate_account.findUnique({
        where: {
          cooperate_email: dto.cooperate_email,
        },
      });

      if (checkExist) throw new UnauthorizedException('Admin alredy exist');

      const hashPass = await argon.hash(dto.hash);
      const prvKey = await this.makeid(50);
      const puvKey = await this.makeid(50);
      const puvKey1 = 'pk_' + puvKey;
      const prvKey1 = 'pk_' + prvKey;
      const cooperate = await tx.cooperate_account.create({
        data: {
          dashId: admin_id,
          rep_fullname: dto.rep_fullname,
          rep_phone: dto.rep_phone,
          cooperate_name: dto.cooperate_name,
          cooperate_email: dto.cooperate_email,
          previllage: dto.previllage,
          privateKey: prvKey1,
          publicKey: puvKey1,
          hash: hashPass,
        },
      });
      delete cooperate.hash;
      delete cooperate.privateKey;
      delete cooperate.publicKey;
      delete cooperate.hash;
      delete cooperate.createdAt;
      delete cooperate.updatedAt;
      return cooperate;
    });
  }

  async cooperateW(
    admin_id: number,
    cooperate_email: string,
    //  dto: CooperateWalletDto,
  ) {
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
    const getCooperate = await this.prisma.cooperate_account.findUnique({
      where: {
        cooperate_email,
      },
    });

    if (!getCooperate)
      return new ForbiddenException(
        'You need a valid cooperate to generate wallet',
      );
    const id = getCooperate.cooperate_id;
    console.log(id);
    const firstname = getCooperate.rep_fullname;
    const surname = 'Cooperate';
    const accountName = getCooperate.cooperate_name;
    const email = getCooperate.cooperate_email;
    const phone = getCooperate.rep_phone;
    const dob = '12-02-2000';
    const gender = 'MALE';

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
      accountName: accountName,
      email: email,
      phoneNumber: phone,
      dateOfBirth: dob,

      customerId: customerId,
      accountTypeId: type,
      gender: gender,
      isRestrictedWallet: 'false',
    };
    const generate = await axios.post(
      'https://login.remita.net/remita/exapp/api/v1/send/api/schedulesvc/remitawallet/open',
      data,
      { headers: headers },
    );
    //console.log(response);
    const walletData = generate.data;

    const accountN = walletData.responseData[0].accountName;
    const bankCoD = walletData.responseData[0].accountName;
    const customerID = walletData.responseData[0].customerId;
    const accountId = walletData.responseData[0].accountNo;

    const saveWallet = await this.prisma.cooperate_wallet.create({
      data: {
        cooperateId: id,
        customerId: customerID,
        requestId: submitRequestId,
        account_name: accountN,
        accountId: accountId,
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
      admin: admin_id,
      name: firstname,
      accountName: accountN,
    };
  }

  async farmerFunding(dto: FarmersFundDto) {
    const transferRef = Math.floor(1000000 + Math.random() * 9000000);

    const ref = transferRef.toString();
    const dateTime = new Date();

    const date = dateTime.toDateString();
    const time = dateTime.toTimeString();

    const transferTime = date + 'T' + time + '000000';
    const type = 'DASHBOARD TRANSFER';

    const validatApiKey = await this.prisma.admins.findFirst({
      where: {
        publicKey: dto.apiKey,
      },
    });

    if (!validatApiKey) return new ForbiddenException('Innvalid api key');

    const cooperate = await this.prisma.cooperate_account.findUnique({
      where: {
        cooperate_email: dto.cooperate_email,
      },
      include: {
        wallet: true,
      },
    });

    const farmer = await this.prisma.farmers_data.findUnique({
      where: {
        f_phone: dto.f_phone,
      },
      include: {
        wallet: true,
      },
    });

    const toBankCode = farmer.wallet.bank_code;

    const toBankAccount = farmer.wallet.close_accountId;
    const naration = 'iwoiufyiueh';
    const amount = 100;
    const fromBankCode = cooperate.wallet.bank_code;
    const fromBankAccount = cooperate.wallet.accountId;
    const beneficiaryemail = farmer.f_email;

    if (!cooperate) return new ForbiddenException('Invalid  wkeklew Admin');
    const transfer = await this.wallet.walletTransfer(
      toBankCode,
      toBankAccount,
      naration,
      amount,
      fromBankCode,
      fromBankAccount,
      beneficiaryemail,
    );

    if (!transfer)
      return new UnprocessableEntityException(
        'Something wrong in the process of transfer',
      );

    const responseCode = transfer.responseCode;
    const responseMessage = transfer.responseMsg;
    const saveTransaction = await this.prisma.transactions.create({
      data: {
        from_email: cooperate.cooperate_email,
        to_email: beneficiaryemail,
        transfer_reference: ref,
        from_accountId: fromBankAccount,
        to_accountId: toBankAccount,
        transaction_time: transferTime,
        response_message: responseMessage,
        response_code: responseCode,
        transaction_type: type,
        amount: amount,
        naration: naration,
        toBankCode: toBankCode,
        fromBankCode: fromBankCode,
      },
    });

    return {
      response: saveTransaction,
      statusCode: HttpStatus.OK,
    };
  }

  async requestApproval(rep_email: string, f_phone: string, requestId: string) {
    const request = parseInt(requestId);
    const status = 1;
    const transferRef = Math.floor(1000000 + Math.random() * 9000000);

    const ref = transferRef.toString();
    const dateTime = new Date();

    const date = dateTime.toDateString();
    const time = dateTime.toTimeString();

    const transferTime = date + 'T' + time + '000000';
    const type = 'INPUT APPROVAL FUNDING';

    // const validatApiKey = await this.prisma.admins.findFirst({
    //   where: {
    //     publicKey: dto.apiKey,
    //   },
    // });

    // if (!validatApiKey) return new ForbiddenException('Innvalid api key');

    const supplier = await this.prisma.input_supplier.findUnique({
      where: {
        rep_email: rep_email,
      },
      include: {
        wallet: true,
      },
    });

    if (!supplier) return new ForbiddenException('Invalid  supplier');

    const farmer = await this.prisma.farmers_data.findUnique({
      where: {
        f_phone: f_phone,
      },
      include: {
        wallet: true,
      },
    });
    if (!farmer) return new ForbiddenException('Invalid farmer');
    const checkvalidRequest = await this.prisma.eopInput_request.findFirst({
      where: {
        epRequest_id: request,
      },
    });

    if (!checkvalidRequest) return new ForbiddenException('Invalid request');

    const approve = await this.prisma.eopInput_request.update({
      where: {
        epRequest_id: request,
      },
      data: {
        approve_status: status,
      },
    });

    await mutex.runExclusive(async () => {
      approve;
    });

    if (!approve)
      return new UnauthorizedException(
        'Something went wrong  supplier try again',
      );

    const toBankCode = supplier.wallet.bank_code;

    const toBankAccount = supplier.wallet.accountId;
    const naration = 'iwoiufyiueh';
    const amount = 100;
    const fromBankCode = '598'; //farmer.wallet.bank_code;
    const fromBankAccount = farmer.wallet.open_accountId;
    const beneficiaryemail = rep_email;

    const transfer = await this.wallet.walletTransfer(
      toBankCode,
      toBankAccount,
      naration,
      amount,
      fromBankCode,
      fromBankAccount,
      beneficiaryemail,
    );

    if (!transfer)
      return new UnprocessableEntityException(
        'Something wrong in the process of transfer',
      );

    const responseCode = transfer.responseCode;
    const responseMessage = transfer.responseMsg;

    if (responseCode === '00') {
      const saveTransaction = await this.prisma.transactions.create({
        data: {
          from_email: farmer.f_email,
          to_email: beneficiaryemail,
          transfer_reference: ref,
          from_accountId: fromBankAccount,
          to_accountId: toBankAccount,
          transaction_time: transferTime,
          response_message: responseMessage,
          response_code: responseCode,
          transaction_type: type,
          amount: amount,
          naration: naration,
          toBankCode: toBankCode,
          fromBankCode: fromBankCode,
        },
      });

      return {
        response: saveTransaction,
        statusCode: HttpStatus.OK,
      };
    } else {
      const approve = await this.prisma.eopInput_request.update({
        where: {
          epRequest_id: request,
        },
        data: {
          approve_status: 0,
        },
      });

      const saveTransaction = await this.prisma.transactions.create({
        data: {
          from_email: farmer.f_email,
          to_email: beneficiaryemail,
          transfer_reference: ref,
          from_accountId: fromBankAccount,
          to_accountId: toBankAccount,
          transaction_time: transferTime,
          response_message: responseMessage,
          response_code: responseCode,
          transaction_type: type,
          amount: amount,
          naration: naration,
          toBankCode: toBankCode,
          fromBankCode: fromBankCode,
        },
      });

      return {
        response: saveTransaction,
        statusCode: HttpStatus.OK,
      };
    }
  }

  async validateWalletCreation(
    admin_id: number,
    cooperate_email: string,
    //  dto: CooperateWalletDto,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const getCooperate = await tx.cooperate_account.findUnique({
        where: {
          cooperate_email,
        },
      });

      if (!getCooperate)
        return new ForbiddenException(
          'You need a valid cooperate to generate wallet',
        );
      const id = getCooperate.cooperate_id;
      console.log(id);
      //check if customer ID exist
      const checkExist = await tx.cooperate_wallet.findUnique({
        where: {
          cooperateId: id,
        },
      });
      if (checkExist)
        return new ForbiddenException('Wallet already generated for this user');

      //getting data from authorised admin

      return {
        message: 'Cooperate valid to generate account',
        status: 1,
        cooperateEmail: cooperate_email,
        admin: admin_id,
      };
    });
  }

  async cooperateLog(dto: DashLogDto) {
    try {
      const checkAccount = await this.prisma.cooperate_account.findUnique({
        where: {
          cooperate_email: dto.cooperate_email,
        },
      });
      if (!checkAccount)
        return new UnauthorizedException('Invalid email address');

      const checPass = await argon.verify(checkAccount.hash, dto.hash);
      if (!checPass) return new UnauthorizedException('Invalid password');
      delete checkAccount.hash;

      delete checkAccount.publicKey;
      delete checkAccount.hash;
      delete checkAccount.createdAt;
      delete checkAccount.updatedAt;
      return checkAccount;
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

  async newAgent(apiKey: string, dto: NewAgentDto) {
    try {
      //Validate api key
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperateId = validatApiKey.cooperate_id;
      //check for dupplicate agent creation
      const checkExist = await this.prisma.cooperate_agent.findUnique({
        where: {
          agent_email: dto.agent_email,
        },
      });

      if (checkExist)
        return new UnauthorizedException(
          'Agent with the submitted data  alredy exist',
        );

      const prvKey = await this.makeid(50);

      const prvKey1 = 'pk_' + prvKey;

      const hashPass = await argon.hash(dto.hash);

      const agent = await this.prisma.cooperate_agent.create({
        data: {
          agent_fullname: dto.agent_fullname,
          agent_email: dto.agent_email,
          agent_phone: dto.agent_phone,
          cooperate: cooperateId,
          privateKey: prvKey1,
          hash: hashPass,
        },
      });
      delete agent.hash;
      return {
        status: 1,
        message: 'Agent created successfully',
      };
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

  //   async newZone(dto: NewZoneDto) {
  //     try {
  //       const checkExist = await this.prisma.zone.findUnique({
  //         where: {
  //           zone: dto.zone,
  //         },
  //       });

  //       if (checkExist)
  //         throw new UnauthorizedException('zone name added already');

  //       const zone = await this.prisma.zone.create({
  //         data: {
  //           zone: dto.zone,
  //           description: dto.description,
  //         },
  //       });
  //       return zone;
  //     } catch (error) {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.FORBIDDEN,
  //           error: 'something went wrong registering',
  //         },
  //         HttpStatus.FORBIDDEN,
  //         {
  //           cause: error,
  //         },
  //       );
  //     }
  //   }

  //   async newState(dto: NewStateDto) {
  //     try {
  //       const checkExist = await this.prisma.states.findUnique({
  //         where: {
  //           state: dto.state,
  //         },
  //       });

  //       if (checkExist)
  //         throw new UnauthorizedException('zone name added already');

  //       const state = await this.prisma.states.create({
  //         data: {
  //           state: dto.state,
  //           description: dto.description,
  //         },
  //       });
  //       return state;
  //     } catch (error) {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.FORBIDDEN,
  //           error: 'something went wrong registering',
  //         },
  //         HttpStatus.FORBIDDEN,
  //         {
  //           cause: error,
  //         },
  //       );
  //     }
  //   }

  async addStates() {
    const states = await this.prisma.states.createMany({
      data: [
        { state_name: 'Abia', state_map: 'abia.png', state_logo: 'NULL' },
        {
          state_name: 'Adamawa',
          state_map: 'adamawa.webp',
          state_logo: 'NULL',
        },
        { state_name: 'Akwa Ibom', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Anambra', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Bauchi', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Bayelsa', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Benue', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Borno', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Cross River', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Delta', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Ebonyi', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Edo', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Ekiti', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Enugu', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'FCT', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Gombe', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Imo', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Jigawa', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Kaduna', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Kano', state_map: 'NULL', state_logo: 'NULL' },

        { state_name: 'Katsina', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Kebbi', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Kogi', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Kwara', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Lagos', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Nasarawa', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Niger', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Ogun', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Ondo', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Osun', state_map: 'NULL', state_logo: 'NULL' },

        { state_name: 'Oyo', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Plateau', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Rivers', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Sokoto', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Taraba', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Yobe', state_map: 'NULL', state_logo: 'NULL' },
        { state_name: 'Zamfara', state_map: 'NULL', state_logo: 'NULL' },
      ],
    });

    return states;
  }

  async verifySupplier(rep_email: string, apiKey: string) {
    const getKey = await this.prisma.cooperate_account.findFirst({
      where: {
        publicKey: apiKey,
      },
    });

    if (!getKey) return new ForbiddenException('Invalid API key');

    const suppliersData = await this.prisma.input_supplier.findUnique({
      where: {
        rep_email,
      },
    });
    if (!suppliersData)
      return new ForbiddenException(
        'Only registered suppliers can be activated',
      );

    if (!getKey) return new ForbiddenException('Invalid API key');

    const supplier = suppliersData.supplier_id;

    const status = 1;

    const verify = await this.prisma.input_supplier.update({
      where: {
        supplier_id: supplier,
      },
      data: {
        approve_status: status,
      },
    });

    if (!verify)
      return new UnauthorizedException(
        'Something went wrong verifying supplier try again',
      );

    return {
      message: 'Supplier Approved Successfully',
      status: 1,
      supplier: rep_email,
    };
  }

  async activateSupplierWallet(rep_email: string, apiKey: string) {
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

    const suppliersData = await this.prisma.input_supplier.findUnique({
      where: {
        rep_email,
      },
    });
    if (!suppliersData)
      return new ForbiddenException(
        'Only registered suppliers can be activated',
      );

    if (!getKey) return new ForbiddenException('Invalid API key');

    const supplier = suppliersData.supplier_id;

    // const checkDp = await this.prisma.suppliers_wallet.findUnique(
    //   where:{
    //     supplier
    //   }
    // });
    // await mutex.runExclusive(async () => {
    //   checkDp;
    // });

    // console.log(mutex.isLocked);

    //
    const checkDup = await this.prisma.suppliers_wallet.findUnique({
      where: {
        supplierId: supplier,
      },
    });

    await mutex.runExclusive(async () => {
      checkDup;
    });
    if (checkDup) return new ForbiddenException('Dupplicate wallet createion');

    const firstname = suppliersData.rep_name;
    const surname = suppliersData.company_name;
    const accountName = suppliersData.company_name;
    const email = suppliersData.rep_email;
    const phone = suppliersData.rep_phone;
    const dob = '12-02-2000';
    const gender = 'MALE';

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
      accountName: accountName,
      email: email,
      phoneNumber: phone,
      dateOfBirth: dob,

      customerId: customerId,
      accountTypeId: type,
      gender: gender,
      isRestrictedWallet: 'false',
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

    console.log(accountId);

    const saveWallet = await this.prisma.suppliers_wallet.create({
      data: {
        supplierId: supplier,
        customerId: customerID,
        requestId: submitRequestId,
        account_name: accountN,
        accountId: accountId,

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
      farmer: email,
      name: firstname,
      accountName: accountName,
    };
  }

  async Addzone() {
    const inds = this.prisma.zone.createMany({
      data: [
        { zone: 'North Central ', description: '' },
        { zone: ' North East', description: '' },
        { zone: 'North West ', description: '' },
        { zone: 'South West', description: '' },
        { zone: 'South East', description: '' },
        { zone: 'South South', description: '' },
      ],
    });

    return inds;
  }

  async inputs() {
    const inds = this.prisma.agro_inputs.createMany({
      data: [
        {
          input_name: 'Fertilizer ',
          input_unit: 'BAG',
          quantity: 10,
          price: 5000,
        },
        {
          input_name: 'Insectiside ',
          input_unit: 'LTR',
          quantity: 30,
          price: 5000,
        },
        { input_name: 'Seed', input_unit: 'BAG', quantity: 30, price: 5000 },
      ],
    });

    return inds;
  }

  async AddSoil() {
    const inds = this.prisma.soil_types.createMany({
      data: [
        { soil_name: 'Sandy soil ', soil_description: '' },
        { soil_name: 'Silt Soil. ', soil_description: '' },
        { soil_name: 'Clay Soil ', soil_description: '' },
        { soil_name: 'Loamy Soil', soil_description: '' },
      ],
    });

    return inds;
  }

  async types() {
    const inds = this.prisma.farm_types.createMany({
      data: [
        { type_name: 'Crop production ', description: '' },
        { type_name: 'Livestock', description: '' },
        { type_name: 'Fishery', description: '' },
      ],
    });

    return inds;
  }

  async enterprice() {
    const inds = this.prisma.enterprise.createMany({
      data: [
        { enterprise_name: 'RICE FARMING ', description: '' },
        { enterprise_name: 'GOAT REARING', description: '' },
        { enterprise_name: 'PEPPER FARMING', description: '' },
        { enterprise_name: 'OKRO FARMING', description: '' },
        { enterprise_name: 'TOMATO FARMING', description: '' },
        { enterprise_name: 'UGWU FARMING ', description: '' },
        { enterprise_name: 'POULTRY ', description: '' },
        { enterprise_name: 'COCOA SEEDLING ', description: '' },
        { enterprise_name: 'CATTLE REARING', description: '' },
        { enterprise_name: 'MAIZE FARMING', description: '' },
        { enterprise_name: 'FISHERIES ', description: '' },
        { enterprise_name: 'ONION FARMING', description: '' },
        { enterprise_name: 'HIBISCUS', description: '' },
        { enterprise_name: 'POTATO FARMIN', description: '' },
        { enterprise_name: 'CARROT FARMING ', description: '' },
        { enterprise_name: 'CABBAGE FARMING ', description: '' },
        { enterprise_name: 'VEGETABLE FARMING ', description: '' },
        { enterprise_name: 'GROUNDNUT FARMING', description: '' },
        { enterprise_name: 'SESAME FARMING ', description: '' },
      ],
    });

    return inds;
  }

  async allocateInput(dto: AllocatedInputDto, apiKey: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperateId = validatApiKey.cooperate_id;

      //check for dupplicate agent creation
      const checkExist = await this.prisma.allocated_inputs.findFirst({
        where: {
          farmID: dto.farmID,
          inputId: dto.inputId,
        },
      });

      if (checkExist)
        return new ForbiddenException({
          message: 'Dupplicate input allocation',
          statusCode: HttpStatus.FORBIDDEN,
        });

      const newAllocation = await this.prisma.allocated_inputs.create({
        data: {
          farmID: dto.farmID,
          inputId: dto.inputId,
          quantity: dto.quantity,
          unit: dto.unit,
        },
      });

      await mutex.runExclusive(async () => {
        newAllocation;
      });
      if (!newAllocation)
        return new ForbiddenException(
          'Something went wrong allocating inputs please try again',
        );

      const farm = dto.farmID;
      const input = dto.inputId;
      const quantity = dto.quantity;

      const addToStore = await this.prisma.farm_store.create({
        data: {
          farmID: farm,
          inputId: input,
          quantity: quantity,
        },
      });

      return {
        statusCode: HttpStatus.ACCEPTED,
        status: 1,
        message: 'Agent created successfully',
      };
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

  async agentLog(dto: AgentLogDto) {
    try {
      const checkAgent = await this.prisma.cooperate_agent.findUnique({
        where: {
          agent_email: dto.agent_email,
        },
      });
      if (!checkAgent)
        return new UnauthorizedException('Invalid email address');

      const checPass = await argon.verify(checkAgent.hash, dto.hash);
      if (!checPass) return new UnauthorizedException('Invalid password');

      delete checkAgent.hash;
      return checkAgent;
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

  async getCooperate(apiKey: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');
      const cooperate = validatApiKey.cooperate_id;
      const cooperateData = await this.prisma.cooperate_account.findUnique({
        where: {
          cooperate_id: cooperate,
        },
      });
      return {
        response: cooperateData,
        statusCode: HttpStatus.OK,
      };
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

  async farmers(apiKey: string, arg: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      if (arg === 'numfarmers') {
        const farmers = await this.prisma.farmers_data.count({
          where: {
            f_cooperate: cooperate,
          },
        });
        return {
          response: farmers,
          statusCode: HttpStatus.OK,
        };
      } else if (arg === 'all') {
        const farmers = await this.prisma.farmers_data.findMany({
          where: {
            f_cooperate: cooperate,
          },
          include: {
            farms: true,
            wallet: true,
            agents: true,
          },
        });
        return {
          response: farmers,
          statusCode: HttpStatus.OK,
        };
      } else {
        return new NotFoundException();
      }

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

  async allFarms(apiKey: string, arg: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      if (arg === 'numfarms') {
        const farms = await this.prisma.farms.count({
          where: {
            cooperat: cooperate,
          },
        });
        return {
          response: farms,
          statusCode: HttpStatus.OK,
        };
      } else if (arg === 'all') {
        const farms = await this.prisma.farms.findMany({
          where: {
            cooperat: cooperate,
          },
          include: {
            farmerID: true,
            farmT: true,
            soil: true,
            enterprises: true,
            plan: true,
            report: true,
          },
        });
        return {
          response: farms,
          statusCode: HttpStatus.OK,
        };
      } else {
        return new NotFoundException();
      }

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

  async farmersWallet(apiKey: string, arg: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      if (arg === 'numwallet') {
        const wallets = await this.prisma.farmers_wallet.count({
          where: {
            cooperate: cooperate,
          },
        });
        return {
          response: wallets,
          statusCode: HttpStatus.OK,
        };
      } else if (arg === 'all') {
        const wallets = await this.prisma.farmers_wallet.findMany({
          where: {
            cooperate: cooperate,
          },
        });
        return {
          response: wallets,
          statusCode: HttpStatus.OK,
        };
      } else {
        return new NotFoundException();
      }

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

  async getAgents(apiKey: string, arg: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      if (arg === 'numagent') {
        const agents = await this.prisma.cooperate_agent.count({
          where: {
            cooperate: cooperate,
          },
        });
        return {
          response: agents,
          statusCode: HttpStatus.OK,
        };
      } else if (arg === 'all') {
        const agents = await this.prisma.cooperate_agent.findMany({
          where: {
            cooperate: cooperate,
          },
          include: {
            farmer: true,
          },
        });
        return {
          response: agents,
          statusCode: HttpStatus.OK,
        };
      } else {
        return new NotFoundException();
      }

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

  async getSuppliers(apiKey: string, arg: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      if (arg === 'numsuppliers') {
        const suppliers = await this.prisma.input_supplier.count({
          where: {
            cooperate: cooperate,
          },
        });
        return {
          response: suppliers,
          statusCode: HttpStatus.OK,
        };
      } else if (arg === 'all') {
        const suppliers = await this.prisma.input_supplier.findMany({
          where: {
            cooperate: cooperate,
          },
          include: {},
        });
        return {
          response: suppliers,
          statusCode: HttpStatus.OK,
        };
      } else {
        return new NotFoundException();
      }

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

  async getEopInput(apiKey: string, supplierId: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      const supplier = parseInt(supplierId);

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');

      const cooperate = validatApiKey.cooperate_id;

      const eopInput = await this.prisma.eop_inputs.findMany({
        where: {
          supplierId: supplier,
        },
        include: {
          farmers: true,
        },
      });
      return {
        response: eopInput,
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

  async makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
