import InStockModel from "../models/instock.model.js";
import OrderModel from "../models/order.model.js";
import OutStockModel from "../models/outstock.model.js";
import ProductModel from "../models/product.model.js";

export async function SaveOrderController(request, response) {
  try {
    const {
      invoiceNo,
      productList,
      customer_name,
      customer_phone,
      total_qty,
      sub_total,
      gst,
      total,
    } = request.body;

    if (
      !invoiceNo ||
      !productList ||
      productList.length === 0 ||
      !customer_name ||
      !customer_phone ||
      !total_qty ||
      !sub_total ||
      !gst ||
      !total
    ) {
      return response.status(400).json({
        message: "Enter all required details",
        error: true,
        success: false,
      });
    }

    const newOrder = new OrderModel({
      invoiceNo,
      productList,
      customer_name,
      customer_phone,
      total_qty,
      sub_total,
      gst,
      total,
    });

    const saveOrder = await newOrder.save();

    return response.status(201).json({
      message: "Order saved successfully",
      data: saveOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UpdateSavedOrderController(request, response) {
  try {
    const { id } = request.params; // Order ID from URL
    const {
      invoiceNo,
      productList,
      customer_name,
      customer_phone,
      total_qty,
      sub_total,
      gst,
      total,
    } = request.body;

    // Fetch order first
    const existingOrder = await OrderModel.findById(id);

    if (!existingOrder) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // Only allow update if status is still 'saved'
    if (existingOrder.status !== "saved") {
      return response.status(400).json({
        message: `Only 'saved' orders can be updated. Current status: ${existingOrder.status}`,
        error: true,
        success: false,
      });
    }

    // Validate new data
    if (
      !invoiceNo ||
      !productList ||
      productList.length === 0 ||
      !customer_name ||
      !customer_phone ||
      !total_qty ||
      !sub_total ||
      !gst ||
      !total
    ) {
      return response.status(400).json({
        message: "Enter all required details",
        error: true,
        success: false,
      });
    }

    // Update fields
    existingOrder.productList = productList;
    existingOrder.customer_name = customer_name;
    existingOrder.customer_phone = customer_phone;
    existingOrder.total_qty = total_qty;
    existingOrder.sub_total = sub_total;
    existingOrder.gst = gst;
    existingOrder.total = total;

    const updatedOrder = await existingOrder.save();

    return response.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function GetOrderController(request, response) {
  try {
    let { page, limit } = request.body;
    // Set default values if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      OrderModel.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productList.productId"),
      OrderModel.countDocuments(),
    ]);

    return response.json({
      message: "Order Details",
      data: orders,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page,
      limit,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function GetOrderDetailController(request, response) {
  try {
    const { _id } = request.body;
    const order = await OrderModel.findById({ _id }).populate(
      "productList.productId"
    );

    return response.json({
      message: "Order Details",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function ConfirmOrderController(req, res) {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    if (order.status !== "saved") {
      return res.status(400).json({
        message: "Only saved orders can be confirmed",
        error: true,
        success: false,
      });
    }

    // Reduce product stock and add to OutStock
    for (const item of order.productList) {
      const product = await ProductModel.findById(item.productId);
      if (!product) continue;

      // Reduce quantity (optional if you manage inventory)
      product.stock -= item.quantity;
      await product.save();

      // Add to OutStock
      await OutStockModel.create({
        productId: item.productId,
        orderId: order._id,
        quantity: item.quantity,
        date: new Date(),
      });
    }

    // Mark order as confirmed
    order.status = "confirmed";
    await order.save();

    return res.json({
      message: "Order confirmed and stock updated",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function CancelOrderController(req, res) {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    if (order.status !== "saved") {
      return res.status(400).json({
        message: "Only saved orders can be cancelled",
        error: true,
        success: false,
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.json({
      message: "Order cancelled successfully",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function ReturnOrderController(req, res) {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId).populate(
      "productList.productId"
    );
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    if (order.status !== "confirmed") {
      return res.status(400).json({
        message: "Only confirmed orders can be returned",
        error: true,
        success: false,
      });
    }

    for (const item of order.productList) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();

        await InStockModel.create({
          productId: item.productId,
          seller_name: order.customer_name,
          seller_phone: order.customer_phone,
          quantity: item.quantity,
          date: new Date(),
        });
      }
    }

    order.status = "returned";
    await order.save();

    return res.json({
      message: "Order returned successfully",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error returning order:", error);
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
