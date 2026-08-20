export const getTaluksForDistrict = (district: string): string[] => {
  const talukMap: Record<string, string[]> = {
    // Karnataka
    "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka"],
    "Mysuru": ["Mysuru", "Hunsur", "Krishnarajanagara", "Nanjangud", "Heggadadevanakote", "Piriyapatna", "Tirumakudalu Narasipura", "Saragur", "Saligrama"],
    "Mangaluru": ["Mangaluru", "Bantwal", "Puttur", "Belthangady", "Sullia", "Moodabidri", "Kadaba"],
    "Hubballi-Dharwad": ["Dharwad", "Hubballi Urban", "Hubballi Rural", "Kalghatgi", "Navalgund", "Kundgol", "Alnavar", "Annigeri"],
    "Belagavi": ["Belagavi", "Athani", "Bailhongal", "Chikkodi", "Gokak", "Hukkeri", "Khanapur", "Ramdurg", "Raybag", "Savadatti"],
    "Kalaburagi": ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chitapur", "Jewargi", "Sedam", "Kamalapur", "Kalagi"],
    "Ballari": ["Ballari", "Kurugodu", "Siruguppa", "Sandur", "Kampli"],
    "Tumakuru": ["Tumakuru", "Chikkanayakanahalli", "Gubbi", "Koratagere", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Turuvekere"],
    
    // Maharashtra
    "Mumbai": ["Mumbai City", "Andheri", "Borivali", "Kurla"],
    "Pune": ["Pune City", "Haveli", "Khed", "Shirur", "Baramati", "Indapur", "Daund", "Bhor", "Velhe", "Purandar"],
    "Nagpur": ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Narkhed", "Savner", "Ramtek", "Umred"],
    "Thane": ["Thane", "Kalyan", "Murbad", "Bhiwandi", "Shahapur", "Ulhasnagar", "Ambarnath"],
    "Nashik": ["Nashik", "Igatpuri", "Dindori", "Peth", "Trimbakeshwar", "Kalwan", "Deola", "Surgana", "Baglan", "Malegaon", "Nandgaon", "Chandwad", "Niphad", "Sinnar", "Yeola"],
    
    // Delhi
    "New Delhi": ["Connaught Place", "Parliament Street", "Chanakyapuri"],
    "South Delhi": ["Saket", "Hauz Khas", "Mehrauli"],
    "North Delhi": ["Kotwali", "Civil Lines", "Sadatpur"],
    
    // Tamil Nadu
    "Chennai": ["Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Mambalam", "Mylapore", "Perambur", "Purasawalkam", "Tondiarpet", "Velachery"],
    "Coimbatore": ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Sulur", "Valparai", "Kinathukadavu", "Anaimalai", "Annur", "Madukkarai"],
    "Madurai": ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Thiruparankundram", "Tirumangalam", "Peraiyur", "Usilampatti", "Vadipatti", "Melur"],
    
    // Kerala
    "Thiruvananthapuram": ["Neyyattinkara", "Kattakkada", "Nedumangad", "Thiruvananthapuram", "Chirayinkeezhu", "Varkala"],
    "Kochi": ["Kanayannur", "Kochi", "Aluva", "Paravur", "Kunnathunad", "Muvattupuzha", "Kothamangalam"],
    "Kozhikode": ["Kozhikode", "Thamarassery", "Koyilandy", "Vatakara"],
    
    // Gujarat
    "Ahmedabad": ["Ahmedabad City", "Daskroi", "Sanand", "Bavla", "Dholka", "Viramgam", "Mandal", "Rampur"],
    "Surat": ["Surat City", "Choryasi", "Olpad", "Kamrej", "Mangrol", "Mandvi", "Umarpada", "Bardoli", "Mahuva", "Palsana"],
    
    // Uttar Pradesh
    "Lucknow": ["Lucknow", "Malihabad", "Bakshi Ka Talab", "Mohanlalganj", "Sarojininagar"],
    "Kanpur": ["Kanpur Sadar", "Bilhaur", "Ghatampur", "Narwal"],
    "Varanasi": ["Varanasi", "Pindra", "Raja Talab"],
    
    // West Bengal
    "Kolkata": ["Kolkata"],
    "Howrah": ["Howrah Sadar", "Uluberia"],
    "Siliguri": ["Siliguri", "Matigara", "Naxalbari", "Phansidewa", "Kharibari"],
    
    // Telangana
    "Hyderabad": ["Amberpet", "Asifnagar", "Bahadurpura", "Bandra", "Charminar", "Golconda", "Himayatnagar", "Khairatabad", "Marredpally", "Musheerabad", "Nampally", "Saidabad", "Secunderabad", "Shaikpet", "Tirumalagiri"],
    
    // Rajasthan
    "Jaipur": ["Jaipur", "Amber", "Bassi", "Chaksu", "Chomu", "Jamwa Ramgarh", "Kotputli", "Phagi", "Sambhar", "Sanganer", "Shahpura", "Viratnagar"],
    
    // Bihar
    "Patna": ["Patna Sadar", "Patna City", "Barh", "Danapur", "Masaurhi", "Paliganj"],
  };

  // If we have real taluks, return them. 
  // If not, return a generic single entry representing the whole district rather than the fake directional ones.
  return talukMap[district] || [`${district} Taluk`, `${district} Rural`];
};
