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
    const user = await this.userService.getUserByHandle(handle);
    const months = this.getNextMonths(this.SLOT_COUNT);
    const slots = await this.slotRepository.findManyUserIdAndDurationMonth(
      user.id,
      months[0],
      months[months.length - 1],
    );
    if (slots.length === this.SLOT_COUNT) {
      return slots;
    }

    const slotMonths = slots.map((slot) => slot.month);
    const createSlots = await Promise.all(
      months
        .filter((month) => !slotMonths.includes(month))
        .map((month) =>
          this.slotRepository.save(Slot.of({ userId: user.id, month })),
        ),
    );
    return slots
      .concat(createSlots)
      .sort(({ month: a }, { month: b }) => (a > b ? 1 : -1));
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
