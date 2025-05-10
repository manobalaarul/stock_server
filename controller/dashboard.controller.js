import OrderModel from "../models/order.model.js";
import moment from "moment-timezone";
import UserModel from "../models/user.model.js";
import InStockModel from "../models/instock.model.js";
import OutStockModel from "../models/outstock.model.js";
import ProductModel from "../models/product.model.js";
export const DashboardDataController = async (requset, response) => {
  try {
    const timezone = "Asia/Kolkata";
    const startOfDay = moment().tz(timezone).startOf("day").utc().toDate();
    const endOfDay = moment().tz(timezone).endOf("day").utc().toDate();
    const startOfYear = moment().tz(timezone).startOf("year").utc().toDate();
    const endOfYear = moment().tz(timezone).endOf("year").utc().toDate();

    const totalStockOutQuantity = await OutStockModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalStockInQuantity = await InStockModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalSavedOrders = await OrderModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      order_status: "saved",
    });

    const totalConfirmedOrders = await OrderModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      order_status: "confirmed",
    });

    const outOfStockCount = await ProductModel.countDocuments({ stock: 0 });

    const lowStockCount = await ProductModel.countDocuments({
      stock: { $lt: 20, $gt: 0 },
    });

    const totalUsers = await UserModel.countDocuments();

    const totalSalesQty =
      totalStockOutQuantity.length > 0
        ? totalStockOutQuantity[0].totalQuantity
        : 0;

    const totalSalesToday = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }, // Orders created today
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmt" }, // Summing totalAmt field
        },
      },
    ]);

    const totalSales =
      totalSalesToday.length > 0 ? totalSalesToday[0].totalSales : 0;

    const monthlySalesData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear }, // Orders from this year
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month (1 = Jan, 2 = Feb, etc.)
          totalSales: { $sum: "$totalAmt" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Mapping MongoDB month index (1-12) to chart categories
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const salesData = new Array(12).fill(0); // Default 0 for all months

    monthlySalesData.forEach((item) => {
      salesData[item._id - 1] = item.totalSales; // Mapping MongoDB month (1-12) to index (0-11)
    });

    return response.json({
      message: "Dashboard Datas",
      data: {
        totalSalesQty,
        totalSavedOrders,
        totalConfirmedOrders,
        outOfStockCount,
        lowStockCount,
        totalUsers,
        totalSales,
        salesData,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
