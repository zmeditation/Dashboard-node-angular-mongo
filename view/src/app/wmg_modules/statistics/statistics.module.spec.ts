import { StatisticsModule } from './statistics.module';

xdescribe('StatisticsModule', () => {
  let statisticsModule: StatisticsModule;

  beforeEach(() => {
    statisticsModule = new StatisticsModule();
  });

  it('should create an instance', () => {
    expect(statisticsModule).toBeTruthy();
  });
});
