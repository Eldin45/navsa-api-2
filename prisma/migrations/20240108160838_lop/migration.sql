-- CreateTable
CREATE TABLE `admins` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_name` VARCHAR(191) NOT NULL,
    `organisation` VARCHAR(191) NOT NULL,
    `admin_email` VARCHAR(191) NOT NULL,
    `admin_phone` VARCHAR(191) NOT NULL,
    `previllage` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_admin_email_key`(`admin_email`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_wallet` (
    `wallet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `bank_code` VARCHAR(191) NOT NULL,
    `crm_code` VARCHAR(191) NULL,
    `funnd_status` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_wallet_adminId_key`(`adminId`),
    UNIQUE INDEX `admin_wallet_customerId_key`(`customerId`),
    PRIMARY KEY (`wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cooperate_account` (
    `cooperate_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dashId` INTEGER NOT NULL,
    `rep_fullname` VARCHAR(191) NOT NULL,
    `rep_phone` VARCHAR(191) NOT NULL,
    `cooperate_name` VARCHAR(191) NOT NULL,
    `cooperate_email` VARCHAR(191) NOT NULL,
    `previllage` VARCHAR(191) NOT NULL,
    `privateKey` VARCHAR(191) NOT NULL,
    `publicKey` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cooperate_account_cooperate_email_key`(`cooperate_email`),
    PRIMARY KEY (`cooperate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cooperate_wallet` (
    `wallet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cooperateId` INTEGER NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `bank_code` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cooperate_wallet_cooperateId_key`(`cooperateId`),
    PRIMARY KEY (`wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cooperate_agent` (
    `agent_id` INTEGER NOT NULL AUTO_INCREMENT,
    `agent_fullname` VARCHAR(191) NOT NULL,
    `agent_phone` VARCHAR(191) NOT NULL,
    `agent_email` VARCHAR(191) NOT NULL,
    `cooperate` INTEGER NOT NULL,
    `privateKey` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cooperate_agent_agent_phone_key`(`agent_phone`),
    UNIQUE INDEX `cooperate_agent_agent_email_key`(`agent_email`),
    PRIMARY KEY (`agent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farmers_data` (
    `farmer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `f_cooperate` INTEGER NOT NULL,
    `agentId` INTEGER NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `other_name` VARCHAR(191) NOT NULL,
    `f_email` VARCHAR(191) NOT NULL,
    `f_phone` VARCHAR(191) NOT NULL,
    `f_gendar` VARCHAR(191) NOT NULL,
    `f_dob` VARCHAR(191) NOT NULL,
    `f_image` VARCHAR(191) NULL,
    `f_qualification` VARCHAR(191) NOT NULL,
    `zoneId` INTEGER NOT NULL,
    `stateId` INTEGER NOT NULL,
    `localId` INTEGER NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `farmers_data_f_email_key`(`f_email`),
    UNIQUE INDEX `farmers_data_f_phone_key`(`f_phone`),
    PRIMARY KEY (`farmer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farms` (
    `farm_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmerId` INTEGER NOT NULL,
    `soilId` INTEGER NOT NULL,
    `farmT_id` INTEGER NOT NULL,
    `ents_id` INTEGER NOT NULL,
    `farm_name` VARCHAR(191) NOT NULL,
    `farm_location` VARCHAR(191) NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `f_image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`farm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `soil_types` (
    `soil_id` INTEGER NOT NULL AUTO_INCREMENT,
    `soil_name` VARCHAR(191) NOT NULL,
    `soil_description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `soil_types_soil_name_key`(`soil_name`),
    UNIQUE INDEX `soil_types_soil_description_key`(`soil_description`),
    PRIMARY KEY (`soil_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farm_types` (
    `type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `farm_types_type_name_key`(`type_name`),
    UNIQUE INDEX `farm_types_description_key`(`description`),
    PRIMARY KEY (`type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enterprise` (
    `enterprise_id` INTEGER NOT NULL AUTO_INCREMENT,
    `enterprise_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `enterprise_description_key`(`description`),
    PRIMARY KEY (`enterprise_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zone` (
    `zone_id` INTEGER NOT NULL AUTO_INCREMENT,
    `zone` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `zone_zone_key`(`zone`),
    UNIQUE INDEX `zone_description_key`(`description`),
    PRIMARY KEY (`zone_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `state_id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `states_state_key`(`state`),
    UNIQUE INDEX `states_description_key`(`description`),
    PRIMARY KEY (`state_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `localGvt` (
    `local_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `localGvt_name_key`(`name`),
    PRIMARY KEY (`local_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farmers_wallet` (
    `wallet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmerId` INTEGER NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `open_accountId` VARCHAR(191) NOT NULL,
    `close_accountId` VARCHAR(191) NOT NULL,
    `bank_code` VARCHAR(191) NOT NULL,
    `crm_code` VARCHAR(191) NOT NULL,
    `funnd_status` INTEGER NULL,
    `previllage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `farmers_wallet_farmerId_key`(`farmerId`),
    PRIMARY KEY (`wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `input_supplier` (
    `supplier_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cooperate` INTEGER NOT NULL,
    `rep_name` VARCHAR(191) NOT NULL,
    `rep_email` VARCHAR(191) NOT NULL,
    `rep_phone` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `company_location` VARCHAR(191) NOT NULL,
    `company_address` VARCHAR(191) NOT NULL,
    `cac` VARCHAR(191) NOT NULL,
    `verification_pin` VARCHAR(191) NOT NULL,
    `recover_pin` VARCHAR(191) NOT NULL,
    `approve_status` INTEGER NOT NULL,
    `previllage` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `input_supplier_rep_email_key`(`rep_email`),
    PRIMARY KEY (`supplier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers_wallet` (
    `wallet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `bank_code` VARCHAR(191) NOT NULL,
    `crm_code` VARCHAR(191) NOT NULL,
    `funnd_status` INTEGER NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `suppliers_wallet_supplierId_key`(`supplierId`),
    PRIMARY KEY (`wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agro_inputs` (
    `input_id` INTEGER NOT NULL AUTO_INCREMENT,
    `input_name` VARCHAR(191) NOT NULL,
    `input_unit` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `agro_inputs_input_name_key`(`input_name`),
    PRIMARY KEY (`input_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eop_inputs` (
    `eopI_id` INTEGER NOT NULL AUTO_INCREMENT,
    `inputId` INTEGER NOT NULL,
    `assigned_price` DECIMAL(65, 30) NOT NULL,
    `eop_id` INTEGER NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`eopI_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iv_inputs` (
    `ivinputs_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `product_unit` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `eop_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ivinputs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eopInput_request` (
    `epRequest_id` INTEGER NOT NULL AUTO_INCREMENT,
    `famersId` INTEGER NOT NULL,
    `eopInt_id` INTEGER NOT NULL,
    `approve_state` INTEGER NOT NULL DEFAULT 1,
    `approve_token` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`epRequest_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allocated_inputs` (
    `allocatedd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmID` INTEGER NOT NULL,
    `ivinputId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`allocatedd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workplan` (
    `workplan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farmId` INTEGER NOT NULL,
    `plan` VARCHAR(191) NOT NULL,
    `plan_description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`workplan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_farmsToiv_inputs` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_farmsToiv_inputs_AB_unique`(`A`, `B`),
    INDEX `_farmsToiv_inputs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_wallet` ADD CONSTRAINT `admin_wallet_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cooperate_account` ADD CONSTRAINT `cooperate_account_dashId_fkey` FOREIGN KEY (`dashId`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cooperate_wallet` ADD CONSTRAINT `cooperate_wallet_cooperateId_fkey` FOREIGN KEY (`cooperateId`) REFERENCES `cooperate_account`(`cooperate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cooperate_agent` ADD CONSTRAINT `cooperate_agent_cooperate_fkey` FOREIGN KEY (`cooperate`) REFERENCES `cooperate_account`(`cooperate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmers_data` ADD CONSTRAINT `farmers_data_f_cooperate_fkey` FOREIGN KEY (`f_cooperate`) REFERENCES `cooperate_account`(`cooperate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmers_data` ADD CONSTRAINT `farmers_data_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `cooperate_agent`(`agent_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmers_data` ADD CONSTRAINT `farmers_data_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`zone_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmers_data` ADD CONSTRAINT `farmers_data_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `states`(`state_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmers_data` ADD CONSTRAINT `farmers_data_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `localGvt`(`local_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `farmers_data`(`farmer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_soilId_fkey` FOREIGN KEY (`soilId`) REFERENCES `soil_types`(`soil_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_farmT_id_fkey` FOREIGN KEY (`farmT_id`) REFERENCES `farm_types`(`type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_ents_id_fkey` FOREIGN KEY (`ents_id`) REFERENCES `enterprise`(`enterprise_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farmers_wallet` ADD CONSTRAINT `farmers_wallet_farmerId_fkey` FOREIGN KEY (`farmerId`) REFERENCES `farmers_data`(`farmer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `input_supplier` ADD CONSTRAINT `input_supplier_cooperate_fkey` FOREIGN KEY (`cooperate`) REFERENCES `cooperate_account`(`cooperate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suppliers_wallet` ADD CONSTRAINT `suppliers_wallet_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `input_supplier`(`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eop_inputs` ADD CONSTRAINT `eop_inputs_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `agro_inputs`(`input_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eop_inputs` ADD CONSTRAINT `eop_inputs_eop_id_fkey` FOREIGN KEY (`eop_id`) REFERENCES `enterprise`(`enterprise_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eop_inputs` ADD CONSTRAINT `eop_inputs_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `input_supplier`(`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eopInput_request` ADD CONSTRAINT `eopInput_request_famersId_fkey` FOREIGN KEY (`famersId`) REFERENCES `farmers_data`(`farmer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eopInput_request` ADD CONSTRAINT `eopInput_request_eopInt_id_fkey` FOREIGN KEY (`eopInt_id`) REFERENCES `eop_inputs`(`eopI_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocated_inputs` ADD CONSTRAINT `allocated_inputs_farmID_fkey` FOREIGN KEY (`farmID`) REFERENCES `farms`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocated_inputs` ADD CONSTRAINT `allocated_inputs_ivinputId_fkey` FOREIGN KEY (`ivinputId`) REFERENCES `iv_inputs`(`ivinputs_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workplan` ADD CONSTRAINT `workplan_farmId_fkey` FOREIGN KEY (`farmId`) REFERENCES `farms`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_farmsToiv_inputs` ADD CONSTRAINT `_farmsToiv_inputs_A_fkey` FOREIGN KEY (`A`) REFERENCES `farms`(`farm_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_farmsToiv_inputs` ADD CONSTRAINT `_farmsToiv_inputs_B_fkey` FOREIGN KEY (`B`) REFERENCES `iv_inputs`(`ivinputs_id`) ON DELETE CASCADE ON UPDATE CASCADE;
