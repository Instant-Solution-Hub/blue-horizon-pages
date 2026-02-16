import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


import type { Visit } from "../components/track-visits/VisitList";

export function adaptBackendVisits(data: any[], isMissed: boolean): Visit[] {
  return data.map((v) => {
    const base = {
      id: String(v.visitId),
      dateTime: new Date(v.actualVisitTime),
      notes: v.notes ?? "",
      activitiesPerformed: v.activitiesPerformed ?? [],
      isMissed: isMissed,
    };

    switch (v.visitType) {
      case "DOCTOR":
        return {
          ...base,
          visitType: "doctor",
          doctorName: v.doctor.name,
          designation: v.doctor.designation,
          category: v.doctor.category,
          practiceType: v.doctor.practiceType,
          hospital: v.doctor.hospitalName,
          location:
            v.doctor.latitude && v.doctor.longitude
              ? {
                  lat: Number(v.doctor.latitude),
                  lng: Number(v.doctor.longitude),
                }
              : null,
        };

      case "PHARMACIST":
        return {
          ...base,
          visitType: "pharmacist",
          pharmacyName: v.pharmacy.pharmacyName,
          contactPerson: v.pharmacy.contactPerson,
          contactNumber: v.pharmacy.contactNumber,
        };

      case "STOCKIST":
        return {
          ...base,
          visitType: "stockist",
          stockistName: v.stockist.name,
          stockistType: v.stockist.type,
          contactPerson: v.stockist.contactPerson,
          contactNumber: v.stockist.contactNumber,
          orderValue: v.orderValue ?? undefined,
          location: null, // backend doesn't send lat/lng for stockist yet
        };

      default:
        throw new Error("Unknown visit type");
    }
  });
}


export function adaptBackendVisitsForMissed(data: any[]) {
 return data.map((v) => {
    const base = {
      id: String(v.visitId),
      dateTime: new Date(v.actualVisitTime),
      notes: v.notes ?? "",
      activitiesPerformed: v.activitiesPerformed ?? [],
      isMissed: true,
    };

    switch (v.visitType) {
      case "DOCTOR":
        return {
          ...base,
          visitType: "doctor",
          doctorName: v.doctor.name,
          designation: v.doctor.designation,
          category: v.doctor.category,
          practiceType: v.doctor.practiceType,
          hospital: v.doctor.hospitalName,
          location:
            v.doctor.latitude && v.doctor.longitude
              ? {
                  lat: Number(v.doctor.latitude),
                  lng: Number(v.doctor.longitude),
                }
              : null,
        };

      case "PHARMACIST":
        return {
          ...base,
          visitType: "pharmacist",
          pharmacyName: v.pharmacy.pharmacyName,
          contactPerson: v.pharmacy.contactPerson,
          contactNumber: v.pharmacy.contactNumber,
        };

      case "STOCKIST":
        return {
          ...base,
          visitType: "stockist",
          stockistName: v.stockist.name,
          stockistType: v.stockist.type,
          contactPerson: v.stockist.contactPerson,
          contactNumber: v.stockist.contactNumber,
          orderValue: v.orderValue ?? undefined,
          location: null, // backend doesn't send lat/lng for stockist yet
        };

      default:
        throw new Error("Unknown visit type");
    }
  });
}

