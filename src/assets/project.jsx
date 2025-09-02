import React from "react";
import "../index.css";

// Data projects
const projectsData = [
    {
        id: 1,
        title: "E-commerce Website",
        description: "Website toko online dengan React dan Node.js",
        image: "/images/ecommerce.jpg"
    },
    {
        id: 2,
        title: "Mobile App",
        description: "Aplikasi mobile dengan React Native",
        image: "/images/mobile-app.jpg"
    },
    {
        id: 3,
        title: "Dashboard Admin",
        description: "Dashboard untuk manajemen data dengan chart dinamis",
        image: "/images/dashboard.jpg"
    }
];

// Komponen ProjectCard yang reusable
const ProjectCard = ({ title, description, image }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <img 
                src={image} 
                alt={title}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
};

export const Projects = () => {
    return (
        <div className="bg-black min-h-screen py-12 px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
                My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {projectsData.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                    />
                ))}
            </div>
        </div>
    );
};
export default Projects;