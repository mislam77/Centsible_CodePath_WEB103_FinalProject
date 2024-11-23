import { useEffect, useState } from "react";
import TransactionTable from "@/components/dashboard/TransactionTable";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { differenceInDays, startOfMonth } from "date-fns";
import { toast } from "sonner";

export function Transactions() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transactions based on date range
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        });

        const response = await fetch(
          `http://localhost:3000/api/transactions?${queryParams.toString()}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else if (response.status === 401) {
          toast.error("Unauthorized. Please log in.");
        } else {
          toast.error("Failed to fetch transactions.");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("An error occurred while fetching transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange]);

  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Transactions History</p>
          </div>
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
      <div className="container">
      <TransactionTable
        from={dateRange.from}
        to={dateRange.to}
      />
      </div>
    </>
  );
}