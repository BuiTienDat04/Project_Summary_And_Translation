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
    },
    {
      title: "PROFESSORS",
      description: "Identify the most important ideas and arguments of a text so you can prepare your lessons.",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "JOURNALISTS",
      description: "If you like summarized information of the important main events, then PDFSmart is for you!",
      icon: <FaRegNewspaper />,
    },
    {
      title: "EDITORS",
      description: "Identify and understand very quickly the events and ideas of your texts.",
      icon: <FaUserEdit />,
    },
    {
      title: "PRESS RELEASE",
      description: "With the help of PDFSmart, get to the main idea of your articles to write your arguments and critiques.",
      icon: <FaBullhorn />,
    },
    {
      title: "READERS",
      description: "Save time to summarize your documents, grasp the relevant information quickly.",
      icon: <FaUser />,
    },
    {
      title: "LIBRARIES",
      description: "Need to summarize your book's presentations? Identify the arguments in a few seconds.",
      icon: <FaBook />,
    },
    {
      title: "LIBRARIANS",
      description: "Too much material? Simplify your reading, make your reading easier with PDFSmart as a desktop tool.",
      icon: <FaUserTie />,
    },
    {
      title: "WRITERS",
      description: "Need to summarize your chapters? With PDFSmart, get to the heart of your ideas.",
      icon: <FaPenNib />,
    },
    {
      title: "PUBLISHERS",
      description: "Quickly identify your books or author's ideas. Summarize the most important key points.",
      icon: <FaBookOpen />,
    },
    {
      title: "MUSEUMS",
      description: "From now on, create quick summaries of your artists' presentations and their artworks.",
      icon: <FaBuilding />,
    },
    {
      title: "ORGANIZATIONS",
      description: "Identify the most important passages in texts that contain a lot of words for detailed analysis.",
      icon: <FaSitemap />,
    },
  ];

  return (
    <section id="services-section" className="container mx-auto mt-10 px-6 py-16 text-center">
      {/* Tiêu đề với hiệu ứng gradient động */}
      <h2 className="text-3xl md:text-4xl font-bold mb-12 uppercase animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Who is PDFSmart For?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesList.map((service, index) => (
          <div
            key={index}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-2 relative overflow-hidden"
          >
            {/* Hiệu ứng background hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon với hiệu ứng đổ bóng và màu sắc */}
            <div className="relative z-10 flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                <span className="text-3xl text-white">{service.icon}</span>
              </div>
            </div>

            {/* Nội dung với hiệu ứng chữ */}
            <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-4 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500">
              {service.title}
            </h3>
            <p className="relative z-10 text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-500">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* Thêm style cho animation */}
      <style jsx global>{`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient-animation 3s linear infinite;
        }

        .hover\:shadow-morph:hover {
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2),
                     0 0 20px rgba(168, 85, 247, 0.1),
                     0 0 30px rgba(236, 72, 153, 0.1);
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;