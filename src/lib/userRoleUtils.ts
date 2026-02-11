// src/utils/userRole.ts
export type UserType = "MANAGER" | "FIELD_EXECUTIVE" | "ADMIN";

export const getUserType = (): UserType => {
  const role = sessionStorage.getItem("userRole");

  switch (role) {
    case "Manager":
      return "MANAGER";
    case "Admin":
      return "ADMIN";
    case "FieldExecutive":
    case "FIELD_EXECUTIVE":
      return "FIELD_EXECUTIVE";
    default:
      return "FIELD_EXECUTIVE"; // safe fallback
  }
};
