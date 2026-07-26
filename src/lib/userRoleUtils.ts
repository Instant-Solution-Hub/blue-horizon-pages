// src/utils/userRole.ts
export type UserType = "MANAGER" | "FIELD_EXECUTIVE" | "ADMIN";

export const getUserType = (): UserType => {
  const role = sessionStorage.getItem("userRole");

  switch (role) {
    case "Manager":
      return "MANAGER";
    case "Admin":
      return "ADMIN";
    case "FE":
      return "FIELD_EXECUTIVE";
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
  return role === "Admin" && userId === "2";
};
