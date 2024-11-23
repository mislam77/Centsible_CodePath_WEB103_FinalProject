import React, { useEffect, useState } from "react";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) {
  const [historyPeriods, setHistoryPeriods] = useState<number[]>([]); // Array of years only
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available years from the backend
  useEffect(() => {
    const fetchHistoryPeriods = async () => {
      try {
        const response = await fetch("https://web103-finalproject-centsible.onrender.com/api/history-periods", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setHistoryPeriods(data); // Assuming the backend returns an array of years
        } else {
          console.error("Failed to fetch history periods");
        }
      } catch (error) {
        console.error("Error fetching history periods:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryPeriods();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: number[];
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value, 10),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={(period.month - 1).toString()} // Adjust for 1-based index
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value, 10) + 1, // Convert back to 1-based index for state
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[...Array(12).keys()].map((month) => {
          const monthStr = new Date(0, month, 1).toLocaleString("default", {
            month: "long",
          });

          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}