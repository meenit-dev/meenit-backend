import { Injectable } from '@nestjs/common';
import { UserService } from 'src/module/user/service/user.service';
import { SlotRepository } from '../repository/slot.repository';
import { addHours } from 'date-fns';
import { Slot } from '../entity/slot.entity';
import { Transactional } from 'typeorm-transactional';
import { PatchSlotBodyDto } from '../dto/slot.dto';
import { UUID } from '@common/type';
import { ForbiddenError, NotFoundError } from '@common/error';

@Injectable()
export class SlotService {
  private readonly SLOT_COUNT = 6;
  constructor(
    private readonly slotRepository: SlotRepository,
    private readonly userService: UserService,
  ) {}

  getNextMonths(monthCount: number): string[] {
    const months: string[] = [];
    const now = addHours(new Date(), 9);
    now.setUTCDate(1);

    for (let i = 0; i < monthCount; i++) {
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth() + 1;
      const formatted = `${year}-${String(month).padStart(2, '0')}`;
      months.push(formatted);
      now.setUTCMonth(now.getUTCMonth() + 1);
    }

    return months;
  }

  @Transactional()
  async getSlotsByHandle(handle: string) {
    const user = await this.userService.getCreatorByHandle(handle);
    const months = this.getNextMonths(this.SLOT_COUNT);
    const slots =
      await this.slotRepository.findManyUserIdAndDurationMonthAndSplit(
        user.id,
        months[0],
        months[months.length - 1],
        user.creatorSetting.slotMonthSplitCount,
      );
    if (
      slots.length ===
      this.SLOT_COUNT * user.creatorSetting.slotMonthSplitCount
    ) {
      return slots;
    }

    const createSlots = await Promise.all(
      months
        .flatMap((month) =>
          Array.from(
            { length: user.creatorSetting.slotMonthSplitCount },
            (_, i) => ({ month, split: i + 1 }),
          ),
        )
        .filter(
          ({ month, split }) =>
            !slots.find((slot) => slot.month === month && slot.split === split),
        )
        .map(({ month, split }) =>
          this.slotRepository.save(Slot.of({ userId: user.id, month, split })),
        ),
    );
    return slots
      .concat(createSlots)
      .sort(({ month: a, split: a_s }, { month: b, split: b_s }) =>
        a === b ? (a_s > b_s ? 1 : -1) : a > b ? 1 : -1,
      );
  }

  @Transactional()
  async updateSlotByIdAndUserId(
    slotId: UUID,
    userId: UUID,
    updateRequest: PatchSlotBodyDto,
  ) {
    const slot = await this.slotRepository.findOneById(slotId);
    if (!slot) {
      throw new NotFoundError();
    }
    if (slot.userId !== userId) {
      throw new ForbiddenError();
    }
    this.slotRepository.save(slot.update(updateRequest));
  }
}
