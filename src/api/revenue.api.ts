import appApi, { axiosGetRequest } from "@/config/axios";
import { IFilterType, IRevenueGraph } from "@/types/revenueType";

export const exportAdminRevenue = async (
  exportType: "pdf" | "excel",
  filterType: IFilterType,
  startDate: string,
  endDate: string
) => {
  try {
    const res = await appApi.get(
      `/admin/revenue/export?filterType=${filterType}&startDate=${startDate}&endDate=${endDate}&exportType=${exportType}`,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([res.data], {
      type:
        exportType === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `revenue-report.${exportType === "pdf" ? ".pdf" : "xlsx"}`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to download PDF:", err);
  }
};

export const getAdminRevenueGraphData =
  async (): Promise<IRevenueGraph | null> => {
    const res = await axiosGetRequest("admin/revenue/graph");
    return res?.data;
  };

export const getTrainerRevenueGraphData =
  async (): Promise<IRevenueGraph | null> => {
    const res = await axiosGetRequest("trainer/revenue/graph");
    return res?.data;
  };

export const exportTrainerRevenue = async (
  exportType: "pdf" | "excel",
  filterType: IFilterType,
  startDate: string,
  endDate: string
) => {
  try {
    const res = await appApi.get(
      `/trainer/revenue/export?filterType=${filterType}&startDate=${startDate}&endDate=${endDate}&exportType=${exportType}`,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([res.data], {
      type:
        exportType === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `revenue-report.${exportType === "pdf" ? ".pdf" : "xlsx"}`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to download PDF:", err);
  }
};
