export const TOKEN_KEY = "kms-auth-token";
export const GROUPS = ["Kisgyerek", "Gyerek", "Felnőtt"];
export const PAYMENT_TYPES = ["monthly", "semester", "annual"];

export const PAYMENT_LABELS = {
  monthly: "Havi tagdíj",
  semester: "Féléves tagsági díj",
  annual: "Éves egyesületi díj",
};

export const BELTS = [
  ...Array.from({ length: 12 }, (_, index) => `${12 - index}. kyu`),
  ...Array.from({ length: 10 }, (_, index) => `${index + 1}. dan`),
];

export const emptyStudent = {
  fullName: "",
  birthDate: "",
  beltRank: "12. kyu",
  group: "Kisgyerek",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
};
