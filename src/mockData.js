export const MOCK_COLORS = {
  indigo: "#1A1A40",
  azure: "#0056B3",
  forest: "#008C45",
  crimson: "#DC3545",
  amber: "#FFBF00",
  emerald: "#28A745",
  coral: "#FF6F61"
};

export const MOCK_INSIGHTS = {
  creditScore: 785,
  maxCreditScore: 850,
  marketIndex: {
    currentPrice: '₹2,450/qtl',
    fairPrice: '₹2,680/qtl',
    qualityGrade: 'A+'
  },
  pestAlerts: [
    { id: 1, type: 'Fungus', risk: 'High', district: 'Howrah', coordinates: { x: 45, y: 30 } }
  ],
  rejectedProduce: [
    { id: 'rej1', type: 'Potato (Small)', quantity: '500kg', unitPrice: '₹8/kg', buyer: 'McCain Foods' }
  ]
};

export const TOOLTIPS = {
  fairplay: {
    en: "Prevents price cheating by showing the fair market value based on your verified quality grade.",
    hi: "आपकी सत्यापित गुणवत्ता ग्रेड के आधार पर उचित बाजार मूल्य दिखाकर कीमत में धोखाधड़ी को रोकता है।",
    bn: "আপনার যাচাইকৃত মানের গ্রেডের ভিত্তিতে ন্যায্য বাজার মূল্য দেখিয়ে দামের কারচুপি রোধ করে।"
  },
  credit: {
    en: "Your Agri-Credit score grows with every scan. Use it to unlock low-interest loans from partnered banks.",
    hi: "हर स्कैन के साथ आपका कृषि-क्रेडिट स्कोर बढ़ता है। पार्टनर बैंकों से कम ब्याज वाले ऋण अनलॉक करने के लिए इसका उपयोग करें।",
    bn: "প্রতিটি স্ক্যানের সাথে আপনার কৃষি-ক্রেডিট স্কোর বৃদ্ধি পায়। অংশীদার ব্যাঙ্কগুলি থেকে কম সুদে ঋণ পেতে এটি ব্যবহার করুন।"
  },
  pest: {
    en: "Real-time alerts of pest outbreaks detected by nearby farmers to help you protect your crop early.",
    hi: "अपनी फसल की समय रहते सुरक्षा करने में मदद के लिए आस-पास के किसानों द्वारा पाए गए कीटों के रीयल-टाइम अलर्ट।",
    bn: "আপনার ফসল আগেভাগে রক্ষা করতে নিকটবর্তী কৃষকদের দ্বারা শনাক্ত করা কীটপতঙ্গের রীয়ল-টাইম অ্যালার্ট।"
  },
  recovery: {
    en: "Don't throw away 'ugly' produce. Sell it directly to animal feed or processing units at fair prices.",
    hi: "'खराब' दिखने वाली उपज को न फेंकें। इसे सीधे पशु आहार या प्रसंस्करण इकाइयों को उचित मूल्य पर बेचें।",
    bn: "'খারাপ' দেখতে ফসল ফেলে দেবেন না। এটি সরাসরি পশুখাদ্য বা প্রক্রিয়াকরণ ইউনিটগুলিতে ন্যায্য মূল্যে বিক্রি করুন।"
  }
};
