import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";

export default function Graph({ categories, data }) {
  const chartConfig = {
    type: "line",
    height: 340,
    series: [
      {
        name: "Sales",
        data: data ? data : [50, 40, 300, 320, 500, 350, 200, 230, 800],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        zoom: false
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: categories
          ? categories
          : [
              "Baisakh",
              "Jestha",
              "Ashar",
              "Shrawan",
              "Bhadra",
              "Ashwin",
              "Kartik",
              "Mangsir",
              "Poush",
            ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div className="w-full">
      {/* Ensures Card takes full width */}
      <Card className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <CardBody className="px-2 pb-0 min-w-[500px]">
          <Chart {...chartConfig} />
        </CardBody>
      </Card>
    </div>
  );
}
