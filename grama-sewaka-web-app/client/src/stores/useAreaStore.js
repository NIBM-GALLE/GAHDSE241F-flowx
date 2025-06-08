import { useState, useEffect, useRef } from "react";

export function useAreaStore(form) {
  const [districts, setDistricts] = useState([]);
  const [divisionalSecretariats, setDivisionalSecretariats] = useState([]);
  const [gramaNiladhariDivisions, setGramaNiladhariDivisions] = useState([]);

  const selectedDistrict = form.watch("district_id");
  const selectedDivisionalSecretariat = form.watch("divisional_secretariat_id");

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/area/districts");
        const data = await response.json();
        setDistricts(data.data || []);
      } catch (error) {
        setDistricts([]);
        console.error("Failed to fetch districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch divisional secretariats when district changes
  useEffect(() => {
    const fetchDivisionalSecretariats = async () => {
      if (!selectedDistrict) return;
      try {
        const response = await fetch(`/api/area/divisional-secretariats?district_id=${selectedDistrict}`);
        const data = await response.json();
        setDivisionalSecretariats(data.data || []);
        form.setValue("divisional_secretariat_id", "");
        form.setValue("grama_niladhari_division_id", "");
      } catch (error) {
        setDivisionalSecretariats([]);
        console.error("Failed to fetch divisional secretariats:", error);
      }
    };
    fetchDivisionalSecretariats();
  }, [selectedDistrict, form]);

  // Fetch grama niladhari divisions when divisional secretariat changes
  useEffect(() => {
    const fetchGramaNiladhariDivisions = async () => {
      if (!selectedDivisionalSecretariat) return;
      try {
        const response = await fetch(`/api/area/grama-niladhari-divisions?divisional_secretariat_id=${selectedDivisionalSecretariat}`);
        const data = await response.json();
        setGramaNiladhariDivisions(data.data || []);
        form.setValue("grama_niladhari_division_id", "");
      } catch (error) {
        setGramaNiladhariDivisions([]);
        console.error("Failed to fetch grama niladhari divisions:", error);
      }
    };
    fetchGramaNiladhariDivisions();
  }, [selectedDivisionalSecretariat, form]);

  return { districts, divisionalSecretariats, gramaNiladhariDivisions };
}

// Area name caching and fetch utilities
export function useAreaNameStore() {
  const districtCache = useRef({});
  const dsCache = useRef({});
  const gndCache = useRef({});

  const fetchAreaName = async (type, id, cache) => {
    if (!id) return "";
    if (cache.current[id]) return cache.current[id];
    try {
      const res = await fetch(`/api/area/name?type=${type}&id=${id}`);
      const data = await res.json();
      if (data.success) {
        cache.current[id] = data.name;
        return data.name;
      }
    } catch {
      // ignore
    }
    return "";
  };

  const getDistrictNameById = (id) => fetchAreaName("district", id, districtCache);
  const getDSNameById = (id) => fetchAreaName("divisional_secretariat", id, dsCache);
  const getGNDNameById = (id) => fetchAreaName("grama_niladhari_division", id, gndCache);

  return { getDistrictNameById, getDSNameById, getGNDNameById };
}
