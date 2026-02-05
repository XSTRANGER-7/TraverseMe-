import React, { useState, useEffect } from "react";
import axios from "axios";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is this platform?",
      answer: "This platform is designed to showcase leaderboards, profiles, and rankings with interactive animations and themes.",
    },
    {
      question: "How can I participate?",
      answer: "You can participate by creating an account, uploading your profile, and completing tasks to earn badges and rankings.",
    },
    {
      question: "Are there any rules to follow?",
      answer: "Yes, users must adhere to community guidelines, avoid spam, and maintain respectful behavior.",
    },
  ];

  const rules = [
    "Be respectful to all users.",
    "No spamming or irrelevant content.",
    "Report any inappropriate behavior.",
    "Follow the platform's terms and conditions.",
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Example: Fetch data from an API
    axios.get("/api/data").then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <div className="bg-lightDark2 py-12 px-4 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl text-white font-semibold text-center mb-8">Instructions & FAQs</h2>

      {/* Rules Section */}
      <div className="mb-8 md:w-3/4 border-0 flex flex-col justify-center px-2 sm:px-10">
        <h3 className="text-4xl text-primary font-semibold mb-4">Rules</h3>
        <ul className="list-disc list-inside text-gray-300">
          {rules.map((rule, index) => (
            <li key={index} className="mb-2">{rule}</li>
          ))}
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="w-full px-2 sm:px-10 md:px-16 lg:px-20 mt-10">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6 border-b border-gray-600 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer hover:text-primary transition-colors duration-300"
              onClick={() => toggleFAQ(index)}
            >
              <h4 className="text-lg text-white font-medium">{faq.question}</h4>
              <span className="text-white text-xl">{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <p className="mt-4 text-gray-400 animate-fade-in">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
