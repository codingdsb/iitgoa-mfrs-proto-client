import { useEffect, useState } from "react";
import * as constants from "@/constants.json";
import * as mealData from "@/lib/mealData";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { checkTokenExpiredError } from "@/lib/functions";
import { useNavigate } from "react-router-dom";

const FullMenuPage = () => {
  const { toast } = useToast();
  const [breakFasts, setBreakFasts] = useState(null);
  const [lunches, setLunches] = useState(null);
  const [dinners, setDinners] = useState(null);
  const [snacks, setSnacks] = useState(null);
  const navigate = useNavigate();

  /// API Calls
  const getFullMenu = async () => {
    try {
      const response = await axios.get(`${constants.API_URL}/mess/menu/full`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const breakfasts = response.data.data.filter(
        (meal) => meal.meal_slot == 1
      );
      breakfasts.sort((a, b) => a.meal_day - b.meal_day);
      const lunches = response.data.data.filter((meal) => meal.meal_slot == 2);
      lunches.sort((a, b) => a.meal_day - b.meal_day);
      const dinners = response.data.data.filter((meal) => meal.meal_slot == 4);
      dinners.sort((a, b) => a.meal_day - b.meal_day);
      const snacks = response.data.data.filter((meal) => meal.meal_slot == 3);
      snacks.sort((a, b) => a.meal_day - b.meal_day);
      setBreakFasts(breakfasts);
      setLunches(lunches);
      setDinners(dinners);
      setSnacks(snacks);
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
    getFullMenu();
  }, []);

  return (
    <>
      <div className="announcement_page menu_page">
        <div>
        <Table>
          <TableHeader>
            <TableHead>MEAL</TableHead>
            <TableHead>MONDAY</TableHead>
            <TableHead>TUESDAY</TableHead>
            <TableHead>WEDNESDAY</TableHead>
            <TableHead>THURSDAY</TableHead>
            <TableHead>FRIDAY</TableHead>
            <TableHead>SATURDAY</TableHead>
            <TableHead>SUNDAY</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Breakfast</TableCell>

              {breakFasts &&
                breakFasts.map((dayMenu) => (
                  <TableCell key={dayMenu.meal_day}>
                    {dayMenu.menu.map((item) => (
                      <TableRow key={item.meal_item}>
                        <TableCell>
                          {item.meal_item} ({item.menu_id})
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableCell>
                ))}
            </TableRow>
            <Separator />
            <TableRow>
              <TableCell>Lunch</TableCell>

              {lunches &&
                lunches.map((dayMenu) => (
                  <TableCell key={dayMenu.meal_day}>
                    {dayMenu.menu.map((item) => (
                      <TableRow key={item.meal_item}>
                        <TableCell>
                          {item.meal_item} ({item.menu_id})
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableCell>
                ))}
            </TableRow>
            <Separator />
            <TableRow>
              <TableCell>Snacks</TableCell>
              {snacks &&
                snacks.map((dayMenu) => (
                  <TableCell key={dayMenu.meal_day}>
                    {dayMenu.menu.map((item) => (
                      <TableRow key={item.meal_item}>
                        <TableCell>
                          {item.meal_item} ({item.menu_id})
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableCell>
                ))}
            </TableRow>
            <Separator />
            <TableRow>
              <TableCell>Dinner</TableCell>
              {dinners &&
                dinners.map((dayMenu) => (
                  <TableCell key={dayMenu.meal_day}>
                    {dayMenu.menu.map((item) => (
                      <TableRow key={item.meal_item}>
                        <TableCell>
                          {item.meal_item} ({item.menu_id})
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      </div>
    </>
  );
};

export default FullMenuPage;
