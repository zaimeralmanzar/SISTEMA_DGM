import type { OverstayResult } from '../../models';

const DAILY_RATE = 25;

export const overstayServiceMock = {
  calculate(entryDate: string, plannedExit: string, authorizedDays: number): OverstayResult {
    const entry = new Date(entryDate);
    const exit = new Date(plannedExit);
    const msPerDay = 1000 * 60 * 60 * 24;
    const elapsedDays = Math.max(0, Math.ceil((exit.getTime() - entry.getTime()) / msPerDay));
    const exceededDays = Math.max(0, elapsedDays - authorizedDays);
    const estimatedFee = exceededDays * DAILY_RATE;

    const breakdown: { concept: string; amount: number }[] = [];
    if (exceededDays > 0) {
      breakdown.push({ concept: `${exceededDays} día(s) de exceso × RD$${DAILY_RATE}`, amount: estimatedFee });
    }

    return { entryDate, plannedExit, authorizedDays, elapsedDays, exceededDays, estimatedFee, breakdown, isOverstay: exceededDays > 0 };
  },
};
