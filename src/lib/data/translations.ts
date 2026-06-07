// MahaFlow — Multilingual Support
// Static dictionaries for English, Hindi, and Marathi

export type Language = "en" | "hi" | "mr";

export interface TranslationStrings {
  // App
  appName: string;
  appTagline: string;

  // Navigation
  navOverview: string;
  navMap: string;
  navAdvisor: string;
  navControl: string;

  // Dashboard stats
  totalPilgrims: string;
  activeRoutes: string;
  parkingUtilization: string;
  congestionIndex: string;
  criticalZones: string;
  systemStatus: string;
  operational: string;
  degraded: string;

  // Risk levels
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  riskCritical: string;

  // Transport modes
  modeWalking: string;
  modeShuffle: string;
  modeBus: string;
  modePrivate: string;
  modeEmergency: string;

  // Route Advisor
  selectOrigin: string;
  selectDestination: string;
  selectTransport: string;
  findRoute: string;
  recommendedRoute: string;
  alternativeRoute: string;
  estimatedTime: string;
  riskScore: string;
  noRouteFound: string;
  minutes: string;

  // Explainability
  congestionRisk: string;
  triggeredRules: string;
  reasoning: string;
  recommendation: string;

  // Control Room
  criticalRoutes: string;
  parkingStatus: string;
  zoneHealth: string;
  riskDistribution: string;
  operationalRecommendations: string;
  priority: string;

  // Map
  networkMap: string;
  mapLegend: string;
  clickForDetails: string;
  capacity: string;
  currentLoad: string;
  crowdDensity: string;
  vehicleDensity: string;

  // Common
  language: string;
  lastUpdated: string;
  liveSimulation: string;
  recentAlerts: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "MahaFlow",
    appTagline: "Adaptive Mobility Intelligence System",

    navOverview: "Overview",
    navMap: "Mobility Map",
    navAdvisor: "Route Advisor",
    navControl: "Control Room",

    totalPilgrims: "Total Pilgrims",
    activeRoutes: "Active Routes",
    parkingUtilization: "Parking Utilization",
    congestionIndex: "Congestion Index",
    criticalZones: "Critical Zones",
    systemStatus: "System Status",
    operational: "Operational",
    degraded: "Degraded",

    riskLow: "Low",
    riskMedium: "Medium",
    riskHigh: "High",
    riskCritical: "Critical",

    modeWalking: "Walking",
    modeShuffle: "Shuttle",
    modeBus: "Bus",
    modePrivate: "Private Vehicle",
    modeEmergency: "Emergency Vehicle",

    selectOrigin: "Select Origin",
    selectDestination: "Select Destination",
    selectTransport: "Select Transport Mode",
    findRoute: "Find Route",
    recommendedRoute: "Recommended Route",
    alternativeRoute: "Alternative Route",
    estimatedTime: "Estimated Travel Time",
    riskScore: "Risk Score",
    noRouteFound: "No route found for selected criteria",
    minutes: "min",

    congestionRisk: "Congestion Risk",
    triggeredRules: "Triggered Rules",
    reasoning: "Reasoning",
    recommendation: "Recommendation",

    criticalRoutes: "Critical Routes",
    parkingStatus: "Parking Status",
    zoneHealth: "Zone Health",
    riskDistribution: "Risk Distribution",
    operationalRecommendations: "Operational Recommendations",
    priority: "Priority",

    networkMap: "Mobility Network Map",
    mapLegend: "Legend",
    clickForDetails: "Click a node or route for details",
    capacity: "Capacity",
    currentLoad: "Current Load",
    crowdDensity: "Crowd Density",
    vehicleDensity: "Vehicle Density",

    language: "Language",
    lastUpdated: "Last Updated",
    liveSimulation: "Live Simulation",
    recentAlerts: "Recent Alerts",
  },

  hi: {
    appName: "MahaFlow",
    appTagline: "अनुकूली गतिशीलता बुद्धिमत्ता प्रणाली",

    navOverview: "अवलोकन",
    navMap: "गतिशीलता मानचित्र",
    navAdvisor: "मार्ग सलाहकार",
    navControl: "नियंत्रण कक्ष",

    totalPilgrims: "कुल तीर्थयात्री",
    activeRoutes: "सक्रिय मार्ग",
    parkingUtilization: "पार्किंग उपयोग",
    congestionIndex: "भीड़ सूचकांक",
    criticalZones: "गंभीर क्षेत्र",
    systemStatus: "सिस्टम स्थिति",
    operational: "चालू",
    degraded: "कमज़ोर",

    riskLow: "कम",
    riskMedium: "मध्यम",
    riskHigh: "उच्च",
    riskCritical: "गंभीर",

    modeWalking: "पैदल",
    modeShuffle: "शटल",
    modeBus: "बस",
    modePrivate: "निजी वाहन",
    modeEmergency: "आपातकालीन वाहन",

    selectOrigin: "उद्गम स्थान चुनें",
    selectDestination: "गंतव्य स्थान चुनें",
    selectTransport: "परिवहन मोड चुनें",
    findRoute: "मार्ग खोजें",
    recommendedRoute: "अनुशंसित मार्ग",
    alternativeRoute: "वैकल्पिक मार्ग",
    estimatedTime: "अनुमानित यात्रा समय",
    riskScore: "जोखिम स्कोर",
    noRouteFound: "चयनित मानदंडों के लिए कोई मार्ग नहीं मिला",
    minutes: "मिनट",

    congestionRisk: "भीड़ जोखिम",
    triggeredRules: "ट्रिगर किए गए नियम",
    reasoning: "तर्क",
    recommendation: "सिफारिश",

    criticalRoutes: "गंभीर मार्ग",
    parkingStatus: "पार्किंग स्थिति",
    zoneHealth: "क्षेत्र स्वास्थ्य",
    riskDistribution: "जोखिम वितरण",
    operationalRecommendations: "परिचालन सिफारिशें",
    priority: "प्राथमिकता",

    networkMap: "गतिशीलता नेटवर्क मानचित्र",
    mapLegend: "लेजेंड",
    clickForDetails: "विवरण के लिए नोड या मार्ग पर क्लिक करें",
    capacity: "क्षमता",
    currentLoad: "वर्तमान भार",
    crowdDensity: "भीड़ घनत्व",
    vehicleDensity: "वाहन घनत्व",

    language: "भाषा",
    lastUpdated: "अंतिम अपडेट",
    liveSimulation: "लाइव सिमुलेशन",
    recentAlerts: "हाल की सूचनाएं",
  },

  mr: {
    appName: "MahaFlow",
    appTagline: "अनुकूली गतिशीलता बुद्धिमत्ता प्रणाली",

    navOverview: "आढावा",
    navMap: "गतिशीलता नकाशा",
    navAdvisor: "मार्ग सल्लागार",
    navControl: "नियंत्रण कक्ष",

    totalPilgrims: "एकूण भाविक",
    activeRoutes: "सक्रिय मार्ग",
    parkingUtilization: "पार्किंग वापर",
    congestionIndex: "गर्दी निर्देशांक",
    criticalZones: "गंभीर क्षेत्रे",
    systemStatus: "प्रणाली स्थिती",
    operational: "चालू",
    degraded: "कमकुवत",

    riskLow: "कमी",
    riskMedium: "मध्यम",
    riskHigh: "उच्च",
    riskCritical: "गंभीर",

    modeWalking: "पायी",
    modeShuffle: "शटल",
    modeBus: "बस",
    modePrivate: "खाजगी वाहन",
    modeEmergency: "आपत्कालीन वाहन",

    selectOrigin: "मूळ स्थान निवडा",
    selectDestination: "गंतव्य स्थान निवडा",
    selectTransport: "वाहतूक प्रकार निवडा",
    findRoute: "मार्ग शोधा",
    recommendedRoute: "शिफारस केलेला मार्ग",
    alternativeRoute: "पर्यायी मार्ग",
    estimatedTime: "अंदाजे प्रवास वेळ",
    riskScore: "जोखीम गुण",
    noRouteFound: "निवडलेल्या निकषांसाठी कोणताही मार्ग सापडला नाही",
    minutes: "मिनिटे",

    congestionRisk: "गर्दी जोखीम",
    triggeredRules: "ट्रिगर झालेले नियम",
    reasoning: "तर्क",
    recommendation: "शिफारस",

    criticalRoutes: "गंभीर मार्ग",
    parkingStatus: "पार्किंग स्थिती",
    zoneHealth: "क्षेत्र आरोग्य",
    riskDistribution: "जोखीम वितरण",
    operationalRecommendations: "कार्यचालन शिफारसी",
    priority: "प्राधान्य",

    networkMap: "गतिशीलता नेटवर्क नकाशा",
    mapLegend: "लिजेंड",
    clickForDetails: "तपशीलांसाठी नोड किंवा मार्गावर क्लिक करा",
    capacity: "क्षमता",
    currentLoad: "सध्याचा भार",
    crowdDensity: "गर्दी घनता",
    vehicleDensity: "वाहन घनता",

    language: "भाषा",
    lastUpdated: "शेवटचे अपडेट",
    liveSimulation: "लाइव्ह सिम्युलेशन",
    recentAlerts: "अलीकडील सूचना",
  },
};
