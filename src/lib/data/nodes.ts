// MahaFlow — Transportation Network Nodes
// Stylized Mahakumbh-inspired network with ~15 nodes

export type NodeType =
  | "sacred"
  | "transit"
  | "parking"
  | "camp"
  | "medical"
  | "emergency"
  | "interchange";

export interface NetworkNode {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  type: NodeType;
  x: number; // SVG coordinate (0-1000)
  y: number; // SVG coordinate (0-700)
  capacity: number;
  currentLoad: number;
  icon: string; // emoji for quick visual ID
}

export const initialNodes: NetworkNode[] = [
  // Sacred / Core
  {
    id: "sangam",
    name: "Sangam",
    nameHi: "संगम",
    nameMr: "संगम",
    type: "sacred",
    x: 500,
    y: 100,
    capacity: 50000,
    currentLoad: 32000,
    icon: "🙏",
  },

  // Transit Hubs
  {
    id: "prayagraj-jn",
    name: "Prayagraj Junction",
    nameHi: "प्रयागराज जंक्शन",
    nameMr: "प्रयागराज जंक्शन",
    type: "transit",
    x: 150,
    y: 600,
    capacity: 30000,
    currentLoad: 18000,
    icon: "🚂",
  },
  {
    id: "bus-terminal",
    name: "Bus Terminal",
    nameHi: "बस टर्मिनल",
    nameMr: "बस टर्मिनल",
    type: "transit",
    x: 850,
    y: 580,
    capacity: 20000,
    currentLoad: 12000,
    icon: "🚌",
  },
  {
    id: "shuttle-interchange",
    name: "Shuttle Interchange",
    nameHi: "शटल इंटरचेंज",
    nameMr: "शटल इंटरचेंज",
    type: "interchange",
    x: 500,
    y: 400,
    capacity: 15000,
    currentLoad: 9000,
    icon: "🔄",
  },

  // Parking Zones
  {
    id: "parking-p1",
    name: "Parking Zone P1",
    nameHi: "पार्किंग ज़ोन P1",
    nameMr: "पार्किंग झोन P1",
    type: "parking",
    x: 100,
    y: 350,
    capacity: 5000,
    currentLoad: 3200,
    icon: "🅿️",
  },
  {
    id: "parking-p2",
    name: "Parking Zone P2",
    nameHi: "पार्किंग ज़ोन P2",
    nameMr: "पार्किंग झोन P2",
    type: "parking",
    x: 900,
    y: 350,
    capacity: 4500,
    currentLoad: 4100,
    icon: "🅿️",
  },
  {
    id: "parking-p3",
    name: "Parking Zone P3",
    nameHi: "पार्किंग ज़ोन P3",
    nameMr: "पार्किंग झोन P3",
    type: "parking",
    x: 200,
    y: 150,
    capacity: 3500,
    currentLoad: 1800,
    icon: "🅿️",
  },
  {
    id: "parking-p4",
    name: "Parking Zone P4",
    nameHi: "पार्किंग ज़ोन P4",
    nameMr: "पार्किंग झोन P4",
    type: "parking",
    x: 800,
    y: 150,
    capacity: 4000,
    currentLoad: 2600,
    icon: "🅿️",
  },

  // Camp Sectors
  {
    id: "camp-s1",
    name: "Camp Sector S1",
    nameHi: "शिविर क्षेत्र S1",
    nameMr: "शिबिर क्षेत्र S1",
    type: "camp",
    x: 320,
    y: 250,
    capacity: 25000,
    currentLoad: 18000,
    icon: "⛺",
  },
  {
    id: "camp-s2",
    name: "Camp Sector S2",
    nameHi: "शिविर क्षेत्र S2",
    nameMr: "शिबिर क्षेत्र S2",
    type: "camp",
    x: 680,
    y: 250,
    capacity: 22000,
    currentLoad: 15000,
    icon: "⛺",
  },
  {
    id: "camp-s3",
    name: "Camp Sector S3",
    nameHi: "शिविर क्षेत्र S3",
    nameMr: "शिबिर क्षेत्र S3",
    type: "camp",
    x: 350,
    y: 520,
    capacity: 20000,
    currentLoad: 14000,
    icon: "⛺",
  },
  {
    id: "camp-s4",
    name: "Camp Sector S4",
    nameHi: "शिविर क्षेत्र S4",
    nameMr: "शिबिर क्षेत्र S4",
    type: "camp",
    x: 650,
    y: 520,
    capacity: 18000,
    currentLoad: 10000,
    icon: "⛺",
  },

  // Medical & Emergency
  {
    id: "medical-center",
    name: "Medical Center",
    nameHi: "चिकित्सा केंद्र",
    nameMr: "वैद्यकीय केंद्र",
    type: "medical",
    x: 500,
    y: 580,
    capacity: 5000,
    currentLoad: 1200,
    icon: "🏥",
  },
  {
    id: "emergency-center",
    name: "Emergency Response",
    nameHi: "आपातकालीन केंद्र",
    nameMr: "आपत्कालीन केंद्र",
    type: "emergency",
    x: 500,
    y: 680,
    capacity: 3000,
    currentLoad: 800,
    icon: "🚨",
  },
];
