import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

interface Props {
  from: Date;
  to: Date;
}

function CategoriesStats({ from, to }: Props) {
  const [categoriesData, setCategoriesData] = useState<
    { category: string; income: number; expense: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!from || !to) {
      console.error("Invalid date range provided to CategoriesStats");
      return;
    }
  
    const fetchCategoriesData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://web103-finalproject-centsible.onrender.com/api/stats/categories?from=${from.toISOString()}&to=${to.toISOString()}`,
          { credentials: "include" }
        );
  
        if (response.ok) {
          const data = await response.json();
          setCategoriesData(data);
        } else {
          console.error("Failed to fetch categories stats");
        }
      } catch (error) {
        console.error("Error fetching categories stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCategoriesData();
  }, [from, to]);  

  const dataAvailable = categoriesData.length > 0;

  return (
    <div className="container">
      <h2 className="mt-12 text-3xl font-bold">Categories Stats</h2>
      <SkeletonWrapper isLoading={isLoading}>
        {dataAvailable ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10b981" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              No data available for the selected period.
            </p>
          </div>
        )}
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;
