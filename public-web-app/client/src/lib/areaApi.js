import axios from "axios";

export async function getDivisionalSecretariatName(id) {
  if (!id) return "";
  try {
    const res = await axios.get(`/api/area/divisional-secretariats/${id}/name`);
    return res.data?.name || id;
  } catch {
    return id;
  }
}
