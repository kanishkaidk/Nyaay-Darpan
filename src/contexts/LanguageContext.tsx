import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.analyze': 'Analyze Contract',
    'nav.reports': 'My Reports',
    'nav.chat': 'Chat',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.title': 'NyayDarpan',
    'landing.subtitle': 'The Mirror of Justice',
    'landing.description': 'AI-powered contract analysis that reveals hidden risks and provides actionable insights',
    'landing.getStarted': 'Get Started',
    'landing.learnMore': 'Learn More',
    
    // Features
    'features.xray': 'AI X-Ray Analysis',
    'features.xray.desc': 'Deep AI analysis reveals hidden risks and unclear terms',
    'features.karma': 'Karma Check',
    'features.karma.desc': 'Background verification of the other party\'s legal history',
    'features.risk': 'Risk Assessment',
    'features.risk.desc': 'Comprehensive risk scoring and plain-English explanations',
    'features.voice': 'Voice Input',
    'features.voice.desc': 'Speak your queries in English or Hindi',
    'features.multilingual': 'Multilingual Support',
    'features.multilingual.desc': 'Full support for English and Hindi languages',
    
    // Input Page
    'input.title': 'Contract Analysis',
    'input.subtitle': 'Let our AI X-ray your legal document',
    'input.contractLabel': 'Contract Text',
    'input.contractPlaceholder': 'Paste your contract text here...',
    'input.partyLabel': 'Other Party Name',
    'input.partyPlaceholder': 'Enter the full name of the company or person',
    'input.generateButton': 'Generate My Report',
    'input.uploadText': 'Or upload a document',
    'input.securityNote': 'Your data is encrypted and processed securely',
    
    // Report Page
    'report.title': 'NyayDarpan Report',
    'report.overallRisk': 'Overall Risk Score',
    'report.riskDescription': 'Based on AI analysis, legal precedents, and community insights',
    'report.xray': 'Internal Audit (X-Ray)',
    'report.karma': 'Behavioral Risk (Karma Check)',
    'report.community': 'Community Intelligence (People\'s Ledger)',
    'report.reviews': 'Company Reviews',
    'report.chatTitle': 'Chat with Your Document',
    'report.quickActions': 'Quick Actions',
    
    // Chat
    'chat.placeholder': 'Ask about your contract...',
    'chat.analyzeAnother': 'Analyze Another Contract',
    'chat.consultLawyer': 'Consult a Lawyer',
    'chat.downloadReport': 'Download Full Report',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.retry': 'Retry',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.analyze': 'अनुबंध विश्लेषण',
    'nav.reports': 'मेरी रिपोर्ट्स',
    'nav.chat': 'चैट',
    'nav.login': 'लॉगिन',
    'nav.signup': 'साइन अप',
    'nav.logout': 'लॉगआउट',
    
    // Landing Page
    'landing.title': 'न्यायदर्पण',
    'landing.subtitle': 'न्याय का दर्पण',
    'landing.description': 'एआई-संचालित अनुबंध विश्लेषण जो छुपे जोखिमों को उजागर करता है और कार्यान्वयन योग्य अंतर्दृष्टि प्रदान करता है',
    'landing.getStarted': 'शुरू करें',
    'landing.learnMore': 'और जानें',
    
    // Features
    'features.xray': 'एआई एक्स-रे विश्लेषण',
    'features.xray.desc': 'गहरी एआई विश्लेषण छुपे जोखिमों और अस्पष्ट शर्तों को उजागर करता है',
    'features.karma': 'कर्म चेक',
    'features.karma.desc': 'दूसरे पक्ष के कानूनी इतिहास की पृष्ठभूमि सत्यापन',
    'features.risk': 'जोखिम मूल्यांकन',
    'features.risk.desc': 'व्यापक जोखिम स्कोरिंग और सरल-अंग्रेजी स्पष्टीकरण',
    'features.voice': 'वॉयस इनपुट',
    'features.voice.desc': 'अंग्रेजी या हिंदी में अपने प्रश्न बोलें',
    'features.multilingual': 'बहुभाषी समर्थन',
    'features.multilingual.desc': 'अंग्रेजी और हिंदी भाषाओं के लिए पूर्ण समर्थन',
    
    // Input Page
    'input.title': 'अनुबंध विश्लेषण',
    'input.subtitle': 'हमारी एआई से अपने कानूनी दस्तावेज़ का एक्स-रे कराएं',
    'input.contractLabel': 'अनुबंध पाठ',
    'input.contractPlaceholder': 'यहां अपना अनुबंध पाठ पेस्ट करें...',
    'input.partyLabel': 'दूसरे पक्ष का नाम',
    'input.partyPlaceholder': 'कंपनी या व्यक्ति का पूरा नाम दर्ज करें',
    'input.generateButton': 'मेरी रिपोर्ट बनाएं',
    'input.uploadText': 'या कोई दस्तावेज़ अपलोड करें',
    'input.securityNote': 'आपका डेटा एन्क्रिप्टेड और सुरक्षित रूप से प्रोसेस किया जाता है',
    
    // Report Page
    'report.title': 'न्यायदर्पण रिपोर्ट',
    'report.overallRisk': 'समग्र जोखिम स्कोर',
    'report.riskDescription': 'एआई विश्लेषण, कानूनी नजीरों और समुदायिक अंतर्दृष्टि के आधार पर',
    'report.xray': 'आंतरिक ऑडिट (एक्स-रे)',
    'report.karma': 'व्यवहारिक जोखिम (कर्म चेक)',
    'report.community': 'समुदायिक बुद्धिमत्ता (लोगों का खाता)',
    'report.reviews': 'कंपनी समीक्षाएं',
    'report.chatTitle': 'अपने दस्तावेज़ के साथ चैट करें',
    'report.quickActions': 'त्वरित कार्य',
    
    // Chat
    'chat.placeholder': 'अपने अनुबंध के बारे में पूछें...',
    'chat.analyzeAnother': 'दूसरा अनुबंध विश्लेषण करें',
    'chat.consultLawyer': 'वकील से परामर्श करें',
    'chat.downloadReport': 'पूरी रिपोर्ट डाउनलोड करें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.close': 'बंद करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.submit': 'जमा करें',
    'common.retry': 'पुनः प्रयास',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.ok': 'ठीक है',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
