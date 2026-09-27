const { AdminConfig } = require('../models');
const { localToUTC } = require('../utils/timezone');
const { findBestMentor } = require('./matchingService');

/**
 * Given a calendar date and IANA timezone (the parent's), returns the list
 * of slot start times on that date, in that timezone, for which at least
 * one mentor is currently available. Slot times are generated across the
 * platform's configured business-hours window and slot duration, then each
 * candidate slot is checked against the real matching logic so parents
 * never see a slot that isn't actually bookable.
 *
 * Because business hours in this simple model are a single global window
 * (see AdminConfig), and mentors are all in Asia/Kolkata while parents are
 * usually in US/UK, most of the *parent's* business hours window will
 * naturally surface the mentor-side evening/morning overlap - the timezone
 * conversion itself (not a second set of "regional" business hours) is
 * what makes the overlap correct across DST changes.
 */
async function getAvailableSlots({ dateStr, ianaZone }) {
  const config = await AdminConfig.getSingleton();
  const { startHour, endHour } = config.businessHours;
  const slotDurationMinutes = config.slotDurationMinutes;

  if (config.blackoutDates.includes(dateStr)) {
    return { slots: [], blackout: true };
  }

  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      let startTimeUTC;
      try {
        // Skip local times that don't exist (spring-forward DST gap) -
        // luxon marks these invalid rather than silently shifting them.
        startTimeUTC = localToUTC(dateStr, timeStr, ianaZone);
      } catch {
        continue;
      }
      const endTimeUTC = new Date(startTimeUTC.getTime() + slotDurationMinutes * 60000);

      // Don't offer slots that have already passed.
      if (startTimeUTC.getTime() < Date.now()) continue;

      const match = await findBestMentor({ startTimeUTC, endTimeUTC });
      if (match) {
        slots.push({
          timeStr,
          startTimeUTC,
          endTimeUTC,
          availableMentorCount: undefined, // intentionally not leaking mentor identity/count pre-booking
        });
      }
    }
  }

  return { slots, blackout: false };
}

module.exports = { getAvailableSlots };
