// MahaFlow — Fuzzy Logic Rule Definitions
// Configuration-driven rules — NOT procedural logic
// Each rule declares conditions and an output category

export type FuzzyLevel = "LOW" | "MEDIUM" | "HIGH";
export type CongestionCategory = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface FuzzyRule {
  id: string;
  conditions: {
    crowdDensity?: FuzzyLevel;
    vehicleDensity?: FuzzyLevel;
    parkingOccupancy?: FuzzyLevel;
    eventIntensity?: FuzzyLevel;
    weatherImpact?: FuzzyLevel;
  };
  output: CongestionCategory;
  score: number; // base score 0-100
  description: string;
  recommendation: string;
  recommendationHi: string;
  recommendationMr: string;
}

export const fuzzyRules: FuzzyRule[] = [
  // CRITICAL rules
  {
    id: "R01",
    conditions: { crowdDensity: "HIGH", parkingOccupancy: "HIGH" },
    output: "CRITICAL",
    score: 92,
    description: "Extreme crowd with saturated parking creates critical gridlock",
    recommendation: "Redirect incoming vehicles to Parking Zone P3. Activate overflow lots.",
    recommendationHi: "आने वाले वाहनों को पार्किंग ज़ोन P3 की ओर मोड़ें। ओवरफ्लो पार्किंग सक्रिय करें।",
    recommendationMr: "येणाऱ्या वाहनांना पार्किंग झोन P3 कडे वळवा. ओव्हरफ्लो पार्किंग सक्रिय करा.",
  },
  {
    id: "R02",
    conditions: { crowdDensity: "HIGH", vehicleDensity: "HIGH", eventIntensity: "HIGH" },
    output: "CRITICAL",
    score: 95,
    description: "Peak event with maximum crowd and vehicle load",
    recommendation: "Activate emergency corridors. Halt private vehicle entry. Deploy additional shuttles.",
    recommendationHi: "आपातकालीन गलियारे सक्रिय करें। निजी वाहन प्रवेश बंद करें। अतिरिक्त शटल तैनात करें।",
    recommendationMr: "आपत्कालीन मार्ग सक्रिय करा. खाजगी वाहन प्रवेश थांबवा. अतिरिक्त शटल तैनात करा.",
  },
  {
    id: "R03",
    conditions: { crowdDensity: "HIGH", weatherImpact: "HIGH" },
    output: "CRITICAL",
    score: 88,
    description: "High crowd during severe weather creates dangerous conditions",
    recommendation: "Open covered shelters. Suspend non-essential shuttle routes. Activate weather alert protocol.",
    recommendationHi: "ढके हुए आश्रय खोलें। गैर-आवश्यक शटल मार्ग बंद करें। मौसम अलर्ट प्रोटोकॉल सक्रिय करें।",
    recommendationMr: "छताखालील निवारा उघडा. अनावश्यक शटल मार्ग बंद करा. हवामान सूचना प्रोटोकॉल सक्रिय करा.",
  },

  // HIGH rules
  {
    id: "R04",
    conditions: { crowdDensity: "HIGH", vehicleDensity: "HIGH" },
    output: "HIGH",
    score: 78,
    description: "High crowd combined with heavy vehicle traffic",
    recommendation: "Restrict private vehicle entry on Route R05. Increase shuttle frequency.",
    recommendationHi: "मार्ग R05 पर निजी वाहन प्रवेश सीमित करें। शटल आवृत्ति बढ़ाएं।",
    recommendationMr: "मार्ग R05 वर खाजगी वाहन प्रवेश मर्यादित करा. शटल वारंवारता वाढवा.",
  },
  {
    id: "R05",
    conditions: { eventIntensity: "HIGH", crowdDensity: "MEDIUM" },
    output: "HIGH",
    score: 74,
    description: "Major event drawing moderate crowd — expect surge",
    recommendation: "Pre-position shuttles at interchange. Open Diversion Route B.",
    recommendationHi: "इंटरचेंज पर शटल पहले से तैनात करें। डायवर्शन मार्ग B खोलें।",
    recommendationMr: "इंटरचेंजवर शटल आधीच तैनात करा. वळण मार्ग B उघडा.",
  },
  {
    id: "R06",
    conditions: { parkingOccupancy: "HIGH", vehicleDensity: "HIGH" },
    output: "HIGH",
    score: 76,
    description: "Parking lots near capacity with heavy incoming traffic",
    recommendation: "Redirect vehicles to P3 and P4. Display parking full alerts at entry points.",
    recommendationHi: "वाहनों को P3 और P4 की ओर मोड़ें। प्रवेश बिंदुओं पर पार्किंग फुल अलर्ट दिखाएं।",
    recommendationMr: "वाहने P3 आणि P4 कडे वळवा. प्रवेश बिंदूंवर पार्किंग पूर्ण सूचना दाखवा.",
  },
  {
    id: "R07",
    conditions: { crowdDensity: "HIGH", eventIntensity: "MEDIUM" },
    output: "HIGH",
    score: 70,
    description: "High crowd with moderate event activity",
    recommendation: "Increase pedestrian flow controls. Deploy crowd management personnel.",
    recommendationHi: "पैदल यात्री प्रवाह नियंत्रण बढ़ाएं। भीड़ प्रबंधन कर्मचारी तैनात करें।",
    recommendationMr: "पादचारी प्रवाह नियंत्रण वाढवा. गर्दी व्यवस्थापन कर्मचारी तैनात करा.",
  },

  // MEDIUM rules
  {
    id: "R08",
    conditions: { crowdDensity: "MEDIUM", vehicleDensity: "MEDIUM" },
    output: "MEDIUM",
    score: 50,
    description: "Moderate crowd and vehicle activity — normal busy period",
    recommendation: "Maintain current shuttle frequency. Monitor for trend changes.",
    recommendationHi: "वर्तमान शटल आवृत्ति बनाए रखें। रुझान परिवर्तन की निगरानी करें।",
    recommendationMr: "सध्याची शटल वारंवारता कायम ठेवा. ट्रेंड बदलांवर लक्ष ठेवा.",
  },
  {
    id: "R09",
    conditions: { crowdDensity: "MEDIUM", parkingOccupancy: "HIGH" },
    output: "MEDIUM",
    score: 55,
    description: "Moderate crowd but parking getting full",
    recommendation: "Start directing new arrivals to P3. Update digital signage.",
    recommendationHi: "नई आगमन को P3 की ओर निर्देशित करना शुरू करें। डिजिटल साइनेज अपडेट करें।",
    recommendationMr: "नवीन आगमनांना P3 कडे निर्देशित करणे सुरू करा. डिजिटल साइनेज अपडेट करा.",
  },
  {
    id: "R10",
    conditions: { eventIntensity: "MEDIUM", vehicleDensity: "MEDIUM" },
    output: "MEDIUM",
    score: 48,
    description: "Moderate event with normal vehicle flow",
    recommendation: "Prepare standby shuttle capacity. No immediate action required.",
    recommendationHi: "स्टैंडबाय शटल क्षमता तैयार रखें। तत्काल कार्रवाई आवश्यक नहीं।",
    recommendationMr: "स्टँडबाय शटल क्षमता तयार ठेवा. तात्काळ कार्यवाही आवश्यक नाही.",
  },
  {
    id: "R11",
    conditions: { crowdDensity: "MEDIUM", weatherImpact: "MEDIUM" },
    output: "MEDIUM",
    score: 52,
    description: "Moderate crowd with mild weather disruption",
    recommendation: "Monitor weather updates. Keep shelters on standby.",
    recommendationHi: "मौसम अपडेट की निगरानी करें। आश्रय स्टैंडबाय पर रखें।",
    recommendationMr: "हवामान अपडेट्सवर लक्ष ठेवा. निवारा स्टँडबायवर ठेवा.",
  },
  {
    id: "R12",
    conditions: { vehicleDensity: "HIGH", weatherImpact: "MEDIUM" },
    output: "MEDIUM",
    score: 58,
    description: "Heavy traffic with weather complication",
    recommendation: "Reduce vehicle speed limits. Enhance traffic signal timing.",
    recommendationHi: "वाहन गति सीमा कम करें। ट्रैफिक सिग्नल समय में सुधार करें।",
    recommendationMr: "वाहन वेग मर्यादा कमी करा. ट्रॅफिक सिग्नल वेळ सुधारा.",
  },

  // LOW rules
  {
    id: "R13",
    conditions: { crowdDensity: "LOW", vehicleDensity: "LOW" },
    output: "LOW",
    score: 15,
    description: "Low activity across all indicators",
    recommendation: "All systems nominal. Standard operations.",
    recommendationHi: "सभी प्रणालियाँ सामान्य। मानक संचालन।",
    recommendationMr: "सर्व प्रणाली सामान्य. मानक कार्यवाही.",
  },
  {
    id: "R14",
    conditions: { crowdDensity: "LOW", parkingOccupancy: "LOW" },
    output: "LOW",
    score: 12,
    description: "Minimal crowd with ample parking",
    recommendation: "Reduce shuttle frequency to conserve resources.",
    recommendationHi: "संसाधन बचाने के लिए शटल आवृत्ति कम करें।",
    recommendationMr: "संसाधने वाचवण्यासाठी शटल वारंवारता कमी करा.",
  },
  {
    id: "R15",
    conditions: { crowdDensity: "LOW", eventIntensity: "LOW" },
    output: "LOW",
    score: 10,
    description: "Off-peak period with no events",
    recommendation: "Ideal window for maintenance and route clearing.",
    recommendationHi: "रखरखाव और मार्ग सफाई के लिए आदर्श समय।",
    recommendationMr: "देखभाल आणि मार्ग साफसफाईसाठी आदर्श वेळ.",
  },
  {
    id: "R16",
    conditions: { crowdDensity: "MEDIUM", vehicleDensity: "LOW" },
    output: "LOW",
    score: 25,
    description: "Moderate pedestrian activity with low vehicle presence",
    recommendation: "Good conditions for pedestrian-priority operations.",
    recommendationHi: "पैदल यात्री-प्राथमिकता संचालन के लिए अच्छी स्थिति।",
    recommendationMr: "पादचारी-प्राधान्य कार्यवाहीसाठी चांगली स्थिती.",
  },
];
