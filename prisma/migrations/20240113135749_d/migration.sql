-- AlterTable
ALTER TABLE `farmers_wallet` ADD COLUMN `cooperate` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `farmers_wallet` ADD CONSTRAINT `farmers_wallet_cooperate_fkey` FOREIGN KEY (`cooperate`) REFERENCES `cooperate_account`(`cooperate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
