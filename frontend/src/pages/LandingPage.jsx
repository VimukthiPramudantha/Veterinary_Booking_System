import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HeartIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon,
  StarIcon,
  PlayCircleIcon,
  CheckBadgeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';

// Custom animations styles
const customStyles = `
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1); }
    50% { transform: scale(1.15); }
    75% { transform: scale(1.1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(120deg); }
    66% { transform: translateY(10px) rotate(240deg); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(60px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes textShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .text-shimmer {
    background: linear-gradient(90deg, #6366f1 0%, #ec4899 25%, #8b5cf6 50%, #06b6d4 75%, #6366f1 100%);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShimmer 3s linear infinite;
  }
`;

const LandingPage = () => {
  const { isAuthenticated, isDoctor } = useAuth();
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [floatingElements, setFloatingElements] = useState([]);
  const heroRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Floating elements animation
  useEffect(() => {
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 60 + 20,
      color: ['text-blue-200', 'text-purple-200', 'text-pink-200', 'text-indigo-200'][Math.floor(Math.random() * 4)],
      duration: Math.random() * 10 + 15,
    }));
    setFloatingElements(elements);
  }, []);

  // Auto-rotating testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const elements = document.querySelectorAll('.parallax-element');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      elements.forEach((el, index) => {
        const speed = (index + 1) * 0.05;
        const xPos = (x - 0.5) * speed * 100;
        const yPos = (y - 0.5) * speed * 100;
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Battaramulla",
      pet: "Golden Retriever - Max",
      rating: 5,
      text: "The care Max received was exceptional. Dr. Perera's expertise and the staff's compassion made all the difference during his surgery recovery.",
      image: "👩‍💼"
    },
    {
      name: "Rajesh Patel",
      location: "Kotte",
      pet: "Persian Cat - Luna",
      rating: 5,
      text: "Outstanding service! The online booking made it so convenient, and Luna's routine check-up was thorough and stress-free.",
      image: "👨‍💻"
    },
    {
      name: "Priya Fernando",
      location: "Battaramulla",
      pet: "German Shepherd - Rex",
      rating: 5,
      text: "Emergency care at 2 AM - they were there when Rex needed them most. Professional, caring, and saved his life.",
      image: "👩‍🔬"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Happy Pets", icon: "🐕" },
    { number: "98%", label: "Satisfaction Rate", icon: "⭐" },
    { number: "24/7", label: "Emergency Care", icon: "🚨" },
    { number: "15+", label: "Expert Vets", icon: "👩‍⚕️" }
  ];

  const features = [
    {
      name: 'Easy Booking',
      description: 'Book appointments with veterinarians in just a few clicks.',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Expert Veterinarians',
      description: 'Connect with qualified and experienced veterinarians.',
      icon: UserGroupIcon,
    },
    {
      name: 'Health Diagnosis',
      description: 'Complete pre-visit questionnaires for better care.',
      icon: ClipboardDocumentCheckIcon,
    },
    {
      name: 'Secure & Safe',
      description: 'Your pet\'s health data is secure and protected.',
      icon: ShieldCheckIcon,
    },
    {
      name: '24/7 Support',
      description: 'Get help whenever you need it.',
      icon: ClockIcon,
    },
    {
      name: 'Multiple Locations',
      description: 'Find veterinarians in your area across Sri Lanka.',
      icon: HeartIcon,
    },
  ];

  const serviceAreas = [
    {
      name: 'Battaramulla',
      description: 'Main Service Area',
      coverage: 'Full veterinary services available',
      icon: '🏥'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`absolute ${element.color} opacity-20 animate-pulse`}
            style={{
              left: `${(element.x / window.innerWidth) * 100}%`,
              top: `${(element.y / window.innerHeight) * 100}%`,
              fontSize: `${element.size}px`,
              animation: `float ${element.duration}s ease-in-out infinite`,
              animationDelay: `${element.id * 0.5}s`
            }}
          >
            {['🐕', '🐱', '🐰', '🦜', '🐢', '❤️'][element.id]}
          </div>
        ))}
      </div>

      {/* Hero Section - Next Level */}
      <div className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-24 md:pt-32" ref={heroRef}>
        {/* Animated Background Layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient blob */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse parallax-element"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse parallax-element" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/25 via-purple-400/25 to-indigo-400/25 rounded-full blur-3xl animate-pulse parallax-element" style={{animationDelay: '4s'}}></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-20 right-20 w-16 h-16 border-4 border-purple-400/30 rounded-full animate-spin parallax-element" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-32 left-16 w-12 h-12 bg-gradient-to-r from-blue-400/40 to-purple-400/40 transform rotate-45 animate-bounce parallax-element" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-12 w-8 h-20 bg-gradient-to-b from-pink-400/30 to-transparent rounded-full animate-pulse parallax-element" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center mb-8 px-6 py-3 bg-white/90 backdrop-blur-lg rounded-full shadow-2xl border border-white/20 animate-bounce mt-8 md:mt-0">
            <SparklesIcon className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              #1 Veterinary Care in Battaramulla
            </span>
            <div className="ml-2 flex">
              {[1,2,3,4,5].map(i => (
                <StarSolid key={i} className="h-4 w-4 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Hero Icon with Advanced Animation */}
          <div className="flex justify-center mb-12">
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-all duration-1000 animate-pulse scale-150"></div>
              
              {/* Middle ring */}
              <div className="relative bg-white/20 backdrop-blur-lg p-8 rounded-full border-4 border-white/30 shadow-2xl transform transition-all duration-700 hover:scale-110 hover:rotate-12 group-hover:border-white/50">
                {/* Inner heart with beat animation */}
                <div className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 p-6 rounded-full shadow-xl transform transition-all duration-500 hover:shadow-pink-500/50">
                  <HeartSolid className="h-16 w-16 text-white animate-pulse" style={{
                    animation: 'heartbeat 2s ease-in-out infinite'
                  }} />
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute -inset-4 animate-spin" style={{animationDuration: '20s'}}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-80px)`,
                      animation: `sparkle 3s ease-in-out infinite ${i * 0.3}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Heading with Gradient Text */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
              Your Pet's
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Health Journey
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-medium mt-4">
              Starts Here ✨
            </span>
          </h1>
          
          {/* Subtitle with Typewriter Effect */}
          <p className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-12 max-w-4xl mx-auto font-light">
            Experience <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">world-class veterinary care</span> with our team of expert veterinarians. 
            From routine check-ups to emergency care, we're here for your beloved companions 🐾
          </p>
          
          {/* CTA Buttons with Advanced Styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/50 border-2 border-white/20 backdrop-blur-sm overflow-hidden"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center space-x-3">
                    <SparklesIcon className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Start Your Journey</span>
                    <div className="group-hover:translate-x-2 transition-transform duration-300">🚀</div>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                </Link>
                
                <Link
                  to="/login"
                  className="group px-12 py-6 text-xl font-semibold text-gray-800 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-gray-200/50 hover:border-purple-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
                >
                  <span>Sign In</span>
                  <div className="group-hover:translate-x-1 transition-transform duration-300 text-2xl">→</div>
                </Link>
              </>
            ) : (
              <Link
                to={isDoctor ? "/doctor-dashboard" : "/dashboard"}
                className="group relative px-12 py-6 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-green-500/50 border-2 border-white/20 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
                <div className="relative flex items-center space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-500" />
                  <span>{isDoctor ? "Doctor Dashboard" : "My Dashboard"}</span>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">✨</div>
                </div>
              </Link>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                id={`animate-stat-${index}`}
                className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 transform transition-all duration-700 hover:scale-110 hover:shadow-2xl ${
                  isVisible[`animate-stat-${index}`] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-500 text-sm mt-2 font-medium">Scroll to explore</p>
          </div>
        </div>
      </div>

      {/* Features Section - Completely Redesigned */}
      <div className="relative py-32 bg-gradient-to-b from-white via-purple-50/30 to-blue-50/50">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div 
            id="animate-features-header"
            className={`text-center mb-20 transform transition-all duration-1000 ${
              isVisible['animate-features-header'] 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
          >
            <div className="inline-flex items-center mb-6 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200/50 shadow-lg">
              <SparklesIcon className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                WORLD-CLASS FEATURES
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8">
              <span className="block text-shimmer">
                Everything Your Pet
              </span>
              <span className="block bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Needs & More ✨
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of veterinary care with our 
              <span className="font-semibold text-purple-600"> cutting-edge platform</span> designed 
              for convenience, quality, and your pet's ultimate wellbeing 🌟
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                id={`animate-feature-${index}`}
                className={`group relative transform transition-all duration-700 hover:scale-105 ${
                  isVisible[`animate-feature-${index}`] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Card background with multiple layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500"></div>
                
                {/* Main card */}
                <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-purple-500/20 transition-all duration-500">
                  {/* Icon container with advanced styling */}
                  <div className="relative mb-8 flex justify-center">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 scale-150"></div>
                    
                    {/* Icon background */}
                    <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-6 rounded-2xl shadow-xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg font-medium">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Floating micro-interactions */}
                <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"
                      style={{
                        top: `${20 + i * 25}%`,
                        right: `${10 + i * 15}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - Brand New */}
      <div 
        id="animate-testimonials"
        className={`relative py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 transform transition-all duration-1000 ${
          isVisible['animate-testimonials'] 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center mb-6 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-lg">
              <StarSolid className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm font-bold text-white">
                WHAT PET OWNERS SAY
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Stories of <span className="text-shimmer">Healing</span> 💕
            </h2>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarSolid key={i} className="h-8 w-8 text-yellow-400 mx-1" />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl font-light text-white leading-relaxed mb-8">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="text-6xl">{testimonials[currentTestimonial].image}</div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-purple-300 font-medium">
                    {testimonials[currentTestimonial].location}
                  </div>
                  <div className="text-pink-300 text-sm">
                    Pet: {testimonials[currentTestimonial].pet}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-white shadow-lg scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Area section */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Our Service Area
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Proudly serving pets and their families in the Battaramulla community
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-lg">
            {serviceAreas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-8 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{area.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {area.name}
                </h3>
                <p className="text-primary-600 font-semibold text-lg mb-3">
                  {area.description}
                </p>
                <p className="text-gray-600">
                  {area.coverage}
                </p>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm text-gray-700 font-medium">
                    🕒 Operating Hours: 8:00 AM - 6:00 PM
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Emergency services available 24/7
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us section */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
              About PawCare Veterinary Clinic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className="text-lg leading-8 text-gray-600 mb-6">
                  At PawCare, we believe every pet deserves the highest quality of care. 
                  Our team of experienced veterinarians and staff are dedicated to providing 
                  compassionate, comprehensive healthcare for your beloved companions.
                </p>
                <p className="text-lg leading-8 text-gray-600 mb-6">
                  Located in the heart of Battaramulla, we serve the local community with 
                  state-of-the-art facilities and personalized treatment plans tailored to 
                  each pet's unique needs.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Licensed & Certified Veterinarians</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Modern Diagnostic Equipment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Emergency Care Available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Compassionate Pet Care</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-indigo-100 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide exceptional veterinary care while building lasting relationships 
                  with pets and their families through compassion, excellence, and innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us section */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Contact Us
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Get in touch with our caring team. We're here to help your pets stay healthy and happy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                123 Main Street<br />
                Battaramulla<br />
                Sri Lanka 10120
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">
                Main: +94 11 234 5678<br />
                Emergency: +94 77 123 4567<br />
                Available 24/7
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">
                info@pawcare.lk<br />
                appointments@pawcare.lk<br />
                emergency@pawcare.lk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-200">
              Join hundreds of pet owners who trust us with their pets' health.
              Book your first appointment today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="group rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary-600 shadow-lg hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Sign Up Now</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </Link>
                </>
              ) : (
                <Link
                  to={isDoctor ? "/doctor-dashboard" : "/doctors"}
                  className="group rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary-600 shadow-lg hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center space-x-2">
                    <span>{isDoctor ? "View Dashboard" : "Find Doctors"}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Privacy Policy */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-600 p-2 rounded-full">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">PawCare</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner in pet healthcare. Providing compassionate, 
                professional veterinary services to the Battaramulla community 
                since 2020.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-primary-400">📍</span>
                  <span className="text-gray-300">123 Main Street, Battaramulla, Sri Lanka</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-400">📞</span>
                  <span className="text-gray-300">+94 11 234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-400">✉️</span>
                  <span className="text-gray-300">info@pawcare.lk</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>General Check-ups</li>
                <li>Vaccinations</li>
                <li>Surgery</li>
                <li>Dental Care</li>
                <li>Emergency Care</li>
                <li>Laboratory Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/register" className="hover:text-primary-400 transition-colors">Book Appointment</Link></li>
                <li><Link to="/login" className="hover:text-primary-400 transition-colors">Patient Login</Link></li>
                <li><a href="#about" className="hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
                <li><a href="#privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4" id="privacy">Privacy Policy</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We are committed to protecting your privacy and your pet's health information. 
                  All personal and medical data is securely stored and only accessed by authorized 
                  veterinary staff. We comply with all applicable privacy laws and veterinary 
                  confidentiality standards. Your information is never shared with third parties 
                  without your explicit consent.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4" id="terms">Terms of Service</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  By using our services, you agree to our terms and conditions. Appointments 
                  should be cancelled at least 24 hours in advance. Emergency services are 
                  available 24/7. Payment is required at the time of service. We reserve the 
                  right to refuse service in cases of aggressive behavior towards staff.
                </p>
              </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                © 2024 PawCare Veterinary Clinic. All rights reserved. | 
                Battaramulla, Sri Lanka | Licensed Veterinary Practice
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;