export class SetPeriod {
  setPeriods(period = 'last_seven_days') {
    const OneDayInMilliseconds = 86400000,
      currentDate = new Date(new Date().getTime() - OneDayInMilliseconds);

    switch (period) {
      case 'yesterday':
        // // @ts-ignore
        // let yearEnd = currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   dateEnd = currentDate.getUTCDate(),
        //   // @ts-ignore
        //   defaultDate = new Date(currentDate.getTime()),
        //   // @ts-ignore
        //   yearStart = defaultDate.getUTCFullYear(),
        //   // @ts-ignore
        //   dateStart = defaultDate.getUTCDate(),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() + 1;
        //
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getYesterday(currentDate);
      case 'today':
        // // @ts-ignore
        // let yearEnd = currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   dateEnd = currentDate.getUTCDate() + 1,
        //   // @ts-ignore
        //   defaultDate = new Date(currentDate.getTime() + OneDayInMilliseconds),
        //   // @ts-ignore
        //   yearStart = defaultDate.getUTCFullYear(),
        //   // @ts-ignore
        //   dateStart = defaultDate.getUTCDate(),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() + 1;
        //
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getTodayPeriod(currentDate, OneDayInMilliseconds);
      case 'last_three_days':
        // // @ts-ignore
        // let yearEnd = currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   dateEnd = currentDate.getUTCDate(),
        //   // @ts-ignore
        //   defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * 2),
        //   // @ts-ignore
        //   yearStart = defaultDate.getUTCFullYear(),
        //   // @ts-ignore
        //   dateStart = defaultDate.getUTCDate(),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() + 1;
        //
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getLastThreeDaysPeriod(currentDate, OneDayInMilliseconds);
      case 'last_sixty_days':
        // // @ts-ignore
        // let yearEnd = currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   dateEnd = currentDate.getUTCDate(),
        //   // @ts-ignore
        //   defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * 59),
        //   // @ts-ignore
        //   yearStart = defaultDate.getUTCFullYear(),
        //   // @ts-ignore
        //   dateStart = defaultDate.getUTCDate(),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() + 1;
        //
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getLastSixtyDaysPeriod(currentDate, OneDayInMilliseconds);
      case 'last_month':
        // const todayDate = new Date().getDate();
        // // @ts-ignore
        // let yearEnd = currentDate.getUTCMonth() === 0 ? currentDate.getUTCFullYear() - 1 : currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() === 0 ? 12 : todayDate === 1 ? currentDate.getUTCMonth() + 1 : currentDate.getUTCMonth(),
        //   dateForDaysInMonth = new Date(yearEnd, monthEnd - 1, 33).getUTCDate(),
        //   // @ts-ignore
        //   dateEnd = dateForDaysInMonth < 3 ? (dateForDaysInMonth === 1 ? 31 : 30) : dateForDaysInMonth === 4 ? 29 : 28,
        //   // @ts-ignore
        //   defaultDate = new Date(currentDate.getTime()),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() === 0 ? 12 : todayDate === 1 ? defaultDate.getUTCMonth() + 1 : defaultDate.getUTCMonth(),
        //   // @ts-ignore
        //   dateStart = 1,
        //   // @ts-ignore
        //   yearStart = monthStart === 12 ? defaultDate.getUTCFullYear() - 1 : defaultDate.getUTCFullYear();
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getLastMonthPeriod(currentDate);
      case 'month_to_yesterday':
        // // @ts-ignore
        // let yearEnd = currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   dateEnd = currentDate.getUTCDate(),
        //   // @ts-ignore
        //   defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * (dateEnd - 1)),
        //   // @ts-ignore
        //   yearStart = defaultDate.getUTCFullYear(),
        //   // @ts-ignore
        //   dateStart = defaultDate.getUTCDate(),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() + 1;
        //
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getMonthToYesterdayPeriod(currentDate, OneDayInMilliseconds);
      default:
        // // @ts-ignore
        // let defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * 6),
        //   // @ts-ignore
        //   yearStart = defaultDate.getUTCFullYear(),
        //   // @ts-ignore
        //   dateStart = defaultDate.getUTCDate(),
        //   // @ts-ignore
        //   monthStart = defaultDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   yearEnd = currentDate.getUTCFullYear(),
        //   // @ts-ignore
        //   monthEnd = currentDate.getUTCMonth() + 1,
        //   // @ts-ignore
        //   dateEnd = currentDate.getUTCDate();
        // return {
        //   period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
        //   period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
        // };
        return this.getDefaultPeriod(currentDate, OneDayInMilliseconds);
    }
  }

  getYesterday(currentDate) {

    const yearEnd = currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() + 1,

      dateEnd = currentDate.getUTCDate(),

      defaultDate = new Date(currentDate.getTime()),

      yearStart = defaultDate.getUTCFullYear(),

      dateStart = defaultDate.getUTCDate(),

      monthStart = defaultDate.getUTCMonth() + 1;

    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

  getTodayPeriod(currentDate, OneDayInMilliseconds) {

    const yearEnd = currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() + 1,

      dateEnd = currentDate.getUTCDate() + 1,

      defaultDate = new Date(currentDate.getTime() + OneDayInMilliseconds),

      yearStart = defaultDate.getUTCFullYear(),

      dateStart = defaultDate.getUTCDate(),

      monthStart = defaultDate.getUTCMonth() + 1;

    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

  getLastThreeDaysPeriod(currentDate, OneDayInMilliseconds) {

    const yearEnd = currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() + 1,

      dateEnd = currentDate.getUTCDate(),

      defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * 2),

      yearStart = defaultDate.getUTCFullYear(),

      dateStart = defaultDate.getUTCDate(),

      monthStart = defaultDate.getUTCMonth() + 1;

    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

  getLastSixtyDaysPeriod(currentDate, OneDayInMilliseconds) {

    const yearEnd = currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() + 1,

      dateEnd = currentDate.getUTCDate(),

      defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * 59),

      yearStart = defaultDate.getUTCFullYear(),

      dateStart = defaultDate.getUTCDate(),

      monthStart = defaultDate.getUTCMonth() + 1;

    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

  getLastMonthPeriod(currentDate) {
    const todayDate = new Date().getDate();

    const yearEnd = currentDate.getUTCMonth() === 0 ? currentDate.getUTCFullYear() - 1 : currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() === 0 ? 12 : todayDate === 1 ? currentDate.getUTCMonth() + 1 : currentDate.getUTCMonth(),
      dateForDaysInMonth = new Date(yearEnd, monthEnd - 1, 33).getUTCDate(),

      dateEnd = dateForDaysInMonth < 3 ? (dateForDaysInMonth === 1 ? 31 : 30) : dateForDaysInMonth === 4 ? 29 : 28,

      defaultDate = new Date(currentDate.getTime()),

      monthStart = defaultDate.getUTCMonth() === 0 ? 12 : todayDate === 1 ? defaultDate.getUTCMonth() + 1 : defaultDate.getUTCMonth(),

      dateStart = 1,

      yearStart = monthStart === 12 ? defaultDate.getUTCFullYear() - 1 : defaultDate.getUTCFullYear();
    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

  getMonthToYesterdayPeriod(currentDate, OneDayInMilliseconds) {

    const yearEnd = currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() + 1,

      dateEnd = currentDate.getUTCDate(),

      defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * (dateEnd - 1)),

      yearStart = defaultDate.getUTCFullYear(),

      dateStart = defaultDate.getUTCDate(),

      monthStart = defaultDate.getUTCMonth() + 1;

    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

  getDefaultPeriod(currentDate, OneDayInMilliseconds) {

    const defaultDate = new Date(currentDate.getTime() - OneDayInMilliseconds * 6),

      yearStart = defaultDate.getUTCFullYear(),

      dateStart = defaultDate.getUTCDate(),

      monthStart = defaultDate.getUTCMonth() + 1,

      yearEnd = currentDate.getUTCFullYear(),

      monthEnd = currentDate.getUTCMonth() + 1,

      dateEnd = currentDate.getUTCDate();
    return {
      period_start: `${ yearStart }-${ monthStart }-${ dateStart }`,
      period_end: `${ yearEnd }-${ monthEnd }-${ dateEnd }`
    };
  }

}
