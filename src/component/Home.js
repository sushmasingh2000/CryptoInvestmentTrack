import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const typingTexts = [
  "Track Your Crypto Portfolio",
  "Get Real-Time Market Prices",
  "Set Custom Price Alerts",
];

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [fadeInHero, setFadeInHero] = useState(false);
  const [fadeInFeatures, setFadeInFeatures] = useState(false);
  const [fadeInCTA, setFadeInCTA] = useState(false);

  const user = localStorage.getItem("id")

  // Typing effect hook
  useEffect(() => {
    if (charIndex < typingTexts[textIndex].length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + typingTexts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText("");
        setCharIndex(0);
        setTextIndex((prev) => (prev + 1) % typingTexts.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex]);
  const navigate = useNavigate();

  // Scroll fade-in triggers
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      const features = document.getElementById("features");
      const cta = document.getElementById("cta");

      if (hero && window.scrollY + window.innerHeight > hero.offsetTop + 100) {
        setFadeInHero(true);
      }
      if (features && window.scrollY + window.innerHeight > features.offsetTop + 100) {
        setFadeInFeatures(true);
      }
      if (cta && window.scrollY + window.innerHeight > cta.offsetTop + 100) {
        setFadeInCTA(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once in case already in view
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-gray-100 font-sans overflow-x-hidden">
      {/* Floating particles */}
      <Particles />

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center z-20 relative">
        <h1 className="text-4xl lg:block  hidden font-extrabold text-emerald-400 tracking-wide select-none">
          CryptoTrackr
        </h1>
        <div className="space-x-6">
          <button className="px-5 py-2 rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition
           duration-300 font-semibold shadow-sm" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="px-7 py-2 rounded bg-emerald-500 hover:bg-emerald-600 transition duration-300 font-bold shadow-md text-black animate-pulse"
            onClick={() => {
              user ? navigate("/dashboard") : 
              toast("Please Login")
                navigate("/login");
              
            }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className={`max-w-7xl mx-auto px-8 py-28 flex flex-col md:flex-row items-center gap-12 transition-opacity duration-1000 ease-out ${fadeInHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-xl space-y-8 select-none">
          <h2 className="text-5xl font-extrabold leading-tight tracking-wide text-gradient-emerald-gold min-h-[120px]">
            {typedText}
            <span className="text-emerald-400 blink">|</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-md">
            Effortlessly monitor your crypto investments, watch live prices, and get instant alerts when your favorite coins hit your targets.
          </p>
          <div className="flex gap-6">
            <button className="px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-gold-400 rounded-lg shadow-lg font-semibold text-black hover:scale-105 transition-transform duration-300"
              onClick={() => {user ? navigate("/dashboard") : toast("Please Login"); navigate("/login")}}>
              Get Started
            </button>
            <button className="px-10 py-4 border-2 border-emerald-400 rounded-lg text-emerald-400 font-semibold hover:bg-emerald-400 hover:text-black transition duration-300">
              Learn More
            </button>
          </div>
        </div>

        <div className="w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-gray-700">
          <img
            src="https://www.shutterstock.com/image-illustration/top-7-cryptocurrency-tokens-by-600nw-2152214777.jpg"
            alt="Crypto Dashboard"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center transition-opacity duration-1000 ease-out ${fadeInFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {[
          {
            title: "Real-Time Prices",
            desc: "Get live updates and price charts for all major cryptocurrencies.",
          },
          {
            title: "Portfolio Tracking",
            desc: "Add your holdings and analyze detailed performance insights.",
          },
          {
            title: "Custom Alerts",
            desc: "Set alerts and get notified instantly for price movements.",
          },
        ].map(({ title, desc }, i) => (
          <div
            key={i}
            className="bg-gray-900 bg-opacity-70 rounded-2xl p-10 shadow-lg border border-gray-700 hover:shadow-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900 hover:via-teal-700 hover:to-gold-600 transition cursor-pointer"
          >
            <h3 className="text-3xl font-bold mb-4 text-emerald-400">{title}</h3>
            <p className="text-gray-300">{desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section
        id="cta"
        className={`bg-gradient-to-r from-emerald-700 via-teal-600 to-gold-500 py-20 text-center rounded-t-3xl mx-8 md:mx-40 mb-20 shadow-xl transition-opacity duration-1000 ease-out ${fadeInCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <h2 className="text-5xl font-extrabold mb-8 text-black drop-shadow-md select-none">
          Ready to Take Control of Your Crypto?
        </h2>
        <button className="px-14 py-5 bg-black rounded-full font-bold text-emerald-400 shadow-lg hover:text-gold-400 hover:scale-105 transition duration-300 animate-pulse"
          onClick={() => navigate("/dashboard")}>
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 select-none">
        © 2025 CryptoTrackr. All rights reserved.
      </footer>

      {/* Custom gradient text and animations */}
      <style>{`
        .text-gradient-emerald-gold {
          background: linear-gradient(90deg, #2ecc71, #1abc9c, #f1c40f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .blink {
          animation: blink 1.2s steps(2, start) infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        /* Floating particles animation */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(46, 204, 113, 0.3);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0.6;
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  );
}

// Floating Particles component
function Particles() {
  const [particles, setParticles] = React.useState([]);

  useEffect(() => {
    // Generate 30 random particles with random animation duration and sizes
    const p = Array.from({ length: 30 }).map(() => ({
      id: Math.random(),
      size: 8 + Math.random() * 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 20,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
    setParticles(p);
  }, []);

  return (
    <>
      {particles.map(({ id, size, left, top, duration, delay, direction }) => (
        <div
          key={id}
          className="particle"
          style={{
            width: size,
            height: size,
            left: `${left}%`,
            top: `${top}%`,
            animationName: "floatUpDown",
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            animationDirection: direction === 1 ? "alternate" : "alternate-reverse",
          }}
        />
      ))}

      <style>{`
        @keyframes floatUpDown {
          0% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-30px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
