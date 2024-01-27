import { useGetSales } from "@api/sales";
import useDisclosure from "@hooks/useDisclosure";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { SalesProp } from "types/charts";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const options = {
  chart: {
    height: 350,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "category",
    labels: {
      format: "ddd",
      style: {
        colors: [
          "#979797",
          "#979797",
          "#979797",
          "#979797",
          "#979797",
          "#979797",
          "#979797",
        ],
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "12px",
        colors: ["#979797", "#979797", "#979797", "#979797", "#979797"],
      },
    },
    tickAmount: 4,
    // max: 150,
    axisBorder: {
      show: true,
    },
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    colors: ["#F0860E"],
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      gradientToColors: undefined,
      stops: [0, 98, 100],
    },
  },
  stroke: {
    show: true,
    colors: ["#F0860E"],
    width: 1,
    dashArray: 0,
  },
  tooltip: {
    enabled: true,
  },
  markers: {
    size: 3,
    colors: ["#F0860E"],
  },
};

interface LineChartProps {
  title: string;
}
function LineChart({ title }: LineChartProps) {
  //   const data = [];
  //   const startDate = new Date("01-05-2023"); // Use the current date as the start date
  //   startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

  //   for (let i = 0; i < 7; i++) {
  //     const currentDate = new Date(startDate);
  //     currentDate.setDate(startDate.getDate() + i); // Increment the date by i

  //     for (let j = 0; j < 8; j++) {
  //       const currentDateTime = new Date(currentDate);
  //       currentDateTime.setHours(currentDate.getHours() + j * 3); // Increment the time by 3 hours

  //       const value = Math.floor(Math.random() * 100); // Generate a random value between 0 and 100

  //       data.push([currentDateTime.getTime(), value]);
  //     }
  //   }

  //   return data;
  // }, []);
  const [timeline, setTimeline] = useState("7");
  const {
    toggleModal,
    isOpen: optionsShown,
    closeModal,
    modalRef,
  } = useDisclosure();

  //get sales
  const { data: sales } = useGetSales();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (sales?.length > 0) {
      const res = sales.map((data: SalesProp) => ({
        x: moment(data?._id).format(timeline === "7" ? "ddd" : "ll"),
        y: data?.totalAmount?.reduce((total, amount) => total + amount, 0),
      }));

      setData(res);
    }
  }, [sales, timeline]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-sm md:text-lg">{title}</h3>
        {sales?.length > 0 && (
          <div className="relative" ref={modalRef} onClick={toggleModal}>
            <button className=" flex items-center font-product_sans text-tangerine text-sm border rounded-lg py-2 px-3">
              Last {timeline} days
              <IoIosArrowDown className="ml-1" />
            </button>
            {optionsShown && (
              <div className="z-20 absolute font-product_sans min-w-[100px] border rounded-lg bg-white">
                <button
                  onClick={() => {
                    setTimeline("7");
                    closeModal();
                  }}
                  className="text-sm p-2 w-full hover:bg-gray-50/80"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    setTimeline("30");
                    closeModal();
                  }}
                  className="text-sm w-full hover:bg-gray-50/80 p-2"
                >
                  Last 30 days
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {sales?.length === 0 && (
        <p className="text-granite_gray text-sm mt-4 font-product_sans">
          Not enough data yet, check back tomorrow.
        </p>
      )}

      {sales?.length > 0 && (
        <div>
          <ApexCharts
            type="area"
            series={[
              {
                name: "Sales",
                data,
              },
            ]}
            options={options as ApexOptions}
          />
        </div>
      )}
    </>
  );
}

export default LineChart;
