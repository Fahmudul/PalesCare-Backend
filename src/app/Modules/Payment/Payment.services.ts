import axios from "axios";
import { prisma } from "../../Shared/Prisma";
import { SSLService } from "../SSL/ssl.service";
import Config from "../../Config";
import { PaymentStatus } from "@prisma/client";
const initPaymentInDB = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    phoneNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await SSLService.initPayment(initPaymentData);
  console.log(result);
  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePaymentInDb = async (payload: any) => {
  // if (!payload || !payload.status) {
  //   return {
  //     message: "Payment failed",
  //   };
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response.status !== "VALID") {
  //   return {
  //     message: "Payment failed",
  //   };
  // }
  const response = payload;
  await prisma.$transaction(async (transactionClient) => {
    const updatedPayment = await transactionClient.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGateWayData: response,
      },
    });

    await transactionClient.appointment.updateMany({
      where: {
        id: updatedPayment.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    message: "Payment success",
  };
};

export const PaymentServices = { initPaymentInDB, validatePaymentInDb };
