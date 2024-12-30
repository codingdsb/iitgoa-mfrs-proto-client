import { useEffect, useState } from "react";
import axios from "axios";
import * as constants from "@/constants.json";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiredError } from "@/lib/functions";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import {}

const WastageStatistics = () => {
  const [wastageData, setWastageData] = useState([]);

  const [formDate, setFormDate] = useState(new Date());
  const [formSlot, setFormSlot] = useState(1);
  const [formWastage, setFormWastage] = useState(0);

  const { toast } = useToast();
  const navigate = useNavigate();
  /// API Calls

  // get wastage data
  const getWastageData = async () => {
    const yesterday = new Date();
    const oneWeekAgo = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/wastages/1`,
        {
          start_date: oneWeekAgo,
          end_date: yesterday,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const wastes = response.data.data.results;
      wastes.sort((a, b) => new Date(a.meal_date) - new Date(b.meal_date));

      let dates = Last7Days();

      let finalArr = dates.map((date) => ({
        meal_date: date,
        breakfast: 0,
        lunch: 0,
        snacks: 0,
        dinner: 0,
      }));

      let d1;
      for (let j = 0; j < wastes.length; j++) {
        d1 = new Date(wastes[j].meal_date);
        for (let k = 0; k < 7; k++) {
          if (finalArr[k].meal_date === formatDate(d1)) {
            if (wastes[j].meal_slot === 1) {
              finalArr[k].breakfast = wastes[j].wastage;
            } else if (wastes[j].meal_slot === 2) {
              finalArr[k].lunch = wastes[j].wastage;
            } else if (wastes[j].meal_slot === 3) {
              finalArr[k].snacks = wastes[j].wastage;
            } else if (wastes[j].meal_slot === 4) {
              finalArr[k].dinner = wastes[j].wastage;
            }
          }
        }
      }

      setWastageData(finalArr);
    } catch (error) {
      if (checkTokenExpiredError(error.response.data.message)) {
        navigate("/auth");
        localStorage.removeItem("token");
        toast({
          description: error.response.data.message + " Please login again.",
        });
      } else {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      }
    }
  };

  const chartConfig = {
    breakfast: {
      label: "Breakfast",
      color: "hsl(var(--chart-1))",
    },
    lunch: {
      label: "Lunch",
      color: "hsl(var(--chart-2))",
    },
    snacks: {
      label: "Snacks",
      color: "hsl(var(--chart-3))",
    },
    dinner: {
      label: "Dinner",
      color: "hsl(var(--chart-4))",
    },
  };

  // add wastage!
  const addWastage = async () => {
    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/wastage/add`,
        {
          wastage: parseInt(formWastage),
          meal_date: formDate.slice(0, 10),
          meal_slot: formSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      getWastageData();

      toast({
        title: "Success",
        description: response.data.message,
      });

      setFormDate(null);
      setFormSlot(1);
      setFormWastage(0);
    } catch (error) {
      if (checkTokenExpiredError(error.response.data.message)) {
        navigate("/auth");
        localStorage.removeItem("token");
        toast({
          description: error.response.data.message + " Please login again.",
        });
      } else {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    getWastageData();
  }, []);
  return (
    <div className="h-full w-[85vw] flex flex-col align-center justify-start ">
        <div className="flex  ml-10 w-[400px] space-y-8  h-fit mt-12 ">
          <span className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Wastage Analytics of Last Week
          </span>
        </div>
      <div className="flex  w-[90%] justify-between ">
        <div className="flex flex-col ml-10 my-24 space-y-4 w-[400px] border p-4 border-gray-300 rounded-lg">
          <span className="text-lg font-semibold">Add/Update Wastage</span>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
          />

          <Select onValueChange={setFormSlot}>
            <SelectTrigger>
              <SelectValue placeholder="Select Slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={1}>Breakfast</SelectItem>
              <SelectItem value={2}>Lunch</SelectItem>
              <SelectItem value={3}>Snacks</SelectItem>
              <SelectItem value={4}>Dinner</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            value={formWastage}
            onChange={(e) => setFormWastage(e.target.value)}
            placeholder="Enter wastage in kg"
          />

          <Button onClick={addWastage}>Submit</Button>
        </div>
        <ChartContainer className="w-[500px] border border-gray-300 p-3 shadow rounded-lg h-[400px]" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={wastageData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="meal_date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="breakfast"
              type="natural"
              fill="red"
              fillOpacity={0.1}
              stroke="red"
              stackId="a"
            />
            <Area
              dataKey="lunch"
              type="natural"
              fill="green"
              fillOpacity={0.1}
              stroke="green"
              stackId="b"
            />
            <Area
              dataKey="snacks"
              type="natural"
              fill="blue"
              fillOpacity={0.1}
              stroke="blue"
              stackId="c"
            />
            <Area
              dataKey="dinner"
              type="natural"
              fill="yellow"
              fillOpacity={0.1}
              stroke="yellow"
              stackId="d"
            />
          </AreaChart>
        </ChartContainer>
      </div>
      {/* <div className="flex flex-col ml-10 space-y-4 w-[400px]">
          <span className="text-lg font-semibold">Table :</span>
         
      </div> */}
    </div>
  );
};

export default WastageStatistics;

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  date = dd + "/" + mm + "/" + yyyy;
  return date;
}

function Last7Days() {
  var result = [];
  for (var i = 1; i <= 7; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    result.push(formatDate(d));
  }

  return result;
}
