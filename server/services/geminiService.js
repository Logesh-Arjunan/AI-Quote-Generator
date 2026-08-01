const { GoogleGenerativeAI } = require("@google/generative-ai");

// Check if Gemini API key is configured
const isApiKeyConfigured = 
  process.env.GEMINI_API_KEY && 
  process.env.GEMINI_API_KEY !== "your_gemini_api_key_here" && 
  process.env.GEMINI_API_KEY !== "your_actual_gemini_api_key";

let genAI = null;
if (isApiKeyConfigured) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn("\x1b[33m%s\x1b[0m", "WARNING: GEMINI_API_KEY is not set or has default value. Running in Demo/Mock Mode with fallback quotes.");
}

const fallbackQuotes = {
  English: {
    Motivation: {
      Short: "Believe you can and you're halfway there.",
      Medium: "The only limit to our realization of tomorrow is our doubts of today. Push forward with courage and conviction.",
      Long: "Success is not final, failure is not fatal: it is the courage to continue that counts. Every single day brings new opportunities to learn, grow, and redefine who you are. Keep striving for your dreams, and never let temporary setbacks define your ultimate journey."
    },
    Success: {
      Short: "Success is a journey, not a destination.",
      Medium: "Success is the sum of small efforts, repeated day in and day out. Stay consistent and trust the process.",
      Long: "The road to success is paved with hard work, persistence, and learning from your mistakes. It requires you to step out of your comfort zone, embrace challenges, and never lose sight of your vision. True success is achieving your goals while staying true to your core values."
    },
    Education: {
      Short: "Education is the key to unlock the golden door of freedom.",
      Medium: "The roots of education are bitter, but the fruit is sweet. Learning is a lifelong journey of self-discovery.",
      Long: "Education is not preparation for life; education is life itself. It empowers individuals, expands horizons, and provides the tools necessary to make a positive impact on the world. Never stop seeking knowledge, for learning is the greatest adventure."
    },
    Friendship: {
      Short: "A true friend is one soul in two bodies.",
      Medium: "Friendship is the only cement that will ever hold the world together. Value those who stand by you.",
      Long: "True friendship is a rare and beautiful bond that transcends time and distance. It is built on mutual respect, trust, and shared laughter. Having friends who support your growth and keep you grounded is one of life's greatest treasures."
    },
    Leadership: {
      Short: "A leader is one who knows the way, goes the way, and shows the way.",
      Medium: "Leadership is not about being in charge. It is about taking care of those in your charge.",
      Long: "Great leaders don't set out to be leaders; they set out to make a difference. It is never about the role, but always about the goal. By empowering others, listening actively, and leading by example, true leaders inspire positive change."
    },
    Business: {
      Short: "Don't find customers for your products, find products for your customers.",
      Medium: "Play by the rules, but be ferocious. Value creation is the ultimate foundation of a successful business.",
      Long: "A successful business is built on a foundation of trust, innovation, and relentless customer focus. It is about identifying real problems and solving them in ways that bring value. Growth is the natural byproduct of delivering excellence consistently."
    },
    Life: {
      Short: "Life is what happens when you're busy making other plans.",
      Medium: "In the end, it's not the years in your life that count. It's the life in your years.",
      Long: "Life is a beautiful tapestry woven from experiences, relationships, and choices. It presents us with both trials to overcome and joy to celebrate. The secret is to live mindfully, cherish the present moment, and always lead with kindness."
    },
    Happiness: {
      Short: "Happiness depends upon ourselves.",
      Medium: "For every minute you are angry you lose sixty seconds of happiness. Choose joy every single day.",
      Long: "Happiness is not something ready-made. It comes from your own actions and your perspective on life. When we practice gratitude, nurture relationships, and focus on what truly matters, happiness flows naturally into our lives."
    },
    Sports: {
      Short: "Win or lose, always give your best effort.",
      Medium: "Champions keep playing until they get it right. It is the dedication behind the scenes that counts.",
      Long: "Sports teach us about discipline, teamwork, and resilience. It is not just about winning the game, but about how you handle defeat and how hard you work to improve. The lessons learned on the field remain invaluable throughout life."
    },
    Technology: {
      Short: "Technology is best when it brings people together.",
      Medium: "The human spirit must prevail over technology. It is a tool to empower, not replace, our creativity.",
      Long: "Technology is a powerful catalyst for innovation and progress, transforming how we live, work, and connect. However, its true value lies in how we apply it to solve humanity's most pressing challenges. We must design technology with empathy and responsibility."
    },
    Creativity: {
      Short: "Creativity is intelligence having fun.",
      Medium: "You can't use up creativity. The more you use, the more you have to create beautiful things.",
      Long: "Creativity is the spark that brings imagination to life, allowing us to see the world from fresh perspectives. It is the courage to experiment, make mistakes, and break traditional boundaries. Everyone possesses a unique creative voice waiting to be expressed."
    },
    Discipline: {
      Short: "Discipline is the bridge between goals and accomplishment.",
      Medium: "Self-discipline is the core component of success. It is choosing between what you want now and what you want most.",
      Long: "Discipline is the quiet force that drives daily progress, turning aspirations into reality. It requires consistency, focus, and the willingness to make short-term sacrifices for long-term growth. When you master your habits, you master your destiny."
    },
    "Self Confidence": {
      Short: "Confidence comes from within, believe in your power.",
      Medium: "With confidence, you have won before you have started. Trust your abilities and embrace your worth.",
      Long: "Self-confidence is not believing that everyone will like you; it is knowing that you will be fine even if they don't. It is built through taking action, overcoming fears, and accepting yourself fully. Believe in your voice and the value you bring to the world."
    },
    Entrepreneurship: {
      Short: "The best way to predict the future is to create it.",
      Medium: "Ideas are easy. Implementation is hard. The true entrepreneur is a doer, not just a dreamer.",
      Long: "Entrepreneurship is a challenging yet rewarding path of creating something from nothing. It demands passion, adaptability, and the resilience to weather uncertainty. By focusing on solving real problems and building a strong team, entrepreneurs reshape industries."
    }
  },
  Tamil: {
    Motivation: {
      Short: "உன்னால் முடியும் என்று நம்பு, அதுவே பாதி வெற்றி.",
      Medium: "நமது இன்றைய சந்தேகங்களே நாளைய சாதனைகளின் எல்லைகள். துணிச்சலோடும் நம்பிக்கையோடும் முன்னேறிச் செல்லுங்கள்.",
      Long: "வெற்றி என்பது இறுதியானது அல்ல, தோல்வி என்பது ஆபத்தானது அல்ல; தொடர்ந்து முயற்சிக்கும் துணிவே முக்கியம். ஒவ்வொரு நாளும் புதிய வாய்ப்புகளைத் தருகிறது. உங்கள் கனவுகளை நோக்கித் தொடர்ந்து ஓடுங்கள்."
    },
    Success: {
      Short: "வெற்றி என்பது ஒரு பயணம், இலக்கு அல்ல.",
      Medium: "வெற்றி என்பது தினம் தினம் செய்யும் சிறிய முயற்சியின் கூட்டுத்தொகை. தொடர்ந்து உழையுங்கள்.",
      Long: "வெற்றிக்கான வழி கடின உழைப்பு, விடாமுயற்சி மற்றும் தவறுகளிலிருந்து கற்றுக்கொள்வது ஆகியவற்றால் ஆனது. உங்கள் கனவுகளை ஒருபோதும் கைவிடாதீர்கள். உண்மையான வெற்றி என்பது நேர்மையுடன் இலக்குகளை அடைவதே ஆகும்."
    },
    Education: {
      Short: "கல்வி என்பது சுதந்திரத்தின் தங்கக் கதவைத் திறக்கும் திறவுகோல்.",
      Medium: "கல்வியின் வேர்கள் கசப்பானவை, ஆனால் அதன் கனி மிகவும் இனிப்பானது. கற்றல் ஒரு தொடர் பயணம்.",
      Long: "கல்வி என்பது வாழ்க்கைக்குத் தயாராவது மட்டுமல்ல, கல்வியே வாழ்க்கைதான். அது மனிதர்களை மேம்படுத்துகிறது. புதிய அறிவைத் தேடுவதை ஒருபோதும் நிறுத்தாதீர்கள், ஏனெனில் கற்றல் ஒரு சிறந்த சாகசம்."
    },
    Friendship: {
      Short: "உண்மையான நட்பு என்பது இரு உடலில் வாழும் ஒரு உயிர்.",
      Medium: "நட்பு என்பது உலகை ஒன்றிணைக்கும் ஒரு பலமான பிணைப்பு. உங்களுடன் நிற்கும் நண்பர்களை மதியுங்கள்.",
      Long: "உண்மையான நட்பு என்பது காலத்தையும் தூரத்தையும் கடந்த ஒரு அழகான பந்தம். இது பரஸ்பர மரியாதை மற்றும் நம்பிக்கையின் மேல் கட்டமைக்கப்படுகிறது. நமது வளர்ச்சியை ஆதரிக்கும் நண்பர்கள் ஒரு வரப்பிரசாதம்."
    },
    Leadership: {
      Short: "தலைவன் என்பவன் வழிகாட்டி, வழிநடத்துபவன்.",
      Medium: "தலைமைத்துவம் என்பது மற்றவர்கள் மீது அதிகாரம் செலுத்துவது அல்ல, அவர்களைப் பாதுகாத்து வழிநடத்துவதே ஆகும்.",
      Long: "சிறந்த தலைவர்கள் தலைவராக வேண்டும் என்று நினைப்பதில்லை, மாற்றத்தை உருவாக்க வேண்டும் என்றே நினைக்கிறார்கள். மற்றவர்களை ஊக்குவித்து, முன்னுதாரணமாகத் திகழ்வதே ஒரு தலைவனின் இலக்கணம்."
    },
    Business: {
      Short: "வாடிக்கையாளரைத் தேடாதீர்கள், வாடிக்கையாளருக்கான தேவையைத் தேடுங்கள்.",
      Medium: "விதிமுறைகளைப் பின்பற்றி, நேர்மையுடன் செயல்படுங்கள். மதிப்பை உருவாக்குவதே தொழிலின் அடிப்படை.",
      Long: "வெற்றிகரமான தொழில் என்பது நம்பிக்கை, புதுமை மற்றும் வாடிக்கையாளர் திருப்தியின் மேல் அமைகிறது. உண்மையான பிரச்சினைகளைக் கண்டறிந்து அவற்றுக்குத் தீர்வு காண்பதே தொழிலின் வெற்றிக்கு வழிவகுக்கும்."
    },
    Life: {
      Short: "நாம் திட்டமிடுவதைத் தாண்டி நடப்பதே வாழ்க்கை.",
      Medium: "முடிவில், நம் வாழ்வின் வருடங்கள் முக்கியமல்ல, அந்த வருடங்களில் நாம் எப்படி வாழ்ந்தோம் என்பதே முக்கியம்.",
      Long: "வாழ்க்கை என்பது அனுபவங்கள், உறவுகள் மற்றும் தேர்வுகள் ஆகியவற்றால் நெய்யப்பட்ட ஒரு அழகான சித்திரம். இதில் சோதனைகளும் உண்டு, சாதனைகளும் உண்டு. தற்போதைய தருணத்தை மகிழ்வோடு கொண்டாடுங்கள்."
    },
    Happiness: {
      Short: "மகிழ்ச்சி என்பது நம்முள்ளே இருக்கிறது.",
      Medium: "ஒவ்வொரு நிமிடம் கோபப்படும்போதும், அறுபது வினாடி மகிழ்ச்சியை இழக்கிறீர்கள். மகிழ்ச்சியைத் தேர்ந்தெடுங்கள்.",
      Long: "மகிழ்ச்சி என்பது வெளியில் தேடும் ஒன்றல்ல. அது நமது எண்ணங்கள் மற்றும் செயல்களிலிருந்து உருவாகிறது. நன்றியுணர்வுடன் இருப்பதும், அன்பைப் பகிர்வதும் நம்மை என்றும் மகிழ்ச்சியாக வைத்திருக்கும்."
    },
    Sports: {
      Short: "வெற்றி தோல்வி எதுவாயினும், உங்கள் சிறந்த உழைப்பைத் தாருங்கள்.",
      Medium: "வெற்றியாளர்கள் தவறு செய்யாதவர்கள் அல்ல, தோல்வியைக் கண்டு பின்வாங்காமல் தொடர்ந்து முயல்பவர்கள்.",
      Long: "விளையாட்டு நமக்கு ஒழுக்கம், குழுப்பணி மற்றும் சகிப்புத்தன்மையை கற்றுக்கொடுக்கிறது. இது விளையாட்டில் வெற்றி பெறுவது மட்டுமல்ல, வாழ்க்கையிலும் தடைகளைத் தாண்டி எப்படி முன்னேறுவது என்பதைக் கற்பிக்கிறது."
    },
    Technology: {
      Short: "தொழில்நுட்பம் மக்களை ஒன்றிணைக்கும் போது மிகச் சிறந்ததாகிறது.",
      Medium: "தொழில்நுட்பம் என்பது நமது படைப்பாற்றலை மேம்படுத்தும் ஒரு கருவியே தவிர, மனிதனை மாற்றுவதல்ல.",
      Long: "தொழில்நுட்பம் நமது வாழ்க்கையை எளிதாக்குகிறது. ஆனால் அதன் உண்மையான மதிப்பு மனித சமூகத்தின் பிரச்சினைகளைத் தீர்ப்பதில்தான் உள்ளது. எனவே பொறுப்புடன் தொழில்நுட்பத்தைப் பயன்படுத்துவோம்."
    },
    Creativity: {
      Short: "படைப்பாற்றல் என்பது அறிவு செய்யும் விளையாட்டு.",
      Medium: "படைப்பாற்றல் என்பது பயன்படுத்தப் பயன்படுத்த வளரும் ஒரு கலை. புதியவற்றை உருவாக்குங்கள்.",
      Long: "படைப்பாற்றல் என்பது உலகை புதிய கோணத்தில் பார்க்க உதவும் ஒரு தீப்பொறி. பரிசோதனை செய்யவும், தவறுகளிலிருந்து கற்றுக் கொள்ளவும் பயப்பட வேண்டாம். ஒவ்வொருவரிடமும் ஒரு தனித்திறமை ஒளிந்துள்ளது."
    },
    Discipline: {
      Short: "ஒழுக்கம் என்பது இலக்குகளை அடையும் பாலம்.",
      Medium: "சுய ஒழுக்கமே வெற்றியின் முக்கிய காரணி. தற்காலிக ஆசைகளைத் தவிர்த்து எதிர்கால வளர்ச்சிக்கு உழையுங்கள்.",
      Long: "ஒழுக்கம் என்பது அன்றாட முன்னேற்றத்தை வழிநடத்தும் ஒரு சக்தி. இதற்கு அர்ப்பணிப்பும் கவனமும் தேவை. உங்கள் பழக்கவழக்கங்களை நீங்கள் கட்டுப்படுத்தும்போது, உங்கள் வாழ்க்கையையும் உங்களால் கட்டுப்படுத்த முடியும்."
    },
    "Self Confidence": {
      Short: "சுய நம்பிக்கை உனக்குள் இருந்து வர வேண்டும்.",
      Medium: "நம்பிக்கையுடன் செயல்படும்போது, பாதி வெற்றியை அடைந்துவிடுகிறீர்கள். உங்கள் திறமையை நம்புங்கள்.",
      Long: "சுய நம்பிக்கை என்பது உங்களை அனைவரும் விரும்புவார்கள் என்று நினைப்பதல்ல, அவர்கள் விரும்பாவிட்டாலும் நீங்கள் தளராமல் இருப்பதே ஆகும். அச்சங்களைத் தாண்டி முயற்சிக்கும்போது நம்பிக்கை வளரும்."
    },
    Entrepreneurship: {
      Short: "எதிர்காலத்தை கணிக்க சிறந்த வழி, அதை உருவாக்குவதே.",
      Medium: "வெறும் யோசனைகள் போதாது, அதைச் செயல்படுத்தும் துணிவே ஒரு தொழில்முனைவோருக்குத் தேவை.",
      Long: "தொழில்முனைவு என்பது எளிதானது அல்ல, ஆனால் அது மிகவும் சுவாரஸ்யமானது. இதற்கு ஆர்வம், மாற்றங்களுக்கு ஏற்ப மாறும் தன்மை மற்றும் சகிப்புத்தன்மை தேவை. நல்ல குழுவை அமைத்து தொடர்ந்து முன்னேறுங்கள்."
    }
  },
  Hindi: {
    Motivation: {
      Short: "विश्वास करो कि तुम कर सकते हो, और आधी जीत पहले ही तुम्हारी है।",
      Medium: "हमारे सपनों की एकमात्र सीमा हमारा संदेह है। साहस और विश्वास के साथ आगे बढ़ते रहो।",
      Long: "सफलता अंतिम नहीं होती, असफलता घातक नहीं होती; जारी रखने का साहस ही मायने रखता है। हर दिन नए अवसर लेकर आता है। अपने सपनों की ओर चलते रहो और कभी हार मत मानो।"
    },
    Success: {
      Short: "सफलता एक यात्रा है, मंजिल नहीं।",
      Medium: "सफलता दिन-प्रतिदिन किए जाने वाले छोटे-छोटे प्रयासों का योग है। निरंतर प्रयास करते रहो और प्रक्रिया पर भरोसा रखो।",
      Long: "सफलता की राह में कठिन परिश्रम, दृढ़ता और गलतियों से सीखना शामिल है। चुनौतियों को स्वीकार करो और अपने लक्ष्य को कभी मत भूलो। असली सफलता अपने मूल्यों के साथ लक्ष्य प्राप्त करना है।"
    },
    Discipline: {
      Short: "अनुशासन लक्ष्य और उपलब्धि के बीच का पुल है।",
      Medium: "आत्म-अनुशासन सफलता का मूल तत्व है। यह वर्तमान की इच्छाओं और भविष्य के लक्ष्यों के बीच चुनाव है।",
      Long: "अनुशासन वह शांत शक्ति है जो दैनिक प्रगति को गति देती है। इसके लिए निरंतरता, ध्यान और अल्पकालिक त्याग की आवश्यकता होती है। जब आप अपनी आदतों पर नियंत्रण करते हैं, तो आप अपनी नियति पर नियंत्रण करते हैं।"
    },
    Creativity: {
      Short: "रचनात्मकता बुद्धि का आनंद है।",
      Medium: "रचनात्मकता एक कला है जो उपयोग करने पर और बढ़ती है। नई चीजें बनाओ और दुनिया को अपने नजरिए से देखो।",
      Long: "रचनात्मकता वह चिंगारी है जो कल्पना को जीवन में लाती है। यह प्रयोग करने, गलतियां करने और परंपराओं को तोड़ने का साहस है। हर किसी के अंदर एक अनोखी रचनात्मक आवाज छुपी है।"
    },
    Leadership: {
      Short: "नेता वह है जो रास्ता जानता है, चलता है और दिखाता है।",
      Medium: "नेतृत्व का अर्थ प्रभारी होना नहीं है; यह अपने लोगों की देखभाल करना है।",
      Long: "महान नेता नेता बनने के लिए नहीं निकलते; वे बदलाव लाने के लिए निकलते हैं। दूसरों को सशक्त बनाकर और उदाहरण पेश करके ही एक सच्चा नेता प्रेरणा देता है।"
    },
    Happiness: {
      Short: "खुशी हमारे भीतर ही है।",
      Medium: "हर मिनट जो आप गुस्से में बिताते हैं, साठ सेकंड की खुशी खो देते हैं। हर दिन खुशी को चुनें।",
      Long: "खुशी कोई तैयार चीज नहीं है। यह हमारे अपने कार्यों और जीवन पर हमारे दृष्टिकोण से आती है। जब हम कृतज्ञता का अभ्यास करते हैं, तो खुशी स्वाभाविक रूप से हमारे जीवन में आती है।"
    },
    Entrepreneurship: {
      Short: "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका उसे बनाना है।",
      Medium: "विचार आसान हैं, क्रियान्वयन कठिन है। एक सच्चा उद्यमी सपने देखने वाला नहीं, कर्म करने वाला होता है।",
      Long: "उद्यमिता एक चुनौतीपूर्ण लेकिन पुरस्कृत मार्ग है। इसके लिए जुनून, अनुकूलनशीलता और अनिश्चितता को झेलने की क्षमता चाहिए। वास्तविक समस्याओं को हल करने पर ध्यान देकर उद्यमी उद्योगों को बदल देते हैं।"
    },
    Life: { Short: "जीवन वह है जो तब होता है जब आप अन्य योजनाएं बनाने में व्यस्त होते हैं।", Medium: "अंत में, आपके जीवन के वर्ष नहीं बल्कि उन वर्षों में आपका जीवन मायने रखता है।", Long: "जीवन अनुभवों, रिश्तों और विकल्पों से बुनी एक सुंदर कला कृति है। इसमें परीक्षाएं भी हैं और खुशियां भी। वर्तमान क्षण को संजोकर जिएं और हमेशा दयालुता से काम लें।" },
    Friendship: { Short: "एक सच्चा मित्र दो शरीरों में एक आत्मा है।", Medium: "मित्रता एकमात्र सीमेंट है जो दुनिया को एक साथ रखती है। जो आपके साथ खड़े हों उन्हें संजोएं।", Long: "सच्ची मित्रता एक दुर्लभ और सुंदर बंधन है जो समय और दूरी से परे है। यह परस्पर सम्मान और विश्वास पर बनी है। जो मित्र आपकी वृद्धि का समर्थन करते हैं वे जीवन का सबसे बड़ा खजाना हैं।" },
    Education: { Short: "शिक्षा स्वतंत्रता के सुनहरे द्वार की चाबी है।", Medium: "शिक्षा की जड़ें कड़वी हैं, पर उसका फल मीठा है। सीखना आजीवन आत्म-खोज की यात्रा है।", Long: "शिक्षा जीवन की तैयारी नहीं है; शिक्षा ही जीवन है। यह व्यक्तियों को सशक्त बनाती है और नई संभावनाएं खोलती है। ज्ञान की खोज कभी मत छोड़ो, क्योंकि सीखना सबसे बड़ा साहसिक कार्य है।" },
    Business: { Short: "अपने उत्पाद के लिए ग्राहक मत खोजो, अपने ग्राहकों के लिए उत्पाद खोजो।", Medium: "नियमों के अनुसार खेलो, लेकिन दृढ़ रहो। मूल्य निर्माण सफल व्यवसाय की नींव है।", Long: "एक सफल व्यवसाय विश्वास, नवाचार और ग्राहक फोकस पर बनता है। वास्तविक समस्याओं को पहचानें और उन्हें हल करें। उत्कृष्टता देना विकास का स्वाभाविक उपोत्पाद है।" },
    Sports: { Short: "जीत हो या हार, हमेशा अपना सर्वश्रेष्ठ दें।", Medium: "चैंपियन तब तक खेलते रहते हैं जब तक वे सही नहीं हो जाते। पर्दे के पीछे की मेहनत ही मायने रखती है।", Long: "खेल हमें अनुशासन, टीम वर्क और लचीलेपन के बारे में सिखाते हैं। यह सिर्फ खेल जीतने के बारे में नहीं है, बल्कि हार को कैसे संभालें और कैसे सुधारें। खेल के मैदान पर सीखे सबक जीवन भर काम आते हैं।" },
    Technology: { Short: "तकनीक तब सबसे अच्छी होती है जब वह लोगों को जोड़ती है।", Medium: "मानवीय भावना को तकनीक पर प्रबल होना चाहिए। यह हमारी रचनात्मकता को बढ़ावा देने का एक साधन है।", Long: "तकनीक नवाचार और प्रगति के लिए एक शक्तिशाली उत्प्रेरक है। इसका असली मूल्य मानवता की सबसे बड़ी चुनौतियों को सुलझाने में है। हमें सहानुभूति और जिम्मेदारी के साथ तकनीक बनानी चाहिए।" },
    "Self Confidence": { Short: "आत्मविश्वास अंदर से आता है, अपनी शक्ति में विश्वास करो।", Medium: "आत्मविश्वास के साथ, आपने शुरू करने से पहले ही जीत लिया है। अपनी क्षमताओं पर भरोसा रखें।", Long: "आत्मविश्वास यह मानना नहीं है कि सभी आपको पसंद करेंगे; यह जानना है कि अगर वे नहीं करते तो भी आप ठीक रहेंगे। यह कार्रवाई करने और डर पर काबू पाने से बनता है।" }
  },
  Spanish: {
    Motivation: {
      Short: "Cree que puedes y ya estás a mitad del camino.",
      Medium: "El único límite a nuestra realización del mañana son nuestras dudas de hoy. Avanza con valor y convicción.",
      Long: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje de continuar. Cada día trae nuevas oportunidades para aprender y crecer. Sigue persiguiendo tus sueños y nunca dejes que los obstáculos temporales definan tu viaje final."
    },
    Success: {
      Short: "El éxito es un viaje, no un destino.",
      Medium: "El éxito es la suma de pequeños esfuerzos repetidos día tras día. Sé constante y confía en el proceso.",
      Long: "El camino al éxito está pavimentado con trabajo duro, persistencia y aprendizaje de los errores. Requiere que salgas de tu zona de confort y nunca pierdas de vista tu visión. El verdadero éxito es alcanzar tus metas manteniéndote fiel a tus valores fundamentales."
    },
    Discipline: { Short: "La disciplina es el puente entre metas y logros.", Medium: "La autodisciplina es el componente central del éxito. Es elegir entre lo que quieres ahora y lo que más quieres.", Long: "La disciplina es la fuerza silenciosa que impulsa el progreso diario. Requiere consistencia, enfoque y disposición para hacer sacrificios a corto plazo para el crecimiento a largo plazo." },
    Creativity: { Short: "La creatividad es la inteligencia divirtiéndose.", Medium: "La creatividad no se agota. Cuanto más la usas, más tienes para crear cosas hermosas.", Long: "La creatividad es la chispa que da vida a la imaginación, permitiéndonos ver el mundo desde perspectivas frescas. Es el coraje de experimentar y romper fronteras tradicionales." },
    Leadership: { Short: "Un líder es alguien que conoce el camino, lo recorre y lo muestra.", Medium: "El liderazgo no es estar a cargo. Es cuidar de quienes están a tu cargo.", Long: "Los grandes líderes no se proponen ser líderes; se proponen marcar la diferencia. Al empoderar a otros y liderar con el ejemplo, los verdaderos líderes inspiran un cambio positivo." },
    Happiness: { Short: "La felicidad depende de nosotros mismos.", Medium: "Por cada minuto que estás enojado, pierdes sesenta segundos de felicidad. Elige la alegría cada día.", Long: "La felicidad no es algo que ya está hecho. Viene de tus propias acciones y perspectiva sobre la vida. Cuando practicamos la gratitud y nos enfocamos en lo que realmente importa, la felicidad fluye naturalmente." },
    Entrepreneurship: { Short: "La mejor manera de predecir el futuro es crearlo.", Medium: "Las ideas son fáciles. La implementación es difícil. El verdadero emprendedor es un hacedor, no solo un soñador.", Long: "El emprendimiento es un camino desafiante pero gratificante de crear algo de la nada. Exige pasión, adaptabilidad y la resiliencia para sobrevivir a la incertidumbre." },
    Life: { Short: "La vida es lo que pasa cuando estás ocupado haciendo otros planes.", Medium: "Al final, no son los años en tu vida los que cuentan. Es la vida en tus años.", Long: "La vida es un hermoso tapiz tejido de experiencias, relaciones y elecciones. Nos presenta tanto pruebas como alegrías. El secreto es vivir con atención y siempre liderar con amabilidad." },
    Friendship: { Short: "Un verdadero amigo es un alma en dos cuerpos.", Medium: "La amistad es el único cemento que siempre mantendrá unido al mundo. Valora a quienes están contigo.", Long: "La verdadera amistad es un vínculo raro y hermoso que trasciende el tiempo y la distancia. Está construida sobre el respeto mutuo y la confianza. Tener amigos que apoyen tu crecimiento es uno de los mayores tesoros de la vida." },
    Education: { Short: "La educación es la llave para abrir la puerta dorada de la libertad.", Medium: "Las raíces de la educación son amargas, pero su fruto es dulce. El aprendizaje es un viaje continuo de autodescubrimiento.", Long: "La educación no es preparación para la vida; la educación es la vida misma. Empodera a las personas y expande horizontes. Nunca dejes de buscar conocimiento." },
    Business: { Short: "No busques clientes para tus productos, encuentra productos para tus clientes.", Medium: "Juega según las reglas, pero sé feroz. La creación de valor es la base del éxito empresarial.", Long: "Un negocio exitoso se construye sobre la confianza, la innovación y el enfoque en el cliente. Se trata de identificar problemas reales y resolverlos de maneras que aporten valor." },
    Sports: { Short: "Ganes o pierdas, siempre da tu mejor esfuerzo.", Medium: "Los campeones siguen jugando hasta que lo hacen bien. Es la dedicación detrás de escena lo que cuenta.", Long: "Los deportes nos enseñan sobre disciplina, trabajo en equipo y resiliencia. No solo se trata de ganar el juego, sino de cómo manejas la derrota y cuánto trabajas para mejorar." },
    Technology: { Short: "La tecnología es mejor cuando une a las personas.", Medium: "El espíritu humano debe prevalecer sobre la tecnología. Es una herramienta para empoderar nuestra creatividad.", Long: "La tecnología es un poderoso catalizador para la innovación y el progreso. Su verdadero valor radica en cómo lo aplicamos para resolver los desafíos más apremiantes de la humanidad." },
    "Self Confidence": { Short: "La confianza viene de adentro, cree en tu poder.", Medium: "Con confianza, ya has ganado antes de empezar. Confía en tus habilidades y abraza tu valor.", Long: "La autoconfianza no es creer que todos te van a gustar; es saber que estarás bien incluso si no lo hacen. Se construye tomando acción y superando miedos." }
  },
  French: {
    Motivation: {
      Short: "Croyez que vous pouvez, et vous êtes déjà à mi-chemin.",
      Medium: "La seule limite à notre réalisation de demain est notre doute d'aujourd'hui. Avancez avec courage et conviction.",
      Long: "Le succès n'est pas définitif, l'échec n'est pas fatal: c'est le courage de continuer qui compte. Chaque jour apporte de nouvelles opportunités d'apprendre et de grandir. Continuez à poursuivre vos rêves et ne laissez jamais les obstacles temporaires définir votre parcours."
    },
    Success: {
      Short: "Le succès est un voyage, pas une destination.",
      Medium: "Le succès est la somme de petits efforts répétés jour après jour. Restez constant et faites confiance au processus.",
      Long: "La route vers le succès est pavée de travail acharné, de persévérance et d'apprentissage de vos erreurs. Cela nécessite de sortir de votre zone de confort et de ne jamais perdre de vue votre vision. Le vrai succès c'est atteindre ses objectifs en restant fidèle à ses valeurs fondamentales."
    },
    Discipline: { Short: "La discipline est le pont entre les objectifs et les réalisations.", Medium: "L'autodiscipline est le composant central du succès. C'est choisir entre ce que vous voulez maintenant et ce que vous voulez le plus.", Long: "La discipline est la force silencieuse qui fait avancer le progrès quotidien. Elle nécessite de la constance, de la concentration et la volonté de faire des sacrifices à court terme pour une croissance à long terme." },
    Creativity: { Short: "La créativité est l'intelligence qui s'amuse.", Medium: "Vous ne pouvez pas épuiser la créativité. Plus vous l'utilisez, plus vous en avez pour créer de belles choses.", Long: "La créativité est l'étincelle qui donne vie à l'imagination, nous permettant de voir le monde sous de nouveaux angles. C'est le courage d'expérimenter et de briser les frontières traditionnelles." },
    Leadership: { Short: "Un leader est quelqu'un qui connaît la voie, la parcourt et la montre.", Medium: "Le leadership ne consiste pas à être responsable. Il s'agit de prendre soin de ceux sous votre responsabilité.", Long: "Les grands leaders ne cherchent pas à être des leaders; ils cherchent à faire la différence. En autonomisant les autres et en menant par l'exemple, les vrais leaders inspirent un changement positif." },
    Happiness: { Short: "Le bonheur dépend de nous-mêmes.", Medium: "Pour chaque minute où vous êtes en colère, vous perdez soixante secondes de bonheur. Choisissez la joie chaque jour.", Long: "Le bonheur n'est pas quelque chose de tout fait. Il vient de vos propres actions et de votre perspective sur la vie. Quand nous pratiquons la gratitude et nous concentrons sur ce qui compte vraiment, le bonheur coule naturellement." },
    Entrepreneurship: { Short: "La meilleure façon de prédire l'avenir est de le créer.", Medium: "Les idées sont faciles. La mise en œuvre est difficile. Le vrai entrepreneur est un faiseur, pas seulement un rêveur.", Long: "L'entrepreneuriat est une voie difficile mais enrichissante de créer quelque chose à partir de rien. Il exige de la passion, de l'adaptabilité et la résilience pour traverser l'incertitude." },
    Life: { Short: "La vie est ce qui se passe quand vous êtes occupé à faire d'autres plans.", Medium: "En fin de compte, ce ne sont pas les années dans votre vie qui comptent. C'est la vie dans vos années.", Long: "La vie est une belle tapisserie tissée d'expériences, de relations et de choix. Elle nous présente à la fois des épreuves à surmonter et des joies à célébrer. Le secret est de vivre avec pleine conscience." },
    Friendship: { Short: "Un vrai ami est une âme en deux corps.", Medium: "L'amitié est le seul ciment qui maintiendra jamais le monde ensemble. Valorisez ceux qui restent avec vous.", Long: "La vraie amitié est un lien rare et beau qui transcende le temps et la distance. Elle est construite sur le respect mutuel et la confiance. Avoir des amis qui soutiennent votre croissance est l'un des plus grands trésors de la vie." },
    Education: { Short: "L'éducation est la clé pour ouvrir la porte dorée de la liberté.", Medium: "Les racines de l'éducation sont amères, mais son fruit est doux. Apprendre est un voyage d'autodécouverte tout au long de la vie.", Long: "L'éducation n'est pas une préparation à la vie; l'éducation est la vie elle-même. Elle autonomise les individus et élargit les horizons. Ne cessez jamais de chercher la connaissance." },
    Business: { Short: "Ne trouvez pas des clients pour vos produits, trouvez des produits pour vos clients.", Medium: "Jouez selon les règles, mais soyez féroce. La création de valeur est la base ultime d'une entreprise prospère.", Long: "Une entreprise prospère est construite sur la confiance, l'innovation et un focus client inébranlable. Il s'agit d'identifier de vrais problèmes et de les résoudre d'une manière qui apporte de la valeur." },
    Sports: { Short: "Gagnez ou perdez, donnez toujours votre meilleur effort.", Medium: "Les champions continuent de jouer jusqu'à ce qu'ils réussissent. C'est le dévouement en coulisses qui compte.", Long: "Les sports nous apprennent la discipline, le travail d'équipe et la résilience. Il ne s'agit pas seulement de gagner le jeu, mais de savoir gérer la défaite et de travailler dur pour s'améliorer." },
    Technology: { Short: "La technologie est meilleure quand elle rapproche les gens.", Medium: "L'esprit humain doit prévaloir sur la technologie. C'est un outil pour autonomiser notre créativité.", Long: "La technologie est un puissant catalyseur d'innovation et de progrès. Sa vraie valeur réside dans la façon dont nous l'appliquons pour résoudre les défis les plus urgents de l'humanité." },
    "Self Confidence": { Short: "La confiance vient de l'intérieur, croyez en votre pouvoir.", Medium: "Avec confiance, vous avez gagné avant même d'avoir commencé. Faites confiance à vos capacités.", Long: "La confiance en soi n'est pas de croire que tout le monde vous aimera; c'est de savoir que vous irez bien même si ce n'est pas le cas. Elle se construit en passant à l'action et en surmontant les peurs." }
  },
  German: {
    Motivation: {
      Short: "Glaube daran, dass du es kannst, und du bist schon auf halbem Weg.",
      Medium: "Die einzige Grenze unserer Verwirklichung von morgen sind unsere Zweifel von heute. Gehe mit Mut und Überzeugung voran.",
      Long: "Erfolg ist nicht endgültig, Scheitern ist nicht fatal: Es ist der Mut weiterzumachen, der zählt. Jeder Tag bringt neue Möglichkeiten zu lernen und zu wachsen. Verfolge deine Träume und lass temporäre Rückschläge deine Reise nicht definieren."
    },
    Success: {
      Short: "Erfolg ist eine Reise, kein Ziel.",
      Medium: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden. Bleib konsequent und vertraue dem Prozess.",
      Long: "Der Weg zum Erfolg ist gepflastert mit harter Arbeit, Ausdauer und dem Lernen aus Fehlern. Es erfordert, die Komfortzone zu verlassen und das Ziel nie aus den Augen zu verlieren. Wahrer Erfolg bedeutet, seine Ziele zu erreichen und dabei den eigenen Werten treu zu bleiben."
    },
    Discipline: { Short: "Disziplin ist die Brücke zwischen Zielen und Leistung.", Medium: "Selbstdisziplin ist der Kernbestandteil des Erfolgs. Es geht darum, zwischen dem zu wählen, was du jetzt willst, und dem, was du am meisten willst.", Long: "Disziplin ist die stille Kraft, die den täglichen Fortschritt antreibt. Sie erfordert Konsequenz, Fokus und die Bereitschaft, kurzfristige Opfer für langfristiges Wachstum zu bringen." },
    Creativity: { Short: "Kreativität ist Intelligenz, die Spaß hat.", Medium: "Kreativität kann man nicht aufbrauchen. Je mehr man sie nutzt, desto mehr hat man, um schöne Dinge zu schaffen.", Long: "Kreativität ist der Funke, der Vorstellungskraft zum Leben erweckt. Es ist der Mut, zu experimentieren und traditionelle Grenzen zu durchbrechen." },
    Leadership: { Short: "Ein Anführer kennt den Weg, geht den Weg und zeigt den Weg.", Medium: "Führung bedeutet nicht, die Kontrolle zu haben. Es geht darum, für diejenigen zu sorgen, die dir anvertraut sind.", Long: "Große Anführer streben nicht danach, Anführer zu sein; sie streben danach, einen Unterschied zu machen. Indem sie andere stärken und mit gutem Beispiel vorangehen, inspirieren wahre Führungspersönlichkeiten positiven Wandel." },
    Happiness: { Short: "Glück hängt von uns selbst ab.", Medium: "Für jede Minute, die du wütend bist, verlierst du sechzig Sekunden Glück. Wähle jeden Tag die Freude.", Long: "Glück ist keine fertige Sache. Es kommt aus deinen eigenen Handlungen und deiner Sichtweise auf das Leben. Wenn wir Dankbarkeit üben und uns auf das konzentrieren, was wirklich zählt, fließt Glück natürlich in unser Leben." },
    Entrepreneurship: { Short: "Der beste Weg, die Zukunft vorherzusagen, ist sie zu gestalten.", Medium: "Ideen sind einfach. Die Umsetzung ist schwer. Der wahre Unternehmer ist ein Macher, nicht nur ein Träumer.", Long: "Unternehmertum ist ein herausfordernder, aber lohnender Weg, etwas aus dem Nichts zu schaffen. Es erfordert Leidenschaft, Anpassungsfähigkeit und die Resilienz, Unsicherheit zu überstehen." },
    Life: { Short: "Das Leben ist das, was passiert, während du damit beschäftigt bist, andere Pläne zu machen.", Medium: "Am Ende zählen nicht die Jahre in deinem Leben. Es ist das Leben in deinen Jahren.", Long: "Das Leben ist ein wunderschöner Wandteppich, gewebt aus Erfahrungen, Beziehungen und Entscheidungen. Es stellt uns vor Prüfungen und Freuden. Das Geheimnis ist es, achtsam zu leben und stets mit Güte voranzugehen." },
    Friendship: { Short: "Ein wahrer Freund ist eine Seele in zwei Körpern.", Medium: "Freundschaft ist der einzige Zement, der die Welt zusammenhalten wird. Schätze diejenigen, die bei dir stehen.", Long: "Wahre Freundschaft ist ein seltenes und schönes Band, das Zeit und Entfernung übersteigt. Sie basiert auf gegenseitigem Respekt und Vertrauen. Freunde, die dein Wachstum unterstützen, sind einer der größten Schätze des Lebens." },
    Education: { Short: "Bildung ist der Schlüssel, um die goldene Tür der Freiheit zu öffnen.", Medium: "Die Wurzeln der Bildung sind bitter, aber die Frucht ist süß. Lernen ist eine lebenslange Reise der Selbstentdeckung.", Long: "Bildung ist keine Vorbereitung auf das Leben; Bildung ist das Leben selbst. Sie befähigt Einzelpersonen und erweitert Horizonte. Höre niemals auf, Wissen zu suchen." },
    Business: { Short: "Suche keine Kunden für deine Produkte, finde Produkte für deine Kunden.", Medium: "Spiel nach den Regeln, aber sei entschlossen. Wertschöpfung ist die ultimative Grundlage eines erfolgreichen Unternehmens.", Long: "Ein erfolgreiches Unternehmen basiert auf Vertrauen, Innovation und konsequentem Kundenfokus. Es geht darum, echte Probleme zu identifizieren und sie auf eine Weise zu lösen, die Wert schafft." },
    Sports: { Short: "Ob Sieg oder Niederlage, gib immer dein Bestes.", Medium: "Champions spielen weiter, bis sie es richtig machen. Es ist die Hingabe hinter den Kulissen, die zählt.", Long: "Sport lehrt uns Disziplin, Teamwork und Belastbarkeit. Es geht nicht nur darum, das Spiel zu gewinnen, sondern darum, wie man mit einer Niederlage umgeht und wie hart man arbeitet, um sich zu verbessern." },
    Technology: { Short: "Technologie ist am besten, wenn sie Menschen zusammenbringt.", Medium: "Der menschliche Geist muss über die Technologie siegen. Sie ist ein Werkzeug zur Stärkung unserer Kreativität.", Long: "Technologie ist ein mächtiger Katalysator für Innovation und Fortschritt. Ihr wahrer Wert liegt darin, wie wir sie anwenden, um die dringlichsten Herausforderungen der Menschheit zu lösen." },
    "Self Confidence": { Short: "Vertrauen kommt von innen, glaube an deine Kraft.", Medium: "Mit Selbstvertrauen hast du gewonnen, bevor du überhaupt angefangen hast. Vertraue deinen Fähigkeiten.", Long: "Selbstvertrauen bedeutet nicht zu glauben, dass alle dich mögen werden; es ist zu wissen, dass es dir gut gehen wird, auch wenn das nicht der Fall ist. Es entsteht durch Handeln und das Überwinden von Ängsten." }
  }
};

const generateQuote = async (category, language, length) => {
  try {
    // If API key is not configured, return fallback quote
    if (!isApiKeyConfigured) {
      const languageQuotes = fallbackQuotes[language] || fallbackQuotes.English;
      const categoryQuotes = languageQuotes[category] || languageQuotes.Motivation;
      const quote = categoryQuotes[length] || categoryQuotes.Short;
      
      // Artificial delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      return quote + " [Demo Mode]";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let lengthInstruction = "";

    switch (length) {
      case "Short":
        lengthInstruction = "The quote should be 1-2 sentences long (under 20 words).";
        break;
      case "Medium":
        lengthInstruction = "The quote should be 2-3 sentences long (20-50 words).";
        break;
      case "Long":
        lengthInstruction = "The quote should be a full paragraph, 4-6 sentences long (50-100 words).";
        break;
      default:
        lengthInstruction = "The quote should be 1-2 sentences long.";
    }

    const prompt = `Generate one completely original inspirational quote.

Requirements:
- Category: ${category}
- Language: ${language}
- Length: ${length}

Additional Instructions:
${lengthInstruction}

Rules:
- Generate only one quote.
- Do not copy famous quotes.
- Do not include quotation marks.
- Do not include numbering.
- Do not include explanations.
- Do not include emojis.
- Return only the quote.
- If the language is Tamil, write the entire quote in Tamil script only, with no English.
- If the language is Hindi, write the entire quote in Devanagari script only, with no English.
- If the language is Spanish, write the entire quote entirely in Spanish, with no English.
- If the language is French, write the entire quote entirely in French, with no English.
- If the language is German, write the entire quote entirely in German, with no English.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const quote = response.text().trim();

    if (!quote || quote.length === 0) {
      throw new Error("Generated quote is empty");
    }

    return quote;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate quote using AI. Please try again.");
  }
};

const generateChatResponse = async (messages) => {
  try {
    const lastUserMessage = messages[messages.length - 1];
    const userText = (lastUserMessage.text || lastUserMessage.content || "").trim();
    const userTextLower = userText.toLowerCase();

    // 1. If API key is not configured, run in Demo/Mock Mode
    if (!isApiKeyConfigured) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Artificial delay

      // Check if user says "yes" or similar, and the last assistant message was asking about tips
      const lastModelMessage = messages.length > 1 ? messages[messages.length - 2] : null;
      const lastModelText = lastModelMessage ? (lastModelMessage.text || lastModelMessage.content || "") : "";
      
      const isYesAnswer = ["yes", "yep", "sure", "ok", "please", "yeah", "y"].some(word => userTextLower === word || userTextLower.startsWith(word + " "));
      const wasAskedTips = lastModelText.includes("Would you like some study motivation tips?");

      if (isYesAnswer && wasAskedTips) {
        return `1. Study in 25-minute sessions.
2. Take short breaks.
3. Focus on one subject at a time.

Today's Motivation:
"The future belongs to those who prepare today." [Demo Mode]`;
      }

      if (
        userTextLower.includes("stressed") ||
        userTextLower.includes("exam") ||
        userTextLower.includes("test") ||
        userTextLower.includes("study")
      ) {
        return `Remember, every challenge is preparing you for something greater.
Would you like some study motivation tips? [Demo Mode]`;
      }

      if (
        userTextLower.includes("another quote") ||
        userTextLower.includes("generate another quote") ||
        userTextLower.includes("more quote") ||
        userTextLower.includes("next quote") ||
        userTextLower.includes("give me another")
      ) {
        // Pick a nice motivational fallback quote
        const quotes = [
          "Small consistent efforts create extraordinary results.",
          "Success is the sum of small efforts, repeated day in and day out.",
          "Your only limit is you. Push beyond your comfort zone.",
          "Believe you can and you're halfway there."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return `${randomQuote} [Demo Mode]`;
      }

      // Default fallback chat response
      return `I'm your AI Mentor! Feel free to tell me how you are feeling (e.g. stressed, excited, unmotivated) or ask me to generate a quote for you. [Demo Mode]`;
    }

    // 2. If API key is configured, call Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `You are an empathetic, wise, and highly encouraging AI Mentor and Quote Assistant.
Your goal is to support users, boost their motivation, and guide them.
When users share concerns, stress, or goals:
- Respond with warm empathy.
- Provide concise, practical advice or suggestions (using bullet points or numbered lists if helpful).
- Always weave in or end with a tailored, original, and highly relevant inspirational quote. Do not cite existing famous quotes; create a fresh one.
- Keep the conversation friendly, encouraging, and clear. Avoid markdown bold formatting on every word; make it read naturally.`
    });

    // Map history to the Gemini API format
    // Each message in history must be { role: "user" | "model", parts: [{ text: string }] }
    const history = [];
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      const role = msg.role === "user" ? "user" : "model";
      const text = msg.text || msg.content || "";
      if (text) {
        history.push({
          role,
          parts: [{ text }]
        });
      }
    }

    const chat = model.startChat({
      history: history
    });

    const result = await chat.sendMessage(userText);
    const responseText = result.response.text().trim();
    
    return responseText;
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    throw new Error("Failed to generate response using AI. Please try again.");
  }
};

module.exports = { generateQuote, generateChatResponse };