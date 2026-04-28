const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, 'src', 'locales');

const en = {
  dashboard: 'Dashboard', community: 'Social', news: 'News', profile: 'Profile', support: 'Support',
  scan_new_crop: 'Scan New Crop', recent_scans: 'Recent Scans', saved_certs: 'Saved Certificates',
  market_prices: 'Live Mandi Prices', total_verified: 'Total Verified', avg_quality: 'Avg Quality Score',
  total_earned: 'Total Earned', good_morning: 'Good Morning', good_afternoon: 'Good Afternoon', good_night: 'Good Night',
  news_hub: 'AgriNews Hub', listen: 'Listen', search_news: 'Search news...',
  cat_all: 'All', cat_subsidies: 'Subsidies', cat_market: 'Market Prices', cat_tech: 'Tech Innovations', cat_global: 'Global',
  breaking_news_alert: 'Breaking News Alert', no_breaking_news: 'There is no breaking news at the moment.',
  breaking: 'Breaking', read_more: 'Read More',
  feed: 'Feed', messages: 'Messages', search_users: 'Search farmers...', post: 'Post',
  followers: 'Followers', following: 'Following', private_account: 'Private Account',
  this_account_is_private: 'This account is private. Follow to see their posts.', follow: 'Follow', unfollow: 'Unfollow',
  camera_top: 'Top View', camera_side: 'Side View', camera_bottom: 'Bottom View',
  camera_top_desc: 'Hold camera directly above', camera_side_desc: 'Tilt 45° for side profile', camera_bottom_desc: 'Flip and capture base',
  processing: 'Generating Authentic Hash...', securing: 'Securing batch data on the ledger',
  download_pdf: 'Download Compliance PDF', share: 'Share', restart: 'Restart',
  verify_batch: 'Verify Authenticity Batch', enter_hash: 'Enter 12-Digit Smart-Hash...', verify: 'Verify', wait: 'Wait..',
  profile_settings: 'Profile Settings', app_language: 'App Language', ai_voice: 'AI Voice Assistant',
  account: 'Account', edit_profile: 'Edit Profile Info', data_privacy: 'Data & Privacy Settings', secure_logout: 'Secure Logout',
  private_profile: 'Private Profile', certified_partner: 'Certified Learvon Partner',
  login_phone: 'Continue with Phone', login_google: 'Continue with Google', complete_profile: 'Complete Profile',
  start_using: 'Start Using AgriVerify', verification_complete: 'Verification complete. Your code is',
  save_changes: 'Save Changes', cancel: 'Cancel'
};

const hi = {
  ...en,
  dashboard: 'डैशबोर्ड', community: 'सामाजिक', news: 'समाचार', profile: 'प्रोफ़ाइल',
  scan_new_crop: 'नई फसल स्कैन करें', recent_scans: 'हाल के स्कैन',
  total_verified: 'कुल सत्यापित', avg_quality: 'औसत गुणवत्ता', total_earned: 'कुल कमाई',
  good_morning: 'सुप्रभात', good_afternoon: 'शुभ दोपहर', good_night: 'शुभ रात्रि',
  news_hub: 'कृषि समाचार', listen: 'सुनें', search_news: 'समाचार खोजें...',
  cat_all: 'सभी', cat_subsidies: 'सब्सिडी', cat_market: 'मंडी भाव', cat_tech: 'तकनीक', cat_global: 'वैश्विक',
  breaking: 'ब्रेकिंग', read_more: 'और पढ़ें',
  feed: 'फ़ीड', messages: 'संदेश', search_users: 'किसानों को खोजें...', post: 'पोस्ट करें',
  followers: 'फॉलोअर्स', following: 'फॉलोइंग', private_account: 'निजी खाता',
  follow: 'फॉलो करें', unfollow: 'अनफॉलो करें',
  camera_top: 'ऊपर का दृश्य', camera_side: 'साइड का दृश्य', camera_bottom: 'नीचे का दृश्य',
  download_pdf: 'पीडीएफ डाउनलोड करें', share: 'साझा करें', restart: 'पुनः आरंभ करें',
  verify_batch: 'बैच सत्यापित करें', enter_hash: '12-अंकीय हैश दर्ज करें...', verify: 'सत्यापित करें', wait: 'प्रतीक्षा करें..',
  profile_settings: 'प्रोफ़ाइल सेटिंग्स', app_language: 'ऐप की भाषा', ai_voice: 'एआई वॉयस',
  account: 'खाता', edit_profile: 'प्रोफ़ाइल संपादित करें', data_privacy: 'गोपनीयता सेटिंग्स', secure_logout: 'सुरक्षित लॉगआउट',
  save_changes: 'परिवर्तन सहेजें', cancel: 'रद्द करें'
};

const bn = {
  ...en,
  dashboard: 'ড্যাশবোর্ড', community: 'সামাজিক', news: 'খবর', profile: 'প্রোফাইল',
  recent_scans: 'সাম্প্রতিক স্ক্যান', total_verified: 'মোট যাচাইকৃত', avg_quality: 'গড় মান', total_earned: 'মোট আয়',
  good_morning: 'সুপ্রভাত', good_afternoon: 'শুভ বিকেল', good_night: 'শুভ রাত্রি',
  news_hub: 'কৃষি সংবাদ', listen: 'শুনুন', search_news: 'খবর খুঁজুন...',
  cat_all: 'সব', cat_subsidies: 'ভর্তুকি', cat_market: 'বাজার দর', cat_tech: 'প্রযুক্তি', cat_global: 'বিশ্বব্যাপী',
  feed: 'ফিড', messages: 'বার্তা', search_users: 'কৃষক খুঁজুন...', post: 'পোস্ট',
  followers: 'অনুসারী', following: 'অনুসরণ', private_account: 'ব্যক্তিগত অ্যাকাউন্ট',
  follow: 'অনুসরণ করুন', unfollow: 'অনুসরণ বাতিল',
  download_pdf: 'পিডিএফ ডাউনলোড', share: 'শেয়ার', restart: 'পুনরায় শুরু',
  verify_batch: 'ব্যাচ যাচাই করুন', enter_hash: 'হ্যাশ লিখুন...', verify: 'যাচাই',
  profile_settings: 'প্রোফাইল সেটিংস', app_language: 'অ্যাপের ভাষা', account: 'অ্যাকাউন্ট',
  edit_profile: 'প্রোফাইল সম্পাদনা', secure_logout: 'লগআউট', save_changes: 'সংরক্ষণ', cancel: 'বাতিল'
};

const mr = {
  ...en,
  dashboard: 'डॅशबोर्ड', community: 'सामाजिक', news: 'बातम्या', profile: 'प्रोफाइल',
  recent_scans: 'अलीकडील स्कॅन', total_verified: 'एकूण सत्यापित', avg_quality: 'सरासरी गुणवत्ता', total_earned: 'एकूण कमाई',
  good_morning: 'शुभ सकाळ', good_afternoon: 'शुभ दुपार', good_night: 'शुभ रात्री',
  news_hub: 'कृषी बातम्या', listen: 'ऐका', search_news: 'बातम्या शोधा...',
  cat_all: 'सर्व', cat_subsidies: 'अनुदान', cat_market: 'बाजारभाव', cat_tech: 'तंत्रज्ञान', cat_global: 'जागतिक',
  feed: 'फीड', messages: 'संदेश', search_users: 'शेतकरी शोधा...', post: 'पोस्ट',
  followers: 'फॉलोअर्स', following: 'फॉलोइंग', private_account: 'खाजगी खाते',
  follow: 'फॉलो करा', unfollow: 'अनफॉलो करा',
  download_pdf: 'पीडीएफ डाउनलोड', share: 'शेअर करा', restart: 'पुन्हा सुरू',
  verify_batch: 'बॅच सत्यापित करा', enter_hash: 'हॅश प्रविष्ट करा...', verify: 'सत्यापित करा',
  profile_settings: 'प्रोफाइल सेटिंग्ज', app_language: 'अॅप भाषा', account: 'खाते',
  edit_profile: 'प्रोफाइल संपादित करा', secure_logout: 'लॉगआउट', save_changes: 'जतन करा', cancel: 'रद्द करा'
};

const te = {
  ...en,
  dashboard: 'డాష్‌బోర్డ్', community: 'సామాజిక', news: 'వార్తలు', profile: 'ప్రొఫైల్',
  recent_scans: 'ఇటీవలి స్కాన్లు', total_verified: 'ధృవీకరించబడినవి', avg_quality: 'సగటు నాణ్యత', total_earned: 'మొత్తం సంపాదన',
  good_morning: 'శుభోదయం', good_afternoon: 'శుభ మధ్యాహ్నం', good_night: 'శుభ రాత్రి',
  news_hub: 'వ్యవసాయ వార్తలు', listen: 'వినండి', search_news: 'వార్తలను శోధించండి...',
  cat_all: 'అన్ని', cat_subsidies: 'సబ్సిడీలు', cat_market: 'మార్కెట్ ధరలు', cat_tech: 'సాంకేతికత', cat_global: 'గ్లోబల్',
  feed: 'ఫీడ్', messages: 'సందేశాలు', search_users: 'రైతులను శోధించండి...', post: 'పోస్ట్',
  followers: 'అనుచరులు', following: 'అనుసరిస్తున్నారు', private_account: 'ప్రైవేట్ ఖాతా',
  follow: 'అనుసరించండి', unfollow: 'అనుసరించవద్దు',
  download_pdf: 'PDF డౌన్‌లోడ్', share: 'భాగస్వామ్యం', restart: 'పునఃప్రారంభించు',
  verify_batch: 'బ్యాచ్‌ను ధృవీకరించండి', enter_hash: 'హ్యాష్‌ని నమోదు చేయండి...', verify: 'ధృవీకరించండి',
  profile_settings: 'ప్రొఫైల్ సెట్టింగ్‌లు', app_language: 'యాప్ భాష', account: 'ఖాతా',
  edit_profile: 'ప్రొఫైల్‌ సవరించండి', secure_logout: 'లాగ్అవుట్', save_changes: 'సేవ్ చేయండి', cancel: 'రద్దు చేయండి'
};

const pa = {
  ...en,
  dashboard: 'ਡੈਸ਼ਬੋਰਡ', community: 'ਸਮਾਜਿਕ', news: 'ਖ਼ਬਰਾਂ', profile: 'ਪ੍ਰੋਫਾਈਲ',
  recent_scans: 'ਤਾਜ਼ਾ ਸਕੈਨ', total_verified: 'ਕੁੱਲ ਪ੍ਰਮਾਣਿਤ', avg_quality: 'ਔਸਤ ਗੁਣਵੱਤਾ', total_earned: 'ਕੁੱਲ ਕਮਾਈ',
  good_morning: 'ਗੁੱਡ ਮੋਰਨਿੰਗ', good_afternoon: 'ਗੁੱਡ ਆਫਟਰਨੂਨ', good_night: 'ਗੁੱਡ ਨਾਈਟ',
  news_hub: 'ਖੇਤੀਬਾੜੀ ਖ਼ਬਰਾਂ', listen: 'ਸੁਣੋ', search_news: 'ਖ਼ਬਰਾਂ ਦੀ ਖੋਜ...',
  cat_all: 'ਸਾਰੇ', cat_subsidies: 'ਸਬਸਿਡੀਆਂ', cat_market: 'ਮਾਰਕੀਟ ਕੀਮਤਾਂ', cat_tech: 'ਤਕਨੀਕ', cat_global: 'ਗਲੋਬਲ',
  feed: 'ਫੀਡ', messages: 'ਸੁਨੇਹੇ', search_users: 'ਕਿਸਾਨਾਂ ਦੀ ਖੋਜ...', post: 'ਪੋਸਟ',
  followers: 'ਫਾਲੋਅਰਜ਼', following: 'ਫਾਲੋਇੰਗ', private_account: 'ਪ੍ਰਾਈਵੇਟ ਖਾਤਾ',
  follow: 'ਫਾਲੋ ਕਰੋ', unfollow: 'ਅਨਫਾਲੋ ਕਰੋ',
  download_pdf: 'ਪੀਡੀਐਫ ਡਾਊਨਲੋਡ', share: 'ਸਾਂਝਾ ਕਰੋ', restart: 'ਮੁੜ ਚਾਲੂ ਕਰੋ',
  verify_batch: 'ਬੈਚ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', enter_hash: 'ਹੈਸ਼ ਦਾਖਲ ਕਰੋ...', verify: 'ਪੁਸ਼ਟੀ ਕਰੋ',
  profile_settings: 'ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ', app_language: 'ਐਪ ਭਾਸ਼ਾ', account: 'ਖਾਤਾ',
  edit_profile: 'ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ', secure_logout: 'ਲਾਗਆਉਟ', save_changes: 'ਸੇਵ ਕਰੋ', cancel: 'ਰੱਦ ਕਰੋ'
};

const langs = { en, hi, bn, mr, te, pa };

Object.keys(langs).forEach(lang => {
  const dir = path.join(localesDir, lang);
  fs.writeFileSync(path.join(dir, 'translation.json'), JSON.stringify(langs[lang], null, 2));
});
