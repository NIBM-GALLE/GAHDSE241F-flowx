import { useState, useEffect } from "react";

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
