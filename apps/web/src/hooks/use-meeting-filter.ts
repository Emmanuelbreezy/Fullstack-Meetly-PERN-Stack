import { useQueryState } from "nuqs";

enum PeriodEnum {
  UPCOMING = "UPCOMING",
  PAST = "PAST",
}

const useMeetingFilter = () => {
  const [period, setPeriod] = useQueryState("period", {
    defaultValue: PeriodEnum.UPCOMING,
    parse: (value) =>
      Object.values(PeriodEnum).includes(value as PeriodEnum)
        ? (value as PeriodEnum)
        : PeriodEnum.UPCOMING,
    serialize: (value) => value,
  });
  return { period, setPeriod, PeriodEnum };
};

export default useMeetingFilter;
