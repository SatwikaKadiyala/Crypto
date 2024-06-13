import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import "chart.js/auto";

import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";


const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(true);

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const fetchHistoricData = async () => {
    try {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setHistoricData(data.prices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching historic data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricData();
  }, [coin.id, days, currency]);

  const handleDaysChange = (value) => {
    setDays(value);
    setLoading(true); 
  };

  const classes = useStyles();

  return (
    <ThemeProvider theme={createTheme({ palette: { type: "dark" } })}>
      <div className={classes.container}>
        {loading ? (
          <CircularProgress style={{ color: "16F3FF" }} size={250} thickness={1} />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  const date = new Date(coin[0]);
                  const time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#16F3FF",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div style={{ display: "flex", marginTop: 20, justifyContent: "space-around", width: "100%" }}>
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => handleDaysChange(day.value)}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
