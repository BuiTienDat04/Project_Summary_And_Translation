import React from "react";
import {
  DocumentTextIcon,
  GlobeAltIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import {
  SparklesIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";

const TextSummaryFeatures = () => {
  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-indigo-100 font-sans">
      {/* Header Section */}
      <div className="text-center mb-12 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          <span className="animate-gradient bg-clip-text text-transparent bg-[length:400%] bg-gradient-to-r from-blue-500 to-green-500 block">
            TextSum - Smart Summarization & Translation
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Unlock the power of concise insights with TextSum. Whether you input text, upload a PDF, or paste a URL, our AI delivers razor-sharp summaries and seamless translations in seconds—bridging languages and simplifying complexity.
        </p>

        <div className="inline-flex items-center bg-blue-100/50 px-6 py-2 rounded-full text-base font-semibold text-blue-700 mt-8">
          <SparklesIcon className="w-5 h-5 mr-2" />
          Precision Meets Speed
        </div>

        <style jsx global>{`
          @keyframes gradient-wave {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            animation: gradient-wave 6s ease infinite;
          }
        `}</style>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        <FeatureCard
          icon={<DocumentTextIcon className="h-9 w-9 text-blue-600" />}
          title="Instant Text Summarization"
          features={[
            "Paste any text for a swift, focused summary",
            "Translate results into over 50 languages",
            "Intuitive design for effortless use",
            "Capture the essence without the noise"
          ]}
          color="blue"
        />

        <FeatureCard
          icon={<GlobeAltIcon className="h-9 w-9 text-green-600" />}
          title="PDF Summary Mastery"
          features={[
            "Upload PDFs for instant core content extraction",
            "Handles multi-page documents with ease",
            "Translate summaries into your preferred language",
            "Precision-crafted insights from every page"
          ]}
          color="green"
        />

        <FeatureCard
          icon={<LinkIcon className="h-9 w-9 text-purple-600" />}
          title="URL-Powered Summaries"
          features={[
            "Drop a URL to distill web content instantly",
            "Filters out ads and irrelevant fluff",
            "One-click translation to any language",
            "From sprawling articles to key takeaways"
          ]}
          color="purple"
        />
      </div>

      {/* Advantage Section */}
      {/* Advantage Section */}
      <div className="mt-16 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-4xl font-bold text-gray-900">
              <span className="animate-gradient bg-clip-text text-transparent bg-[length:400%] bg-gradient-to-r from-purple-400 to-blue-400">
                Why PDFSmart Stands Out
              </span>
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              PDFSmart simplifies information processing—offering clear, concise summaries and seamless translations for any content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Efficiency Section */}
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-blue-100/50 rounded-xl">
                  <RocketLaunchIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Effortless Speed</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get results instantly with:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      "Instant summaries in just seconds",
                      "AI-driven accuracy that understands context",
                      "Seamless access across web and mobile"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Customization Section */}
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-green-100/50 rounded-xl">
                  <SparklesIcon className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Smart Adaptability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Designed to fit your needs with:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      "Concise summaries tailored to your content",
                      "Supports over 20 languages effortlessly",
                      "Integrates smoothly across all platforms"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, features, color }) => {
  const colorVariants = {
    blue: "from-blue-50/70 to-blue-100/30 hover:border-blue-200",
    green: "from-green-50/70 to-green-100/30 hover:border-green-200",
    purple: "from-purple-50/70 to-purple-100/30 hover:border-purple-200",
  };

  return (
    <div
      className={`relative p-8 rounded-2xl bg-gradient-to-b ${colorVariants[color]} border-2 border-transparent hover:shadow-xl transition-all duration-300 group hover:-translate-y-2`}
    >
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity -z-[1]">
        {React.cloneElement(icon, { className: "h-24 w-24" })}
      </div>
      <div className="flex items-start mb-6 space-x-4">
        <div className="p-3.5 rounded-xl bg-white shadow-sm border border-gray-100">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mt-1.5">{title}</h3>
      </div>
      <ul className="space-y-3.5">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-600">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 mt-1 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700 leading-relaxed font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextSummaryFeatures;