import React from "react";
import {
  DocumentTextIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CameraIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

import {
  SparklesIcon,
  FingerPrintIcon,
  CheckCircleIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  ArrowRightIcon
} from "@heroicons/react/24/solid";


const PDFSmartFeatures = () => {
  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50/30">
      <div className="text-center mb-20 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            PDFSmart
          </span> - Intelligent Document Processing Suite
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          PDFSmart revolutionizes document workflows with AI-powered tools for content summarization,
          intelligent data extraction, and multilingual translation. Our advanced platform helps professionals
          and organizations save 15+ hours weekly on document processing while maintaining 99.8% accuracy.
        </p>

        <div className="inline-flex items-center bg-blue-100/50 px-6 py-2 rounded-full text-sm font-semibold text-blue-700 mt-8">
          <ShieldCheckIcon className="w-5 h-5 mr-2" />
          Trusted by 850K+ users worldwide
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        <FeatureCard
          icon={<DocumentTextIcon className="h-9 w-9 text-blue-600" />}
          title="AI-Powered Summarization"
          features={[
            "Advanced NLP algorithms analyze document structure",
            "Supports 15+ file formats including PDF/DOCX/PPTX",
            "Customizable summary length (10%-75% of original)",
            "Key point extraction with priority ranking"
          ]}
          color="blue"
        />

        <FeatureCard
          icon={<AcademicCapIcon className="h-9 w-9 text-purple-600" />}
          title="PDF Intelligence Suite"
          features={[
            "Multi-page PDF content extraction",
            "Smart table recognition & formatting",
            "Batch processing (up to 500 files simultaneously)",
            "Metadata management & redaction tools"
          ]}
          color="purple"
        />

        <FeatureCard
          icon={<GlobeAltIcon className="h-9 w-9 text-green-600" />}
          title="Multilingual Translation"
          features={[
            "54 supported languages with dialect recognition",
            "Context-aware translation technology",
            "Real-time collaborative editing",
            "Industry-specific terminology packs"
          ]}
          color="green"
        />

        <FeatureCard
          icon={<CameraIcon className="h-9 w-9 text-orange-600" />}
          title="Advanced OCR Engine"
          features={[
            "98.9% accuracy handwritten text recognition",
            "Image-to-text conversion with layout retention",
            "Multi-column document analysis",
            "Export to editable formats (DOCX, XLSX, HTML)"
          ]}
          color="orange"
        />

        <FeatureCard
          icon={<UserCircleIcon className="h-9 w-9 text-pink-600" />}
          title="Smart Collaboration"
          features={[
            "Role-based access control",
            "Version history & change tracking",
            "Cross-platform synchronization",
            "Real-time commenting & annotations"
          ]}
          color="pink"
        />

        <FeatureCard
          icon={<ShieldCheckIcon className="h-9 w-9 text-indigo-600" />}
          title="Enterprise Security"
          features={[
            "256-bit AES encryption with SSL/TLS",
            "GDPR & HIPAA compliant infrastructure",
            "Automated document shredding",
            "SOC 2 Type II certified"
          ]}
          color="indigo"
        />
      </div>

      <div className="mt-24 py-16 bg-gradient-to-br from-blue-50/40 to-indigo-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <h2 className="text-4xl font-bold text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                The PDFSmart Advantage
              </span>
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              While many solutions offer basic document processing, PDFSmart delivers true enterprise-grade capabilities through:

              <div className="mt-8 flex justify-center gap-6 flex-wrap">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <SparklesIcon className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium">AI-Powered Automation</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Military-Grade Security</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <GlobeAltIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Global Infrastructure</span>
                </div>
              </div>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Security Column */}
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-blue-100/50 rounded-xl">
                  <FingerPrintIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Zero-Trust Security Architecture</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every document processed through PDFSmart benefits from:
                    <ul className="mt-3 space-y-2">
                      {[
                        '256-bit AES encryption at rest and in transit',
                        'SOC 2 Type II & ISO 27001 certified',
                        'GDPR/CCPA compliant data handling',
                        'Biometric access controls'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="p-3 bg-purple-100/50 rounded-xl">
                  <CpuChipIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Enterprise-Grade Reliability</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { metric: '99.995%', label: 'Uptime SLA' },
                      { metric: '<900ms', label: 'Avg Response' },
                      { metric: '60+', label: 'Global Regions' },
                      { metric: '24/7', label: 'Support' }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">{stat.metric}</div>
                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Productivity Column */}
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-green-100/50 rounded-xl">
                  <RocketLaunchIcon className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Productivity Multipliers</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our users report average efficiency gains of 68% across key workflows:
                    <div className="mt-4 space-y-4">
                      {[
                        { label: 'Document Review Time', value: '↓ 72%' },
                        { label: 'Processing Costs', value: '↓ 65%' },
                        { label: 'Team Collaboration', value: '↑ 80%' }
                      ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-100">
                          <span className="text-gray-700">{metric.label}</span>
                          <span className="font-semibold text-blue-600">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200/80 pt-8 mt-8">
                <div className="text-center space-y-6">
                  <p className="text-sm text-gray-500">
                    GDPR/CCPA compliant • PCI DSS Level 1 certified <br />
                    Trusted by 850K+ teams including:
                  </p>
                  
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
    blue: 'from-blue-50/70 to-blue-100/30 hover:border-blue-200',
    purple: 'from-purple-50/70 to-purple-100/30 hover:border-purple-200',
    green: 'from-green-50/70 to-green-100/30 hover:border-green-200',
    orange: 'from-orange-50/70 to-orange-100/30 hover:border-orange-200',
    pink: 'from-pink-50/70 to-pink-100/30 hover:border-pink-200',
    indigo: 'from-indigo-50/70 to-indigo-100/30 hover:border-indigo-200',
  };

  return (
    <div className={`relative p-8 rounded-2xl bg-gradient-to-b ${colorVariants[color]} border-2 border-transparent hover:shadow-xl transition-all duration-300 group hover:-translate-y-2`}>
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity -z-[1]">
        {React.cloneElement(icon, { className: "h-24 w-24" })}
      </div>
      <div className="flex items-start mb-6 space-x-4">
        <div className={`p-3.5 rounded-xl bg-white shadow-sm border border-gray-100`}>
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

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default PDFSmartFeatures;