import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminRegDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { adminLogDto } from './dto/adminLogDto';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { createHash } from 'crypto';
import { NewDashDto } from './dto/newDashDto';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private httpService: HttpService,
  ) {}

  async adminReg(dto: AdminRegDto) {
    console.log('testing local');
    try {
      return await this.prisma.$transaction(async (tx) => {
        const checkExist = await tx.admins.findUnique({
          where: {
            admin_email: dto.admin_email,
          },
        });

        if (checkExist)
          return new UnauthorizedException({
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Admin alredy exist',
            error: '',
          });

        const prvKey = await this.makeid(50);
        const puvKey = await this.makeid(50);
        const puvKey1 = 'pk_' + puvKey;
        const prvKey1 = 'pk_' + prvKey;

        const hashPass = await argon.hash(dto.hash);

        const newAdmin = await tx.admins.create({
          data: {
            admin_name: dto.admin_name,
            organisation: dto.organisation,

            admin_email: dto.admin_email,
            admin_phone: dto.admin_phone,
            previllage: dto.previllage,
            privateKey: prvKey1,
            publicKey: puvKey1,
            hash: hashPass,
          },
        });
        return this.SignToken(newAdmin.admin_id, newAdmin.admin_email);
      });
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
  async adminLog(dto: adminLogDto) {
    try {
      const checkAdmin = await this.prisma.admins.findUnique({
        where: {
          admin_email: dto.admin_email,
        },
      });
      if (!checkAdmin)
        return new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid email address',
          error: '',
        });

      const checPass = await argon.verify(checkAdmin.hash, dto.hash);
      if (!checPass)
        return new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid password',
          error: '',
        });

      return this.SignToken(checkAdmin.admin_id, checkAdmin.admin_email);
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

  async getAdmin(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');
      delete adminData.hash;
      delete adminData.previllage;
      delete adminData.updatedAt;
      delete adminData.createdAt;
      return {
        response: adminData,
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

  async getAdminData(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findMany({
        where: {
          admin_id,
        },
        include: {
          farmers: true,
          dashboard: true,
          suppliers: true,
          wallet: true,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      return {
        response: adminData,
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

  async allNumberOFarmers(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const farmers = await this.prisma.farmers_data.count();
      return {
        response: farmers,
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

  async walletTransfer(
    toBank: string,
    creditaccount: string,
    narration: string,
    amount: number,
    fromBank: string,
    debitAccount: string,
    beneficiaryemail: string,
  ) {
    const dateTime = new Date();

    const date = dateTime.toDateString();
    const time = dateTime.toTimeString();

    const request = Math.floor(1000000000 + Math.random() * 9000000000);
    const transferRef = Math.floor(1000000 + Math.random() * 9000000);
    //types declaration

    const requestId: any = request;
    const submitRequestId = requestId.toString();

    const APIKEY = this.config.get('APIKEY');
    const APITOKEN = this.config.get('TOKEN');

    const hashString = APIKEY + requestId + APITOKEN;
    const MARCHANT: any = this.config.get('MARCHANT');

    const requestTime = date + 'T' + time + '000000';

    const apiHash = createHash('sha512').update(hashString).digest('hex');

    const headers = {
      'Content-type': 'application/json',
      ' MERCHANT_ID': MARCHANT,
      ' API_KEY ': APIKEY,
      ' REQUEST_ID ': requestId,
      ' REQUEST_TS ': requestTime,
      ' API_DETAILS_HASH ': apiHash,
    };

    const data = {
      toBank: toBank,
      creditAccount: creditaccount,
      narration: narration,
      amount: 100,
      transRef: transferRef,
      fromBank: fromBank,
      debitAccount: debitAccount,
      beneficiaryemail: beneficiaryemail,
      requestId: submitRequestId,
    };
    const generate = await axios.post(
      'https://login.remita.net/remita/exapp/api/v1/send/api/schedulesvc/remitawallet/ft/singletransfer',
      data,
      { headers: headers },
    );
    //console.log(response);

    const transferData = generate.data;

    console.log(transferData);

    // const accountN = walletData.responseData[0].accountName;
    // const bankCoD = walletData.responseData[0].accountName;
    // const customerID = walletData.responseData[0].customerId;
    // const accountId = walletData.responseData[0].accountNo;

    return transferData;
  }

  async cooperateTransfer(admin_id: number, cooperate_email: string) {
    const transferRef = Math.floor(1000000 + Math.random() * 9000000);

    const ref = transferRef.toString();
    const dateTime = new Date();

    const date = dateTime.toDateString();
    const time = dateTime.toTimeString();

    const transferTime = date + 'T' + time + '000000';
    const type = 'DASHBOARD TRANSFER';

    const adminData = await this.prisma.admins.findUnique({
      where: {
        admin_id,
      },
      include: {
        wallet: true,
      },
    });

    if (!adminData) return new ForbiddenException('Invalid Admin');

    const cooperate = await this.prisma.cooperate_account.findUnique({
      where: {
        cooperate_email,
      },
      include: {
        wallet: true,
      },
    });
    const toBankCode = cooperate.wallet.bank_code;

    console.log(adminData.wallet.bank_code);

    const toBankAccount = cooperate.wallet.accountId;
    const naration = 'iwoiufyiueh';
    const amount = 100;
    const fromBankCode = adminData.wallet.bank_code;
    const fromBankAccount = adminData.wallet.accountId;
    const beneficiaryemail = cooperate.cooperate_email;

    if (!cooperate) return new ForbiddenException('Invalid  wkeklew Admin');
    const transfer = await this.walletTransfer(
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
        from_email: adminData.admin_email,
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

  async dashNumberOFarmers(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const farmers = await this.prisma.farmers_data.count({
        where: {
          dashId: admin_id,
        },
      });

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
      return {
        response: farmers,
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

  async numberOfCooperate(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const farmers = await this.prisma.cooperate_account.count({
        where: {
          dashId: admin_id,
        },
      });

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
      return {
        response: farmers,
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

  async allnumberOfCooperate(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const allcooperate = await this.prisma.cooperate_account.count();

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
      return {
        response: allcooperate,
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

  async allFarmers(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const allfarmers = await this.prisma.farmers_data.findMany();

      return {
        response: allfarmers,
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

  async generateWallet(admin_id: number) {
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
    const checkadmin = await this.prisma.admins.findUnique({
      where: {
        admin_id,
      },
    });

    if (!checkadmin)
      return new ForbiddenException(
        'Only authorized admin can generate wallet',
      );

    const checkDup = await this.prisma.admin_wallet.findFirst({
      where: {
        adminId: admin_id,
      },
    });

    await mutex.runExclusive(async () => {
      checkDup;
      console.log(mutex.isLocked);
    });
    if (checkDup) return new ForbiddenException('Dupplicate wallet createion');
    //getting data from authorised admin
    console.log(mutex.isLocked);
    const firstname = checkadmin.admin_name;
    const surname = 'Admin';
    const accountName = checkadmin.organisation;
    const email = checkadmin.admin_email;
    const phone = checkadmin.admin_phone;
    const dob = '12-02-2000';
    const gender = 'MALE';
    const type = 'PERSONAL';
    //declairing headers
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

    const saveWallet = await this.prisma.admin_wallet.create({
      data: {
        adminId: admin_id,
        customerId: customerID,
        requestId: submitRequestId,
        accountId: accountId,
        accountName: accountN,
        bank_code: bankCoD,
      },
    });

    if (!saveWallet)
      return new UnprocessableEntityException(
        'Unable to generate new wallet please try again',
      );

    delete saveWallet.adminId;
    return {
      response: saveWallet,
      statusCode: HttpStatus.OK,
    };
  }

  async validPhone(phone: string) {
    const first = phone[0];
    const length = phone.length;

    if (length == 11 && first === '0') {
      const val = phone.substring(1);
      const add = '234';
      const comp = add + val;
      return comp;
    } else if (phone.length == 10) {
      const add = '234';
      const comp = add + phone;
      return comp;
    }
  }

  async generateOtp(phone: string, apiKey: string) {
    const APIKEY = this.config.get('TERMI_KEY');
    const URL = this.config.get('TERMI_URL');
    //check if user is authorised admin

    const validPhone = await this.validPhone(phone);
    //console.log(validPhone);
    const validatApiKey = await this.prisma.admins.findFirst({
      where: {
        publicKey: apiKey,
      },
    });

    if (!validatApiKey) return new ForbiddenException('Innvalid api key');

    //getting data from authorised admin
    const message = 'Your NAVSA phone number verificationn pin is';
    //declairing headers
    const headers = {
      'Content-type': 'application/json',
    };

    const data = {
      api_key: APIKEY,
      message_type: 'NUMERIC',
      to: validPhone,
      from: 'N-Alert',
      channel: 'dnd',
      pin_attempts: 10,
      pin_time_to_live: 60,
      pin_length: 6,
      pin_placeholder: '< 1234 >',
      message_text: message + '< 1234 >',
      pin_typet: 'NUMERIC',
    };
    const generate = await axios.post(
      'https://api.ng.termii.com/api/sms/otp/send',
      data,
      { headers: headers },
    );
    //console.log(response);
    const otpData = generate.data.pinId;

    return {
      response: otpData,
      statusCode: HttpStatus.OK,
    };
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

  async newCooperate1(dto: NewDashDto) {
    const checkExist = await this.prisma.cooperate_account.findUnique({
      where: {
        cooperate_email: dto.cooperate_email,
      },
    });

    if (checkExist) throw new UnauthorizedException('Admin alredy exist');

    const prvKey = await this.makeid(50);
    const puvKey = await this.makeid(50);

    const prvKey1 = 'pk_' + prvKey;
    const puvKey1 = 'pk_' + puvKey;
    const hashPass = await argon.hash(dto.hash);
    const admin_id = 1;
    console.log(hashPass);

    const cooperate = await this.prisma.cooperate_account.create({
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
    delete cooperate.cooperate_id;
    return cooperate;
  }
  // async newCooperate(admin_id: number, dto: NewDashDto, wdto: CoprWalletDto) {
  //   try {
  //     const checkExist = await this.prisma.cooperate_account.findUnique({
  //       where: {
  //         cooperate_email: dto.cooperate_email,
  //       },
  //     });

  //     if (checkExist) throw new UnauthorizedException('Admin alredy exist');

  //     const prvKey = await this.makeid(50);
  //     const puvKey = await this.makeid(50);

  //     const prvKey1 = 'pk_' + prvKey;
  //     const puvKey1 = 'pk_' + puvKey;
  //     const hashPass = await argon.hash(dto.hash);
  //     console.log(hashPass);

  //     const cooperate = await this.prisma.cooperate_account.create({
  //       data: {
  //         dashId: admin_id,
  //         rep_fullname: dto.rep_fullname,
  //         rep_phone: dto.rep_phone,
  //         cooperate_name: dto.cooperate_name,
  //         cooperate_email: dto.cooperate_email,
  //         cooperative_cac: dto.cooperative_cac,
  //         previllage: dto.previllage,
  //         privateKey: prvKey1,
  //         publicKey: puvKey1,
  //         hash: hashPass,

  //         wallet: {
  //           create:{

  //           }
  //           },
  //         },
  //       },
  //     });
  //     delete cooperate.cooperate_id;
  //     return cooperate;
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.FORBIDDEN,
  //         error: 'something went wrong registering',
  //       },
  //       HttpStatus.FORBIDDEN,
  //       {
  //         cause: error,
  //       },
  //     );
  //   }
  // }

  async SignToken(
    admin_id: number,
    admin_email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: admin_id,
      admin_email,
    };

    const secret = this.config.get('JWT_SECRET');

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });

    return {
      access_token: accessToken,
    };
  }

  async allsuppliers(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const allsuppliers = await this.prisma.input_supplier.findMany();

      return {
        response: allsuppliers,
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

  async allAdmins(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const admins = await this.prisma.admins.findMany();

      return {
        response: admins,
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

  async allFarms(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const farms = await this.prisma.farms.findMany();

      return {
        response: farms,
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

  async allNumFarms(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const numbFarms = await this.prisma.farms.count({});

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
      return {
        response: numbFarms,
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

  async suppliersNumByUser(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const suppliers = await this.prisma.input_supplier.count({
        where: {
          dashID: admin_id,
        },
      });

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
      return {
        response: suppliers,
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

  async suppliersByUser(admin_id: number) {
    try {
      const adminData = await this.prisma.admins.findUnique({
        where: {
          admin_id,
        },
      });

      if (!adminData) return new UnauthorizedException('Invalid Admin');

      const suppliers = await this.prisma.input_supplier.findMany({
        where: {
          dashID: admin_id,
        },
      });

      // delete adminData.hash;
      // delete adminData.previllage;
      // delete adminData.updatedAt;
      // delete adminData.createdAt;
      return {
        response: suppliers,
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
}
