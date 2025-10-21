import { FaGithub } from "react-icons/fa";

const About = () => {
  return (
    <section>
      <div className="text-center max-w-[1500px] px-4 mx-auto py-8">
        {/* Header */}
        <h2 className="text-4xl font-bold text-primary mb-6">
          About the Developer
        </h2>
        <p className="text-lg text-gray-700 mb-3">
          Hello! I'm{" "}
          <span className="text-primary font-semibold">Sarfaraz Akram</span>, a
          dedicated and passionate full-stack web developer from Bangladesh.
        </p>
        <p className="text-gray-700 text-base mb-12 leading-relaxed">
          My expertise lies in crafting dynamic, responsive, and user-friendly
          web applications using technologies like <strong>React.js</strong>,{" "}
          <strong>Tailwind CSS</strong>, <strong>Firebase</strong>,{" "}
          <strong>MongoDB</strong>, and <strong>Express.js</strong>. I’m driven
          by clean code, great user experiences, and scalable backend solutions.
        </p>

        {/* Projects */}
        <h3 className="text-3xl font-bold text-primary mb-8">
          🛠️ Other Featured Projects
        </h3>

        <div className="grid gap-4 md:grid-cols-2 text-left">
          {/* Portfolio */}
          <div className="bg-white border-2 border-transparent hover:border-secondary p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">👨‍💻</span>
              <h4 className="text-2xl font-bold text-primary">Portfolio</h4>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              My personal developer portfolio showcasing my full-stack projects,
              skills.
            </p>
            <a
              href="https://sarfarazakram.netlify.app"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Visit Portfolio
            </a>
          </div>

          {/* Sam's Kitchen */}
          <div className="bg-white border-2 border-transparent hover:border-secondary p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://i.ibb.co.com/RpJLT7dR/logo.png"
                alt="Sam's Kitchen"
                className="h-12 w-auto"
              />
              <h4 className="text-2xl font-bold text-primary">Sam's Kitchen</h4>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Sam's Kitchen is a food delivery and management platform where
              users can order food, riders can deliver orders, and admins can
              manage the entire kitchen system, including foods, payments, and
              rider assignments.
            </p>
            <div className="flex justify-between items-center">
              <a
                href="https://sams-kitchen.netlify.app"
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Live Demo
              </a>
              <a
                href="https://github.com/SarfarazAkram17/Sams-Kitchen-Client"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={30} className="hover:text-primary" />
              </a>
            </div>
          </div>

          {/* TourNest */}
          <div className="bg-white border-2 border-transparent hover:border-secondary p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://i.ibb.co/WNFYmhRy/favicon.png"
                alt="TourNest"
                className="h-12 w-12"
              />
              <h4 className="text-2xl font-bold text-primary">TourNest</h4>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              TourNest is a complete tourism management platform that allows
              users to book tour packages, apply as tour guides, share stories,
              and make secure payments, all under a role-based access-controlled
              environment.
            </p>
            <div className="flex justify-between items-center">
              <a
                href="https://tournest-sarfaraz-akram.netlify.app"
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Live Demo
              </a>
              <a
                href="https://github.com/SarfarazAkram17/TourNest-Client"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={30} className="hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Studify */}
          <div className="bg-white border-2 border-transparent hover:border-secondary p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://i.ibb.co/XZt0GXVB/s-removebg-preview.png"
                alt="Studify"
                className="h-12 w-12"
              />
              <h4 className="text-2xl font-bold text-primary">Studify</h4>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Studify is a group study platform where students can create
              assignments, submit work, and peer-review submissions with scoring
              and feedback.
            </p>
            <div className="flex justify-between items-center">
              <a
                href="https://studify-sarfaraz-akram.netlify.app"
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Live Demo
              </a>
              <a
                href="https://github.com/SarfarazAkram17/Studify-Client"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={30} className="hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;