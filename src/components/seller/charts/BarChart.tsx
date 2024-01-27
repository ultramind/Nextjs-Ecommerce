import { useGetBestSeller } from "@api/sales";
import useDisclosure from "@hooks/useDisclosure";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { BestSellerProps } from "types/charts";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
interface BarChartProps {
  title: string;
}

function BarChart({ title }: BarChartProps) {
  const [timeline, setTimeline] = useState("7");
  const {
    toggleModal,
    isOpen: optionsShown,
    closeModal,
    modalRef,
  } = useDisclosure();

  const { data: bestSeller } = useGetBestSeller();

  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (bestSeller?.length > 0) {
      const res = bestSeller.map((data: BestSellerProps) => ({
        name: data?.topProducts?.map((p) => p?.productName)?.join(", "),
        data: data?.topProducts?.map((p) => p?.averageSales),
      }));
      setData(res);

      //dates
      const res2 = bestSeller.map((data: BestSellerProps) =>
        moment(data?.date).format(timeline === "7" ? "ddd" : "ll"),
      );
      setDates(res2);
    }
  }, [bestSeller, timeline]);

  const option = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "solid",
      opacity: 1,
      colors: ["#F0860E", "#2644AE", "#272A3E"],
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    stroke: {
      colors: ["transparent"],
      width: 3,
    },
    dataLabels: {
      textAnchor: "middle",
      offsetY: -30,
      style: {
        colors: ["#FFFFFF"],
        fontSize: "11px",
        fontWeight: 400,
      },
    },
    legend: {
      labels: {
        colors: ["#000000"],
      },
      offsetY: -10,
      markers: {
        width: 11,
        height: 6,
        radius: 0,
        fillColors: ["#F0860E", "#2644AE", "#272A3E"],
      },
    },
    xaxis: {
      categories: dates,
      offsetY: -10,
      labels: {
        style: {
          colors: ["#979797", "#979797", "#979797", "#979797", "#979797"],
        },
      },
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
      labels: {
        show: false,
      },
      title: {
        text: "Unit Sold",
        offsetX: 15,
        style: {
          color: "#979797",
          fontWeight: 500,
          fontFamily: "Helvetica, Arial, Sans-Serif",
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "100%",
        dataLabels: {
          orientation: "vertical",
          position: "top",
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          dataLabels: {
            offsetY: -20,
            offsetX: 1.5,
            style: {
              fontSize: "6px",
              fontWeight: 500,
            },
          },
          yaxis: {
            axisBorder: {
              show: true,
            },
            labels: {
              show: false,
            },
            title: {
              text: "Unit Sold",
              offsetX: 15,
              style: {
                color: "#979797",
                fontSize: "9px",
                fontWeight: 500,
                fontFamily: "Helvetica, Arial, Sans-Serif",
              },
            },
          },
          xaxis: {
            offsetY: -10,
            labels: {
              style: {
                fontSize: "9px",
                colors: ["#979797", "#979797", "#979797", "#979797", "#979797"],
              },
            },
          },
        },
      },
    ],
    tooltip: {
      enabled: false,
    },
  };

  return (
    <>
      <div className=" flex justify-between items-center">
        <h3 className="font-bold text-sm md:text-lg">{title}</h3>{" "}
        {bestSeller?.length > 0 && (
          <div className="relative" ref={modalRef} onClick={toggleModal}>
            <button className=" flex items-center font-product_sans text-tangerine text-sm border rounded-lg py-2 px-3">
              Last {timeline} days
              <IoIosArrowDown className="ml-1" />
            </button>
            {optionsShown && (
              <div className="absolute min-w-[100px] border rounded-lg bg-white z-30">
                <button
                  onClick={() => {
                    setTimeline("7");
                    closeModal();
                  }}
                  className="text-sm font-product_sans p-2 w-full hover:bg-gray-50/80"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    setTimeline("30");
                    closeModal();
                  }}
                  className="text-sm font-product_sans w-full hover:bg-gray-50/80 p-2"
                >
                  Last 30 days
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {bestSeller?.length === 0 && (
        <p className="text-granite_gray text-sm mt-4 font-product_sans">
          Not enough data yet, check back tomorrow.
        </p>
      )}
      {bestSeller?.length > 0 && (
        <div className="font-product_sans">
          <ApexCharts
            type="bar"
            series={data}
            options={option as ApexOptions}
          />
        </div>
      )}
    </>
  );
}

export default BarChart;
