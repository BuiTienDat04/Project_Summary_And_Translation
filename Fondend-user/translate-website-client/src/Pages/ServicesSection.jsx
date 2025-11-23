import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaRegNewspaper,
  FaUserEdit,
  FaBullhorn,
  FaUser,
  FaBook,
  FaUserTie,
  FaPenNib,
  FaBookOpen,
  FaBuilding,
  FaSitemap,
} from "react-icons/fa";

const ServicesSection = () => {
  const servicesList = [
    {
      title: "STUDENTS",
      description: "With PDFSmart, summarize your lessons and Wikipedia pages in seconds to boost your learning productivity.",
      icon: <FaUserGraduate />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "PROFESSORS",
      description: "Identify the most important ideas and arguments of a text so you can prepare your lessons.",
      icon: <FaChalkboardTeacher />,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "JOURNALISTS",
      description: "If you like summarized information of the important main events, then PDFSmart is for you!",
      icon: <FaRegNewspaper />,
      gradient: "from-red-500 to-orange-500",
    },
    {
      title: "EDITORS",
      description: "Identify and understand very quickly the events and ideas of your texts.",
      icon: <FaUserEdit />,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "PRESS RELEASE",
      description: "With the help of PDFSmart, get to the main idea of your articles to write your arguments and critiques.",
      icon: <FaBullhorn />,
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      title: "READERS",
      description: "Save time to summarize your documents, grasp the relevant information quickly.",
      icon: <FaUser />,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      title: "LIBRARIES",
      description: "Need to summarize your book's presentations? Identify the arguments in a few seconds.",
      icon: <FaBook />,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      title: "LIBRARIANS",
      description: "Too much material? Simplify your reading, make your reading easier with PDFSmart as a desktop tool.",
      icon: <FaUserTie />,
      gradient: "from-rose-500 to-pink-500",
    },
    {
      title: "WRITERS",
      description: "Need to summarize your chapters? With PDFSmart, get to the heart of your ideas.",
      icon: <FaPenNib />,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "PUBLISHERS",
      description: "Quickly identify your books or author's ideas. Summarize the most important key points.",
      icon: <FaBookOpen />,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "MUSEUMS",
      description: "From now on, create quick summaries of your artists' presentations and their artworks.",
      icon: <FaBuilding />,
      gradient: "from-lime-500 to-green-500",
    },
    {
      title: "ORGANIZATIONS",
      description: "Identify the most important passages in texts that contain a lot of words for detailed analysis.",
      icon: <FaSitemap />,
      gradient: "from-sky-500 to-blue-500",
    },
  ];

  return (
    <section id="services-section" className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Who is PDFSmart For?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover how PDFSmart empowers professionals across various fields to work smarter and achieve more
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-3 border border-white/20"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl"></div>
              </div>

              {/* Icon Container */}
              <div className="relative z-10 flex justify-center mb-6">
                <div className={`relative p-5 bg-gradient-to-br ${service.gradient} rounded-2xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <span className="text-2xl text-white drop-shadow-lg">{service.icon}</span>
                  {/* Sparkle Effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className={`text-lg font-bold mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {service.description}
                </p>
              </div>

              {/* Hover Indicator */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${service.gradient} group-hover:w-3/4 transition-all duration-500 rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who are already using PDFSmart to save time and boost productivity
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient-animation 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;