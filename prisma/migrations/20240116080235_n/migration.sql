-- CreateTable
CREATE TABLE `transactions` (
    `transaction` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` VARCHAR(191) NOT NULL,
    `from_email` VARCHAR(191) NOT NULL,
    `to_email` VARCHAR(191) NOT NULL,
    `transfer_reference` VARCHAR(191) NOT NULL,
    `from_accountId` VARCHAR(191) NOT NULL,
    `to_accountId` VARCHAR(191) NOT NULL,
    `transaction_time` VARCHAR(191) NOT NULL,
    `response_message` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `naration` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transactions_from_accountId_key`(`from_accountId`),
    PRIMARY KEY (`transaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
