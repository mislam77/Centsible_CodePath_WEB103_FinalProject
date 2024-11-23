import React, { useState, useEffect } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import CategoriesStats from "@/components/dashboard/CategoriesStats";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { toast } from "sonner";

function Overview() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch stats data based on the selected date range
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/overview?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch overview data");
          toast.error("Error fetching overview data");
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
        toast.error("Error fetching overview data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;

              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="container flex w-full flex-col gap-2">
        <StatsCards from={dateRange.from} to={dateRange.to} />
        <CategoriesStats from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}

export default Overview;