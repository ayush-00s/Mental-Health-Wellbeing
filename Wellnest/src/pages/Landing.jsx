import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/SignIn');
  }
  return (
    <div className="min-h-screen bg-[#96afe9]">
      {/* page 1 */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Image Section 1 */}
        <div className="flex flex-1 items-center justify-center p-4 md:p-8">
          <motion.img
            src="/assets/landing.png"
            className="h-auto w-full max-w-xl lg:max-w-2xl"
            alt="Landing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>

        {/* Text Section 1 */}
        <div className="flex-1 flex flex-col justify-center items-start px-6 md:px-16 py-8">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold font-sans mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2 }}
          >
            Feeling<br />
            <span className="text-blue-800">under the</span> <br />
            weather?
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Someone's here to listen,<br />
            share today.
          </motion.p>
          <img
            src="/assets/down-arrow.png"
            className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16 mr-3 mb-5"
            alt="Down Arrow"
          />
          
        </div>
      </div>
      {/* page 1 ends here */}

      {/* page 2 starts */}
      <div className="flex flex-col md:flex-row-reverse min-h-screen bg-white">
        {/* Image Section 2 */}
        <div className="flex flex-1 items-center justify-center p-4 md:p-8">
          <motion.img
            src="/assets/landing2.png"
            className="h-auto w-full max-w-xl lg:max-w-2xl"
            alt="Landing 2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5 }}
          />
        </div>

        {/* Text Section 2 */}
        <div className="flex-1 flex flex-col justify-center items-start px-6 md:px-16 py-8">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold font-sans mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.2 }}
          >
            Sorting through <br />
            negative emotions?
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Start your Journey with us.
          </motion.p>
        </div>
      </div>
      {/* page 2 ends */}

      {/*page 3 */}
      <div className="flex flex-col md:flex-row-reverse min-h-screen bg-indigo-500">
        {/* Image Section 3 */}
        <div className="flex flex-1 items-center justify-center p-4 md:p-8">
          <motion.img
            src="/assets/landing3.png"
            className="h-auto w-full max-w-xl lg:max-w-2xl"
            alt="Landing 2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5 }}
          />
        </div>

        {/* Text Section 3*/}
        <div className="flex-1 flex flex-col justify-center items-start px-6 md:px-16 py-8">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold font-sans mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.2 }}
          >
            Begin the <br />
            journey to<br/>
            healing.
          </motion.h1>
          <motion.button
            className="mt-8 px-8 py-3 bg-blue-800 text-white rounded-full text-lg font-medium hover:bg-blue-900 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={handleButtonClick}
          >
            Get Started
          </motion.button>
        </div>
      </div>
      {/*page 3 ends */}
    </div>
  );
};

export default Landing;