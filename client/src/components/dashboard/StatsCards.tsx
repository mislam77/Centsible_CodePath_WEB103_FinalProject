import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate } from "@/lib/helpers";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
}

function StatsCards({ from, to }: Props) {
  const [stats, setStats] = useState<{ income: number; expense: number }>({
    income: 0,
    expense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/stats/balance?from=${DateToUTCDate(
            from
          )}&to=${DateToUTCDate(to)}`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setStats({ income: data.income || 0, expense: data.expense || 0 });
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [from, to]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Default currency
    minimumFractionDigits: 2,
  });

  const income = stats.income;
  const expense = stats.expense;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  value: number;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}