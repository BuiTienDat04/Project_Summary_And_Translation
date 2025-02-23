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
    <section id="services-section" className="container mx-auto mt-10 px-6 py-10 text-center">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6 uppercase">
        Who is PDFSmart For?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-300 border-2 border-gray-50"
          >
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <span className="text-2xl">{service.icon}</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 text-center">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;