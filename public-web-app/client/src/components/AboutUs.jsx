import React from "react";
import UserImg from "../assets/user.png";

function AboutUs() {
  const teamMembers = [
    {
      name: "CHAMINDU INDUWARA",
      role: "Group Leader",
    },
    {
      name: "PRABODYA GUNASEKARA",
      role: "Frontend Developer",
    },
    {
      name: "ABEYSINGHE D M",
      role: "Mobile Developer",
    },
  ];
  return (
    <section id="about-us" className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 ">
        ABOUT US
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Our Team</h3>
          <p className="text-gray-600 mb-6">
            FlowX was developed by a team of passionate software engineering
            students from the National Institute of Business Management as part
            of their Machine Learning project.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden mb-2">
                <img
                  src={UserImg}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/96/96";
                    e.target.alt = "Team member placeholder";
                  }}
                />
              </div>
              <h4 className="font-medium text-gray-800 text-center">
                {member.name}
              </h4>
              <p className="text-sm text-gray-600 text-center">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
