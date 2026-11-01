// src/utils/userRole.ts
export type UserType = "MANAGER" | "FIELD_EXECUTIVE" | "ADMIN" | "ZSM";

const ZSM_ADMIN_ID = "2";

export const getUserType = (): UserType => {
  const role = sessionStorage.getItem("userRole");
  const userId = sessionStorage.getItem("userID");
  const isZsm = sessionStorage.getItem("isZsm") === "true"; // if you add the backend flag

  // ZSM is an Admin with id 2 (or a dedicated flag) — must be checked
  // BEFORE the generic "Admin" case.
  const zsm = isZsm || (role === "Admin" && userId === ZSM_ADMIN_ID);
  if (zsm) return "ZSM";

  switch (role) {
    case "Manager":
      return "MANAGER";
    case "Admin":
      return "ADMIN";
    case "FE":
    case "FieldExecutive":
    case "FIELD_EXECUTIVE":
      return "FIELD_EXECUTIVE";
    default:
      return "FIELD_EXECUTIVE"; // safe fallback
  }
};

export const isZonalManager = (): boolean => {
  const role = sessionStorage.getItem("userRole");
  const userId = sessionStorage.getItem("userID");
  console.log( role==="Admin");
  console.log(userId==="2");
  console.log("Zonal Manager", role === "Admin" && userId === "2");
  return role === "Admin" && userId === "2";
};
