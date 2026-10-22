import React from "react";
import emblemLogo from "../assets/images/cropguard_creative_fullfit_logo_1789282729066.jpg";
import {
  ShieldCheck,
  Camera,
  MapPin,
  CloudSun,
  Coins,
  Database,
  Lock,
  ArrowLeft,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  ExternalLink,
  Smartphone,
  Eye,
  RefreshCw,
} from "lucide-react";

interface PrivacyPolicyProps {
  onBackToApp?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBackToApp }) => {
  const handleBack = () => {
    if (onBackToApp) {
      onBackToApp();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 transition-colors">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border-b border-stone-200 dark:border-zinc-800 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md shadow-emerald-600/20 border-2 border-emerald-500/40 bg-emerald-950 flex items-center justify-center shrink-0">
              <img
                src={emblemLogo}
                alt="CropGuard Logo"
                className="w-full h-full object-cover select-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-emerald-700 dark:text-emerald-400">
                  CropGuard
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Privacy Policy
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 hidden sm:block">
                Smart Crop Health & Farmer Precision Agriculture
              </p>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to App</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title & Metadata Header Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-zinc-800 shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Official Legal Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-zinc-300 mb-6 leading-relaxed">
            CropGuard (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal data, field insights, and agricultural records. This Privacy Policy clearly outlines how information is gathered, processed, and safeguarded when using the CropGuard web app and mobile application.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100 dark:border-zinc-800 text-xs sm:text-sm text-stone-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Effective Date:</strong> October 22, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Last Updated:</strong> October 22, 2026</span>
            </div>
          </div>
        </div>

        {/* Informational Agriculture Disclaimer Banner */}
        <div className="rounded-2xl p-4 sm:p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-bold">Important Agricultural Decision-Support Notice:</strong> CropGuard provides AI-powered crop leaf disease diagnosis, pesticide spray dosage calculations, Mandi price trends, and weather forecasts strictly for <em>informational and decision-support purposes</em>. Farming decisions should always be cross-referenced with your local Krishi Vigyan Kendra (KVK), agronomist, or qualified agricultural extension officer.
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-8 text-stone-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">

          {/* 1. Introduction */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              1. Introduction
            </h2>
            <p className="mb-3">
              Welcome to <strong>CropGuard</strong> (accessible via our official web platform and Android application). We understand the importance of clear, honest privacy principles for farmers, agricultural students, agronomists, and rural communities.
            </p>
            <p>
              This Privacy Policy explains what information we collect when you use CropGuard, why we collect it, how it is handled, and what choices and control you maintain over your data. By accessing or using CropGuard, you agree to the practices described in this document.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information to provide, maintain, and optimize smart agricultural features—such as instant leaf disease diagnosis, localized weather alerts, knapsack spray calculations, and Mandi market rates.
            </p>
            <p>
              We only collect information necessary to fulfill these tools. You can use core parts of the application with minimal data entry, and you remain in control of device permissions (such as camera or location).
            </p>
          </section>

          {/* 3. Information Provided by Users */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              3. Information Provided by Users
            </h2>
            <p className="mb-3">When you register or personalize your farmer profile, you may optionally provide:</p>
            <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li><strong>Farmer Name:</strong> Used to personalize your advisory dashboard and diagnosis reports.</li>
              <li><strong>Mobile Phone Number or Email Address:</strong> Used for account sign-in, authentication sessions, and scan synchronization.</li>
              <li><strong>Farm State and District:</strong> Used to display relevant APMC Mandi commodity rates and regional weather.</li>
              <li><strong>Primary Crops & Land Area:</strong> Used for calculating farm tank spray volumes and agronomic recommendations.</li>
            </ul>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400">
              Note: You can choose not to provide optional profile fields, though certain customized calculations (like exact farm spray volume) depend on your inputs.
            </p>
          </section>

          {/* 4. Camera and Photo/Image Data */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              4. Camera and Photo/Image Data
            </h2>
            <p className="mb-3">
              CropGuard includes an AI crop disease diagnosis tool that requires visual input. When you choose to use this feature:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>
                <strong>Camera Permission:</strong> If you use the in-app camera, we request device camera permission exclusively to let you photograph plant leaves, buds, or flowers. You can revoke this permission anytime in your device settings.
              </li>
              <li>
                <strong>Gallery / File Upload:</strong> You may alternatively select an existing leaf or crop image from your device gallery.
              </li>
              <li>
                <strong>Strict Visual Classification:</strong> The application automatically validates that uploaded pictures represent agricultural plants or flowers. Images of human faces, selfies, pets, or non-agricultural objects are rejected and not diagnosed.
              </li>
            </ul>
          </section>

          {/* 5. Crop Disease Detection */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              5. Crop Disease Detection & Image Handling
            </h2>
            <p className="mb-3">
              When you submit a crop photo for diagnosis:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>
                <strong>Ephemeral AI Processing:</strong> The leaf image payload is securely transmitted over encrypted HTTPS to our backend analysis service to generate diagnosis, biological symptoms, and ICAR-recommended treatment guidance.
              </li>
              <li>
                <strong>Image Storage Implementation:</strong> In the current implementation of CropGuard, <em>raw photographic image binaries are processed in-memory for the duration of the analysis request and are NOT permanently stored on our servers</em>. Diagnostic metadata (such as the diagnosed crop name, disease name, severity level, and timestamp) is stored in your local browser cache (`localStorage`) and, if you are signed in, in your account scan records.
              </li>
              <li>
                <strong>Developer Confirmation Note:</strong> <em>[DEVELOPER NOTE: If future updates enable persistent cloud storage for original photo files, this section will be updated with retention schedules and user deletion controls.]</em>
              </li>
            </ul>
          </section>

          {/* 6. Location Information */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              6. Location Information
            </h2>
            <p className="mb-3">
              CropGuard offers localized features including farm weather forecasts, regional pest outbreak radars, nearby fertilizer dealer search, and local APMC Mandi rates.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li><strong>GPS Geolocation:</strong> With your explicit consent, CropGuard accesses coarse or fine geographic coordinates (latitude and longitude) to identify your local agricultural district.</li>
              <li><strong>Manual Selection Alternative:</strong> You can use CropGuard without granting GPS permission by manually selecting your State and District in the Mandi and Weather screens.</li>
              <li><strong>No Continuous Background Tracking:</strong> CropGuard does not track your movements in the background when the app is closed.</li>
            </ul>
          </section>

          {/* 7. Weather and Farm Advisory Data */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              7. Weather and Farm Advisory Data
            </h2>
            <p className="mb-3">
              To provide real-time temperature, humidity, rain probabilities, and spray window advisories, CropGuard queries trusted third-party meteorological services using your district or approximate coordinates.
            </p>
            <p>
              Weather queries are stateless and do not link your personal identity to meteorological queries.
            </p>
          </section>

          {/* 8. APMC/Mandi Market Rate Data */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              8. APMC/Mandi Market Rate Data
            </h2>
            <p className="mb-3">
              CropGuard retrieves wholesale agricultural commodity prices from publicly available government APMC Mandi portals and open agricultural data feeds.
            </p>
            <p>
              Searches performed for crop prices (such as Wheat, Paddy, Cotton, or Tomato rates) are used strictly to return current modal prices and are not sold or shared with commodity brokers.
            </p>
          </section>

          {/* 9. How We Use Information */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              9. How We Use Information
            </h2>
            <p className="mb-3">We use collected information solely for legitimate agricultural application functions, including:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Delivering automated crop disease diagnosis and ICAR-aligned chemical/organic remedy advice.</li>
              <li>Calculating precise knapsack sprayer tank dosages and water volumes to prevent chemical over-spraying.</li>
              <li>Displaying localized weather forecasts and safe pesticide spray windows.</li>
              <li>Displaying current daily APMC Mandi commodity rates for your selected state and district.</li>
              <li>Maintaining your offline handbook and personal scan history across sessions.</li>
              <li>Preventing system abuse, security breaches, and fraudulent access.</li>
            </ul>
          </section>

          {/* 10. How We Share Information */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              10. How We Share Information
            </h2>
            <p className="mb-3">
              <strong>We do NOT sell, rent, or trade your personal information or farm records to data brokers, advertising aggregators, or third parties.</strong>
            </p>
            <p className="mb-3">Information is shared strictly under the following narrow circumstances:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Service Providers:</strong> Secure infrastructure partners (such as database hosting and AI model processing) that process data solely on our behalf under confidentiality obligations.</li>
              <li><strong>Legal Compliance:</strong> If required by applicable law, regulation, legal process, or governmental request.</li>
              <li><strong>Safety & Protection:</strong> To protect the rights, property, and safety of CropGuard users and the public.</li>
            </ul>
          </section>

          {/* 11. Third-Party Services */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              11. Third-Party Services
            </h2>
            <p className="mb-3">
              CropGuard integrates carefully selected third-party APIs to deliver specialized capabilities:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li><strong>Google Gemini AI:</strong> Used to analyze leaf pathology and generate agronomic advice. Requests are transmitted via secure HTTPS.</li>
              <li><strong>Google Maps & Places APIs:</strong> Used in the Fertilizer Shop Finder and geocoding services to locate nearby Krishi Kendras and agricultural supply stores.</li>
              <li><strong>Public Weather & Mandi APIs:</strong> Used to fetch current atmospheric conditions and agricultural commodity rates.</li>
            </ul>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400">
              These third-party providers process technical request parameters in accordance with their respective privacy policies.
            </p>
          </section>

          {/* 12. Supabase and Data Storage */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              12. Supabase and Data Storage
            </h2>
            <p className="mb-3">
              CropGuard integrates <strong>Supabase</strong> (an open-source cloud database and authentication provider built on PostgreSQL) to provide user account sessions and cloud synchronization for scan history:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li><strong>Farmer Account Data:</strong> When you sign up, your farmer ID, profile name, and phone/email are stored in your project&apos;s secured Supabase database.</li>
              <li><strong>Scan Records:</strong> Diagnosis summaries (crop name, detected pathology, severity rating, and recommended treatment) are stored to let you review your farm history.</li>
              <li><strong>Local-First Fallback:</strong> CropGuard uses local device storage (`localStorage`) so you can access your handbook and past scans even when offline.</li>
            </ul>
          </section>

          {/* 13. Google AdMob / Advertising */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              13. Google AdMob / Advertising
            </h2>
            <p className="mb-3">
              CropGuard is currently integrated with <strong>Google AdMob</strong> in its native mobile (Android) distribution to support free access to smart farming tools through non-intrusive banner and interstitial advertisements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li><strong>Advertising Identifiers:</strong> In mobile app builds, Google AdMob and its advertising partners may collect and process device-specific information, advertising identifiers (such as Android Advertising ID), general device models, and app interaction data.</li>
              <li><strong>Personalized vs. Non-Personalized Ads:</strong> Depending on your device settings and privacy consent choices, ads may be personalized based on your interests or non-personalized.</li>
              <li><strong>Web Application Note:</strong> On the web version of CropGuard, banner placeholders are designed for platform updates and agricultural advisories.</li>
              <li><strong>Third-Party Policy:</strong> Google AdMob data processing is governed by the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-medium">Google Privacy & Terms Policy</a>.</li>
            </ul>
          </section>

          {/* 14. Cookies and Similar Technologies */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              14. Cookies and Local Storage
            </h2>
            <p className="mb-3">
              CropGuard does not use intrusive third-party cross-site tracking cookies. We utilize standard web storage technologies (`localStorage` and progressive web app service worker caches) solely for essential application operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Remembering your selected language preference (e.g. English, Hindi, Punjabi, Marathi, Telugu, Tamil, etc.).</li>
              <li>Preserving your light/dark display theme preference.</li>
              <li>Caching the offline crop diagnostic handbook for access in remote fields without cellular connectivity.</li>
              <li>Maintaining your active login session token.</li>
            </ul>
          </section>

          {/* 15. Data Security */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              15. Data Security
            </h2>
            <p className="mb-3">
              We implement industry-standard administrative and technical safeguards to protect your information against unauthorized access, loss, or misuse:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li>All network transmissions use Secure Sockets Layer / Transport Layer Security (HTTPS/TLS) encryption.</li>
              <li>Database access is guarded by authentication controls and role-based policies.</li>
              <li>API proxy layers prevent exposure of private infrastructure credentials to client browsers.</li>
            </ul>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400">
              While we take rigorous measures to safeguard data, no transmission over the Internet can be guaranteed 100% secure. We encourage users to maintain secure login credentials.
            </p>
          </section>

          {/* 16. Data Retention */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              16. Data Retention
            </h2>
            <p className="mb-3">
              We retain personal information and scan records only as long as necessary to provide CropGuard services or until you choose to delete them:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Local scan history can be deleted instantly by clearing browser storage or tapping &quot;Clear Scan History&quot; in the application.</li>
              <li>Account records are retained while your account remains active. You may request account deletion at any time by contacting our support team.</li>
            </ul>
          </section>

          {/* 17. User Rights and Choices */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              17. User Rights and Choices
            </h2>
            <p className="mb-3">You retain full rights and choices regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li><strong>Access & Review:</strong> You can view all past crop diagnosis records in your Scan History tab.</li>
              <li><strong>Profile Updates:</strong> You can edit your name, phone/email, and farm location anytime from the Farmer Profile modal.</li>
              <li><strong>Device Permissions:</strong> You can grant or revoke Camera and Location permissions anytime through your browser or device operating system settings.</li>
              <li><strong>Data Deletion Request:</strong> You can request complete erasure of your account and associated database records by contacting us at our designated privacy contact.</li>
            </ul>
          </section>

          {/* 18. Children's Privacy */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              18. Children&apos;s Privacy
            </h2>
            <p className="mb-3">
              CropGuard is an agricultural productivity tool intended for farmers, agricultural students, and farming professionals. It is not directed to children under 13 years of age (or under 16 where applicable by regional law).
            </p>
            <p>
              We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us immediately, and we will promptly remove the information.
            </p>
          </section>

          {/* 19. Third-Party Links and Services */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              19. Third-Party Links and External Services
            </h2>
            <p className="mb-3">
              CropGuard may provide outbound links to third-party portals, including official Indian Government agricultural schemes (such as PM-KISAN, PMFBY, Soil Health Card Portal), Google Maps dealer listings, or official ICAR research pages.
            </p>
            <p>
              We are not responsible for the privacy practices, content, or compliance of external websites. We advise users to review the privacy policies of any third-party website they visit.
            </p>
          </section>

          {/* 20. Changes to This Privacy Policy */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              20. Changes to This Privacy Policy
            </h2>
            <p className="mb-3">
              We may periodically update this Privacy Policy to reflect app improvements, new agricultural features, or evolving regulatory requirements.
            </p>
            <p>
              When updates are published, the &quot;Last Updated&quot; date at the top of this page will be revised. Significant modifications will be highlighted through prominent notice inside the application.
            </p>
          </section>

          {/* 21. Contact Us */}
          <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-emerald-300 dark:border-emerald-800/80 shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              21. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions, concerns, or privacy requests regarding this Privacy Policy or your personal agricultural data, please contact the CropGuard team:
            </p>
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl p-4 sm:p-5 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Application Name:</strong> CropGuard
              </p>
              <p>
                <strong>Developer & App Owner:</strong> CropGuard Precision Agriculture Team
              </p>
              <p>
                <strong>Privacy & Support Inquiries Email:</strong>{" "}
                <a
                  href="mailto:[YOUR PRIVACY EMAIL]?subject=CropGuard%20Privacy%20Inquiry"
                  className="font-mono font-semibold text-emerald-700 dark:text-emerald-300 underline"
                >
                  [YOUR PRIVACY EMAIL]
                </a>
              </p>
              <p>
                <strong>Official Web Platform:</strong>{" "}
                <a
                  href="https://cropguardaimtr.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-emerald-300 underline"
                >
                  https://cropguardaimtr.netlify.app/
                </a>
              </p>
              <p className="text-stone-500 dark:text-zinc-400 text-xs mt-2 italic">
                * Please replace [YOUR PRIVACY EMAIL] with your dedicated email address (e.g. support@cropguard.app or beast.18201@gmail.com) when ready.
              </p>
            </div>
          </section>

        </div>

        {/* Bottom Return Action */}
        <div className="mt-12 text-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-102"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Return to CropGuard Application</span>
          </button>
          <p className="text-xs text-stone-500 dark:text-zinc-500 mt-4">
            &copy; 2026 CropGuard. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};
