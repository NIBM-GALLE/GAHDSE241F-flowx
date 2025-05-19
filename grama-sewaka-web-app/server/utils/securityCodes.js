const SECURITY_CODES = {
  admin: ["ADMIN12345", "ADMIN67890"],
  government_officer: ["GOVT12345", "GOVT67890"],
  grama_sevaka: ["GRAMA12345", "GRAMA67890"]
};

export const validateSecurityCode = (code, role) => {
  return SECURITY_CODES[role]?.includes(code);
};