import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-transparent py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={logo} alt="UNI Logo" className="h-[120px] w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-primary-500 rounded-md shadow-md bg-white hover:bg-primary-50 text-primary-600"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-primary-600 duration-300 -translate-x-full bg-primary-100 group-hover:translate-x-0 ease">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-primary-600 transition-all duration-300 transform group-hover:translate-x-full ease">Login</span>
                  <span className="relative invisible">Login</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <motion.main
              className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="block">Revolutionize Your</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Flexography Prepress Workflow</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Streamline your flexo plate printing process, improve accuracy, and deliver top-quality results with Unidots' comprehensive digital platform.
                </motion.p>
                <motion.div
                  className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="group relative w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 md:py-4 md:text-lg md:px-10 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#services"
                      className="group relative w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 md:py-4 md:text-lg md:px-10 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-secondary-500/50"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      Learn More
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-contain bg-center bg-no-repeat rounded-xl overflow-hidden shadow-2xl shadow-primary-500/20"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              backgroundImage: "url('https://via.placeholder.com/800x600?text=Flexography+Illustration')",
              boxShadow: "0 0 30px rgba(14, 165, 233, 0.3)"
            }}
          >
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-100 rounded-full mb-4">Services</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Flexography Solutions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Our digital platform connects clients, designers, prepress employees, and managers in one seamless workflow.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Service 1 */}
              <motion.div
                className="group relative bg-gray-700 p-6 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-600 shadow-lg hover:shadow-primary-500/20 border border-gray-600 hover:border-primary-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-6 shadow-lg shadow-primary-500/30 transform transition-all duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors duration-300">Prepress Plate-Making</h3>
                  <p className="mt-3 text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    Precision plate-making services for superior print quality, ensuring your designs translate perfectly to the final product.
                  </p>
                </div>
                <div className="mt-6">
                  <a href="#" className="inline-flex items-center text-primary-400 font-medium group-hover:text-primary-300 transition-colors duration-300">
                    Learn more
                    <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* Service 2 */}
              <motion.div
                className="group relative bg-gray-700 p-6 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-600 shadow-lg hover:shadow-primary-500/20 border border-gray-600 hover:border-primary-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-6 shadow-lg shadow-primary-500/30 transform transition-all duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors duration-300">Design & Editing</h3>
                  <p className="mt-3 text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    Fine-tuning designs for optimal flexographic printing results, with expert adjustments to ensure color accuracy and print quality.
                  </p>
                </div>
                <div className="mt-6">
                  <a href="#" className="inline-flex items-center text-primary-400 font-medium group-hover:text-primary-300 transition-colors duration-300">
                    Learn more
                    <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* Service 3 */}
              <motion.div
                className="group relative bg-gray-700 p-6 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-600 shadow-lg hover:shadow-primary-500/20 border border-gray-600 hover:border-primary-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-6 shadow-lg shadow-primary-500/30 transform transition-all duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors duration-300">Real-Time Order Tracking</h3>
                  <p className="mt-3 text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    Monitor your order's progress from submission to delivery with our transparent digital workflow system.
                  </p>
                </div>
                <div className="mt-6">
                  <a href="#" className="inline-flex items-center text-primary-400 font-medium group-hover:text-primary-300 transition-colors duration-300">
                    Learn more
                    <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 bg-gradient-to-b from-white-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            
            <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-100 rounded-full mb-4">About Us</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-Black sm:text-4xl">
              Unidots Company
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Established in 2005, we are leaders in flexography prepress solutions.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {/* Mission */}
              <motion.div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-primary-500 transition-all duration-500"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <h3 className="relative flex items-center text-2xl font-bold text-white mb-6">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-600 text-white mr-4 shadow-lg shadow-primary-600/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Our Mission
                </h3>
                <ul className="relative mt-4 text-base text-gray-300 space-y-4 pl-6">
                  <li className="flex items-start">
                    <span className="absolute -left-6 flex items-center justify-center h-6 w-6 rounded-full bg-primary-900 text-primary-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Provide efficient, accurate, cost-effective flexography prepress solutions
                  </li>
                  <li className="flex items-start">
                    <span className="absolute -left-6 flex items-center justify-center h-6 w-6 rounded-full bg-primary-900 text-primary-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Continuously innovate for top-notch printing plates and workflows
                  </li>
                </ul>
              </motion.div>

              {/* Vision */}
              <motion.div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-secondary-500 transition-all duration-500"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <h3 className="relative flex items-center text-2xl font-bold text-white mb-6">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary-600 text-white mr-4 shadow-lg shadow-secondary-600/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </span>
                  Our Vision
                </h3>
                <ul className="relative mt-4 text-base text-gray-300 space-y-4 pl-6">
                  <li className="flex items-start">
                    <span className="absolute -left-6 flex items-center justify-center h-6 w-6 rounded-full bg-secondary-900 text-secondary-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Be a global leader in flexography prepress
                  </li>
                  <li className="flex items-start">
                    <span className="absolute -left-6 flex items-center justify-center h-6 w-6 rounded-full bg-secondary-900 text-secondary-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Set standards for quality, innovation, and customer satisfaction
                  </li>
                  <li className="flex items-start">
                    <span className="absolute -left-6 flex items-center justify-center h-6 w-6 rounded-full bg-secondary-900 text-secondary-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Revolutionize industry through digital tech and sustainability
                  </li>
                </ul>
              </motion.div>

              {/* Core Values */}
              <motion.div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-primary-500 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <h3 className="relative flex items-center text-2xl font-bold text-white mb-6">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white mr-4 shadow-lg shadow-primary-600/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </span>
                  Core Values
                </h3>
                <div className="relative mt-4 flex flex-wrap gap-3 text-base text-gray-300">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-primary-900 text-primary-300 border border-primary-700 transition-all duration-300 transform hover:scale-105 hover:bg-primary-800 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-900/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Innovation
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-secondary-900 text-secondary-300 border border-secondary-700 transition-all duration-300 transform hover:scale-105 hover:bg-secondary-800 hover:border-secondary-500 hover:shadow-lg hover:shadow-secondary-900/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Quality
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-blue-900 text-blue-300 border border-blue-700 transition-all duration-300 transform hover:scale-105 hover:bg-blue-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Collaboration
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-purple-900 text-purple-300 border border-purple-700 transition-all duration-300 transform hover:scale-105 hover:bg-purple-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Professionalism
                  </span>
                </div>
              </motion.div>

              {/* Team */}
              <motion.div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-secondary-500 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <h3 className="relative flex items-center text-2xl font-bold text-white mb-6">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 text-white mr-4 shadow-lg shadow-secondary-600/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  Our Team
                </h3>
                <ul className="relative mt-4 text-base text-gray-300 space-y-6">
                  <li className="group/item flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-700/50 hover:shadow-md">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                      TA
                    </div>
                    <div>
                      <a href="DotDeformationDetector" target="_blank" rel="noopener noreferrer"> <h4 className="text-lg font-semibold text-white">Dr. Tamer Ali</h4></a>
                      <p className="text-gray-400 group-hover/item:text-primary-400 transition-colors duration-300">Technical Advisor</p>
                    </div>
                  </li>
                  <li className="group/item flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-700/50 hover:shadow-md">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                      AA
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Eng. Ayman Abdelaziz</h4>
                      <p className="text-gray-400 group-hover/item:text-secondary-400 transition-colors duration-300">General Manager</p>
                    </div>
                  </li>
                  <li className="group/item flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-700/50 hover:shadow-md">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                      AW
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Eng. Ayman Wanis</h4>
                      <p className="text-gray-400 group-hover/item:text-blue-400 transition-colors duration-300">Planning Director</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-whu-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-100 rounded-full mb-4">Contact Us</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-Black sm:text-4xl">
              Get In Touch
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Have questions about our services? We're here to help.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Contact Information */}
              <motion.div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-primary-500 transition-all duration-500"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <h3 className="text-2xl font-bold text-white mb-8 relative">Contact Information</h3>
                <div className="space-y-6">
                  <motion.div
                    className="relative flex items-start group/item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover/item:shadow-primary-500/30 group-hover/item:bg-primary-900 group-hover/item:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="mt-1">
                      <p className="text-lg font-medium text-white">Phone</p>
                      <p className="mt-1 text-base text-gray-300 group-hover/item:text-primary-400 transition-colors duration-300">+1 (555) 123-4567</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative flex items-start group/item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover/item:shadow-primary-500/30 group-hover/item:bg-primary-900 group-hover/item:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="mt-1">
                      <p className="text-lg font-medium text-white">Email</p>
                      <p className="mt-1 text-base text-gray-300 group-hover/item:text-primary-400 transition-colors duration-300">info@unidots.com</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative flex items-start group/item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 group-hover/item:shadow-primary-500/30 group-hover/item:bg-primary-900 group-hover/item:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="mt-1">
                      <p className="text-lg font-medium text-white">Address</p>
                      <p className="mt-1 text-base text-gray-300 group-hover/item:text-primary-400 transition-colors duration-300">
                        123 Flexo Street, Suite 100<br />Print City, FL 12345
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-secondary-500 transition-all duration-500"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <h3 className="text-2xl font-bold text-white mb-6 relative">Send us a message</h3>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="shadow-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-3 transition-all duration-300 focus:shadow-secondary-500/30 focus:shadow-lg"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="shadow-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-3 transition-all duration-300 focus:shadow-secondary-500/30 focus:shadow-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      className="shadow-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-3 transition-all duration-300 focus:shadow-secondary-500/30 focus:shadow-lg"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 shadow-lg shadow-secondary-500/20 hover:shadow-secondary-500/40 transition-all duration-300 overflow-hidden"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      Send Message
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <motion.div
              className="flex justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-12 w-40 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                UNIDOTS
              </div>
            </motion.div>
            <motion.div
              className="mt-8 md:mt-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} Unidots Prepress Solutions. All rights reserved.
              </p>
            </motion.div>
          </div>
          <motion.div
            className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center space-x-6 md:justify-start">
              <motion.a
                href="#about"
                className="group relative text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                About
              </motion.a>
              <motion.a
                href="#services"
                className="group relative text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                Services
              </motion.a>
              <motion.a
                href="#contact"
                className="group relative text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                Contact
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/login" className="group relative text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  Login
                </Link>
              </motion.div>
            </div>

            <div className="mt-8 md:mt-0 flex justify-center space-x-6">
              <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2, rotate: 5 }}>
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2, rotate: -5 }}>
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2, rotate: 5 }}>
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2, rotate: -5 }}>
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;