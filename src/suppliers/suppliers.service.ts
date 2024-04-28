import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewSupplierDto } from './dto/newSupplierDto';
import * as argon from 'argon2';
import { SupplierLogDto } from './dto/supplierLogDto';
import { NewInputsDto } from './dto/newInputsDto';
import { NewEopInputsDto } from './dto/eopInputsDto';
import { InputRequestDto } from '../farmers/dto/eopInputRequestDto';
import axios from 'axios';
import { Mutex, Semaphore, withTimeout } from 'async-mutex';
import { createHash } from 'crypto';
import { PinSettingsDto } from './dto/settingsDto';
import { ChangePassDto } from './dto/changePassDto';
const mutex = new Mutex();

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

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
  async supplierLog(dto: SupplierLogDto, apiKey: string) {
    try {
      const getKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!getKey) return new ForbiddenException('Invalid API key');

      const checkSupplier = await this.prisma.input_supplier.findUnique({
        where: {
          rep_email: dto.rep_email,
        },
      });
      if (!checkSupplier)
        return new UnauthorizedException('Invalid email address');

      const checPass = await argon.verify(checkSupplier.hash, dto.hash);
      if (!checPass) return new UnauthorizedException('Invalid password');

      return checkSupplier;
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
  async newSupplier(dto: NewSupplierDto, apiKey: string) {
    try {
      const getKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!getKey) return new ForbiddenException('Invalid API key');

      const coopId = getKey.cooperate_id;

      const checkExist = await this.prisma.input_supplier.findUnique({
        where: {
          rep_email: dto.rep_email,
        },
      });

      if (checkExist)
        return new ForbiddenException(
          'Supplier with the the subbmited data already registered',
        );

      const hashPass = await argon.hash(dto.hash);

      const supplier = await this.prisma.input_supplier.create({
        data: {
          cooperate: coopId,
          rep_name: dto.rep_name,
          rep_email: dto.rep_email,
          rep_phone: dto.rep_phone,
          company_name: dto.company_name,
          company_address: dto.company_address,
          company_location: dto.company_location,
          cac: dto.cac,
          hash: hashPass,
        },
      });
      return supplier;
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

  async newEopInputs(dto: NewEopInputsDto, rep_email: string, apiKey: string) {
    try {
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

      const newInput = await this.prisma.eop_inputs.create({
        data: {
          inputId: dto.inputId,
          assigned_price: dto.assigned_price,
          eop_id: dto.eop_id,
          supplierId: supplier,
        },
      });
      return newInput;
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

  async activateEopInput(eopId: string, rep_email: string, apiKey: string) {
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

    const eop = parseInt(eopId);

    const supplier = suppliersData.supplier_id;

    const status = 1;

    const verify = await this.prisma.eop_inputs.update({
      where: {
        eopI_id: eop,
        supplierId: supplier,
      },
      data: {
        activeStatus: status,
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

  async changePassword(dto: ChangePassDto, rep_email: string, apiKey: string) {
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

    const checPass = await argon.verify(suppliersData.hash, dto.old_password);
    if (!checPass)
      return new ForbiddenException(
        'Old password did not match pleae try again',
      );

    const supplier = suppliersData.supplier_id;

    const changePass = await this.prisma.input_supplier.update({
      where: {
        supplier_id: supplier,
      },
      data: {
        hash: dto.new_password,
      },
    });

    if (!changePass)
      return new UnauthorizedException({
        message: 'Something went wrong changing password pleae try again,',
        statusCode: HttpStatus.FORBIDDEN,
      });

    return {
      message: 'Password Change is successful',
      statusCode: HttpStatus.ACCEPTED,
      supplier: rep_email,
    };
  }

  async setPin(dto: PinSettingsDto, rep_email: string, apiKey: string) {
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

    const pin = await argon.hash(dto.transactionPin);

    const addPin = await this.prisma.supplier_settings.create({
      data: {
        supplierId: supplier,
        transactionPin: pin,
      },
    });

    if (!addPin)
      return new UnauthorizedException('Something went wrong registering');

    return {
      message: 'Transaction PIN added successfully',
      status: 1,
      supplier: rep_email,
    };
  }

  //   async newEopInputs(dto: NewEopInputsDto) {
  //     try {
  //       const newEopInput = await this.prisma.eop_inputs.create({
  //         data: {
  //           inputId: dto.inputId,
  //           assigned_price: dto.assigned_price,
  //           eop_id: dto.eop_id,
  //           supplierId: dto.supplierId,
  //         },
  //       });
  //       return newEopInput;
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

  async getSupplier(rep_email: string, apiKey: string) {
    try {
      const validatApiKey = await this.prisma.cooperate_account.findFirst({
        where: {
          publicKey: apiKey,
        },
      });

      if (!validatApiKey) return new ForbiddenException('Innvalid api key');
      const validateSupplier = await this.prisma.input_supplier.findFirst({
        where: {
          rep_email: rep_email,
        },
      });

      if (!validateSupplier) return new ForbiddenException('Innvalid sipplier');

      const cooperate = validatApiKey.cooperate_id;

      const supplier = await this.prisma.input_supplier.findFirst({
        where: {
          rep_email: rep_email,
        },
        include: {
          wallet: true,
          eop_input: true,
          request: true,
        },
      });
      return {
        response: supplier,
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
}
