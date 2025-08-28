"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation data
const translations = {
  en: {
    // Header
    "header.title": "Call Center Feedback System",
    "header.subtitle": "Government of Chhattisgarh - Internal Portal",
    "header.ExecutiveLogin": "Executive Login",
    "header.adminLogin": "Admin Login",

    // Home Page
    "home.heroTitle": "Call Executive Portal",
    "home.heroSubtitle": "Record citizen feedback after resolving their queries",
    "home.startRecording": "Start Recording Feedback",
    "home.adminDashboard": "Admin Dashboard",
    "home.systemOverview": "System Overview",
    "home.systemDescription": "Streamlined feedback collection system for government call center operations",
    "home.callManagement": "Call Management",
    "home.callManagementDesc": "Record feedback for resolved citizen calls",
    "home.feedbackTracking": "Feedback Tracking",
    "home.feedbackTrackingDesc": "Track satisfaction levels and service quality",
    "home.adminOversight": "Admin Oversight",
    "home.adminOversightDesc": "Higher authorities can review and manage feedback",
    "home.realTimeReports": "Real-time Reports",
    "home.realTimeReportsDesc": "Instant reporting and analytics dashboard",
    "home.howToUse": "How to Use",
    "home.forExecutives": "For Call Executives",
    "home.forAdmins": "For Administrators",
    "home.step1Exec": "Login with your Executive credentials",
    "home.step2Exec": "After resolving a citizen's query, record their feedback",
    "home.step3Exec": "Enter call ID, citizen mobile, and satisfaction level",
    "home.step4Exec": "Submit feedback for administrative review",
    "home.step1Admin": "Access admin dashboard with supervisor credentials",
    "home.step2Admin": "Review all feedback submitted by call Executives",
    "home.step3Admin": "Monitor satisfaction levels and service quality",
    "home.step4Admin": "Update feedback status and take corrective actions",
    "home.govChhattisgarh": "District Administration Raipur",
    "home.callCenterSystem": "Call Center Management System",
    "home.copyright": "© 2025 District Administration Raipur. All rights reserved.",
    "home.internalUse": "Internal Use Only - Authorized Personnel",

    // Login Pages
    "login.backToHome": "Back to Home",
    "login.ExecutiveTitle": "Executive Login",
    "login.ExecutiveDesc": "Login to record citizen feedback after resolving calls",
    "login.adminTitle": "Admin Login",
    "login.adminDesc": "Access the administrative dashboard",
    "login.employeeId": "Employee ID",
    "login.employeeIdPlaceholder": "Enter your Employee ID (e.g., EXE001)",
    "login.username": "Username",
    "login.usernamePlaceholder": "Enter admin username",
    "login.password": "Password",
    "login.passwordPlaceholder": "Enter your password",
    "login.adminPasswordPlaceholder": "Enter admin password",
    "login.loginButton": "Login",
    "login.loggingIn": "Logging in...",
    "login.demoSystem": "Demo System:",
    "login.demoDesc": "Enter any Employee ID and password to login",
    "login.demoAdminDesc": "Enter any username and password to login",
    "login.example": "Example: ID123, password123",
    "login.adminExample": "Example: admin, password123",

    // Feedback Page
    "feedback.title": "Feedback Recording",
    "feedback.subtitle": "Call Executive Portal",
    "feedback.welcome": "Executive:",
    "feedback.logout": "Logout",
    "feedback.recordTitle": "Record Call Feedback",
    "feedback.recordDesc": "Record citizen feedback after resolving their query. Ensure all information is accurate.",
    "feedback.callId": "Call ID",
    "feedback.callIdPlaceholder": "Enter the call ID",
    "feedback.citizenMobile": "Citizen Mobile Number",
    "feedback.citizenMobilePlaceholder": "10-digit mobile number",
    "feedback.citizenName": "Citizen Name",
    "feedback.citizenNamePlaceholder": "Enter citizen's full name",
    "feedback.queryType": "Query Type",
    "feedback.queryTypePlaceholder": "e.g., Birth Certificate, Income Certificate, etc.",
    "feedback.satisfactionLevel": "Citizen Satisfaction Level",
    "feedback.satisfied": "Satisfied ✓ - Query resolved successfully",
    "feedback.notSatisfied": "Not Satisfied ✗ - Requires follow-up",
    "feedback.description": "Feedback Details",
    "feedback.descriptionPlaceholder":
      "Provide detailed feedback about the call, resolution provided, and citizen's response...",
    "feedback.guidelines": "Recording Guidelines:",
    "feedback.guideline1": "• Ensure all citizen information is accurate",
    "feedback.guideline2": "• Record feedback immediately after call completion",
    "feedback.guideline3": "• Provide detailed description of the resolution provided",
    "feedback.guideline4": '• Mark as "Not Satisfied" if follow-up is required',
    "feedback.recordButton": "Record Feedback",
    "feedback.recording": "Recording Feedback...",

    // Admin Dashboard
    "admin.title": "Administrative Dashboard",
    "admin.subtitle": "Call Center Oversight & Management",
    "admin.welcome": "Welcome,",
    "admin.totalFeedbacks": "Total Feedbacks",
    "admin.satisfied": "Satisfied",
    "admin.notSatisfied": "Not Satisfied",
    "admin.pending": "Pending",
    "admin.managementTitle": "Call Feedback Management",
    "admin.managementDesc": "Review and manage feedback recorded by call Executives",
    "admin.search": "Search",
    "admin.searchPlaceholder": "Search by Call ID, Mobile, or Description...",
    "admin.filterStatus": "Filter by Status",
    "admin.allStatus": "All Status",
    "admin.pendingStatus": "Pending",
    "admin.resolvedStatus": "Resolved",
    "admin.edit": "Edit",
    "admin.updateStatus": "Update Feedback Status",
    "admin.updateDesc": "Change the status of this feedback",
    "admin.currentStatus": "Current Status",
    "admin.markResolved": "Mark as Resolved",
    "admin.markPending": "Mark as Pending",
    "admin.noFeedback": "No feedback found",
    "admin.noFeedbackDesc": "Try adjusting your search or filter criteria",
    "admin.noFeedbackSubmitted": "No feedback has been submitted yet",
    "admin.recordedBy": "Recorded by Executive:",
    "admin.date": "Date:",
    "admin.needsFollowup": "Needs Follow-up",
    "admin.resolved": "Resolved",

    // Common
    "common.callId": "Call ID:",
    "common.citizen": "Citizen:",
    "common.mobile": "Mobile:",
    "common.query": "Query:",
  },
  hi: {
    // Header
    "header.title": "कॉल सेंटर फीडबैक सिस्टम",
    "header.subtitle": "छत्तीसगढ़ सरकार - आंतरिक पोर्टल",
    "header.ExecutiveLogin": "कार्यकारी लॉगिन",
    "header.adminLogin": "प्रशासक लॉगिन",

    // Home Page
    "home.heroTitle": "कॉल कार्यकारी पोर्टल",
    "home.heroSubtitle": "नागरिकों की समस्याओं का समाधान करने के बाद फीडबैक दर्ज करें",
    "home.startRecording": "फीडबैक रिकॉर्डिंग शुरू करें",
    "home.adminDashboard": "प्रशासक डैशबोर्ड",
    "home.systemOverview": "सिस्टम अवलोकन",
    "home.systemDescription": "सरकारी कॉल सेंटर संचालन के लिए सुव्यवस्थित फीडबैक संग्रह प्रणाली",
    "home.callManagement": "कॉल प्रबंधन",
    "home.callManagementDesc": "हल किए गए नागरिक कॉल के लिए फीडबैक रिकॉर्ड करें",
    "home.feedbackTracking": "फीडबैक ट्रैकिंग",
    "home.feedbackTrackingDesc": "संतुष्टि स्तर और सेवा गुणवत्ता को ट्रैक करें",
    "home.adminOversight": "प्रशासनिक निरीक्षण",
    "home.adminOversightDesc": "उच्च अधिकारी फीडबैक की समीक्षा और प्रबंधन कर सकते हैं",
    "home.realTimeReports": "रियल-टाइम रिपोर्ट",
    "home.realTimeReportsDesc": "तत्काल रिपोर्टिंग और एनालिटिक्स डैशबोर्ड",
    "home.howToUse": "उपयोग कैसे करें",
    "home.forExecutives": "कॉल कार्यकारियों के लिए",
    "home.forAdmins": "प्रशासकों के लिए",
    "home.step1Exec": "अपनी कार्यकारी साख के साथ लॉगिन करें",
    "home.step2Exec": "नागरिक की समस्या हल करने के बाद, उनका फीडबैक रिकॉर्ड करें",
    "home.step3Exec": "कॉल आईडी, नागरिक मोबाइल और संतुष्टि स्तर दर्ज करें",
    "home.step4Exec": "प्रशासनिक समीक्षा के लिए फीडबैक जमा करें",
    "home.step1Admin": "पर्यवेक्षक साख के साथ प्रशासक डैशबोर्ड तक पहुंचें",
    "home.step2Admin": "कॉल कार्यकारियों द्वारा जमा किए गए सभी फीडबैक की समीक्षा करें",
    "home.step3Admin": "संतुष्टि स्तर और सेवा गुणवत्ता की निगरानी करें",
    "home.step4Admin": "फीडबैक स्थिति अपडेट करें और सुधारात्मक कार्रवाई करें",
    "home.govChhattisgarh": "जिला प्रशासन, रायपुर",
    "home.callCenterSystem": "कॉल सेंटर प्रबंधन प्रणाली",
    "home.copyright": "© 2025 जिला प्रशासन, रायपुर। सभी अधिकार सुरक्षित।",
    "home.internalUse": "केवल आंतरिक उपयोग - अधिकृत कर्मचारी",

    // Login Pages
    "login.backToHome": "होम पर वापस",
    "login.ExecutiveTitle": "कार्यकारी लॉगिन",
    "login.ExecutiveDesc": "कॉल हल करने के बाद नागरिक फीडबैक रिकॉर्ड करने के लिए लॉगिन करें",
    "login.adminTitle": "प्रशासक लॉगिन",
    "login.adminDesc": "प्रशासनिक डैशबोर्ड तक पहुंचें",
    "login.employeeId": "कर्मचारी आईडी",
    "login.employeeIdPlaceholder": "अपनी कर्मचारी आईडी दर्ज करें (जैसे, EXE001)",
    "login.username": "उपयोगकर्ता नाम",
    "login.usernamePlaceholder": "प्रशासक उपयोगकर्ता नाम दर्ज करें",
    "login.password": "पासवर्ड",
    "login.passwordPlaceholder": "अपना पासवर्ड दर्ज करें",
    "login.adminPasswordPlaceholder": "प्रशासक पासवर्ड दर्ज करें",
    "login.loginButton": "लॉगिन",
    "login.loggingIn": "लॉगिन हो रहा है...",
    "login.demoSystem": "डेमो सिस्टम:",
    "login.demoDesc": "लॉगिन करने के लिए कोई भी कर्मचारी आईडी और पासवर्ड दर्ज करें",
    "login.demoAdminDesc": "लॉगिन करने के लिए कोई भी उपयोगकर्ता नाम और पासवर्ड दर्ज करें",
    "login.example": "उदाहरण: ID123, password123",
    "login.adminExample": "उदाहरण: admin, password123",

    // Feedback Page
    "feedback.title": "फीडबैक रिकॉर्डिंग",
    "feedback.subtitle": "कॉल कार्यकारी पोर्टल",
    "feedback.welcome": "कार्यकारी:",
    "feedback.logout": "लॉगआउट",
    "feedback.recordTitle": "कॉल फीडबैक रिकॉर्ड करें",
    "feedback.recordDesc": "नागरिक की समस्या हल करने के बाद उनका फीडबैक रिकॉर्ड करें। सुनिश्चित करें कि सभी जानकारी सटीक है।",
    "feedback.callId": "कॉल आईडी",
    "feedback.callIdPlaceholder": "कॉल आईडी दर्ज करें",
    "feedback.citizenMobile": "नागरिक मोबाइल नंबर",
    "feedback.citizenMobilePlaceholder": "10-अंकीय मोबाइल नंबर",
    "feedback.citizenName": "नागरिक का नाम",
    "feedback.citizenNamePlaceholder": "नागरिक का पूरा नाम दर्ज करें",
    "feedback.queryType": "प्रश्न प्रकार",
    "feedback.queryTypePlaceholder": "जैसे, जन्म प्रमाण पत्र, आय प्रमाण पत्र, आदि।",
    "feedback.satisfactionLevel": "नागरिक संतुष्टि स्तर",
    "feedback.satisfied": "संतुष्ट ✓ - समस्या सफलतापूर्वक हल हुई",
    "feedback.notSatisfied": "असंतुष्ट ✗ - फॉलो-अप की आवश्यकता",
    "feedback.description": "फीडबैक विवरण",
    "feedback.descriptionPlaceholder":
      "कॉल, प्रदान किए गए समाधान और नागरिक की प्रतिक्रिया के बारे में विस्तृत फीडबैक प्रदान करें...",
    "feedback.guidelines": "रिकॉर्डिंग दिशानिर्देश:",
    "feedback.guideline1": "• सुनिश्चित करें कि सभी नागरिक जानकारी सटीक है",
    "feedback.guideline2": "• कॉल पूरा होने के तुरंत बाद फीडबैक रिकॉर्ड करें",
    "feedback.guideline3": "• प्रदान किए गए समाधान का विस्तृत विवरण दें",
    "feedback.guideline4": '• यदि फॉलो-अप की आवश्यकता है तो "असंतुष्ट" के रूप में चिह्नित करें',
    "feedback.recordButton": "फीडबैक रिकॉर्ड करें",
    "feedback.recording": "फीडबैक रिकॉर्ड हो रहा है...",

    // Admin Dashboard
    "admin.title": "प्रशासनिक डैशबोर्ड",
    "admin.subtitle": "कॉल सेंटर निरीक्षण और प्रबंधन",
    "admin.welcome": "स्वागत,",
    "admin.totalFeedbacks": "कुल फीडबैक",
    "admin.satisfied": "संतुष्ट",
    "admin.notSatisfied": "असंतुष्ट",
    "admin.pending": "लंबित",
    "admin.managementTitle": "कॉल फीडबैक प्रबंधन",
    "admin.managementDesc": "कॉल कार्यकारियों द्वारा रिकॉर्ड किए गए फीडबैक की समीक्षा और प्रबंधन करें",
    "admin.search": "खोजें",
    "admin.searchPlaceholder": "कॉल आईडी, मोबाइल या विवरण द्वारा खोजें...",
    "admin.filterStatus": "स्थिति के अनुसार फ़िल्टर करें",
    "admin.allStatus": "सभी स्थिति",
    "admin.pendingStatus": "लंबित",
    "admin.resolvedStatus": "हल हुआ",
    "admin.edit": "संपादित करें",
    "admin.updateStatus": "फीडबैक स्थिति अपडेट करें",
    "admin.updateDesc": "इस फीडबैक की स्थिति बदलें",
    "admin.currentStatus": "वर्तमान स्थिति",
    "admin.markResolved": "हल के रूप में चिह्नित करें",
    "admin.markPending": "लंबित के रूप में चिह्नित करें",
    "admin.noFeedback": "कोई फीडबैक नहीं मिला",
    "admin.noFeedbackDesc": "अपनी खोज या फ़िल्टर मानदंड को समायोजित करने का प्रयास करें",
    "admin.noFeedbackSubmitted": "अभी तक कोई फीडबैक जमा नहीं किया गया है",
    "admin.recordedBy": "कार्यकारी द्वारा रिकॉर्ड किया गया:",
    "admin.date": "दिनांक:",
    "admin.needsFollowup": "फॉलो-अप की आवश्यकता",
    "admin.resolved": "हल हुआ",

    // Common
    "common.callId": "कॉल आईडी:",
    "common.citizen": "नागरिक:",
    "common.mobile": "मोबाइल:",
    "common.query": "प्रश्न:",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
