import React from 'react'
import { assets, doctors } from '../assets/assets'
import { motion } from 'framer-motion'

const Header = () => {
    return (
        <div className='relative flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-indigo-900/40 rounded-[2.5rem] px-6 md:px-10 lg:px-20 overflow-hidden my-6'>
            
            {/* Background glowing decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

            {/* --------- Header Left --------- */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }} 
                viewport={{ once: true }}
                className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 m-auto md:py-[10vw] md:mb-[-30px] z-10'
            >
                <p className='text-4xl md:text-5xl lg:text-7xl text-white font-extrabold leading-tight md:leading-tight lg:leading-tight tracking-tight drop-shadow-md'>
                    Book Appointment <br className='hidden md:block' /> 
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200'>With Trusted Doctors</span>
                </p>
                <div className='flex flex-col md:flex-row items-center gap-4 text-white/90 text-sm md:text-base font-light mt-2'>
                    <img className='w-32 shadow-lg rounded-full border-2 border-white/30' src={assets.group_profiles} alt="" />
                    <p className='leading-relaxed max-w-sm'>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                </div>
                <a href='#speciality' className='flex items-center gap-3 bg-white px-8 py-4 rounded-full text-[#595959] font-medium text-sm sm:text-base m-auto md:m-0 hover:scale-105 hover:shadow-xl hover:text-primary transition-all duration-300 mt-2 group'>
                    Book appointment <img className='w-3 group-hover:translate-x-2 transition-transform duration-300' src={assets.arrow_icon} alt="" />
                </a>
            </motion.div>

            {/* --------- Header Right (Modern Floating Collage) --------- */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} 
                viewport={{ once: true }}
                className='md:w-1/2 relative flex justify-center items-center h-[350px] md:h-auto py-10 z-10 mt-10 md:mt-0'
            >
                {/* Main Doctor Bubble */}
                <motion.img 
                    animate={{ y: [-12, 12, -12] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className='w-48 h-48 md:w-72 md:h-72 object-cover object-top rounded-full border-[6px] border-white/30 shadow-2xl absolute z-20 bg-blue-50' 
                    src={doctors[0].image} 
                    alt="Top Doctor" 
                />
                
                {/* Secondary Doctor 1 */}
                <motion.img 
                    animate={{ y: [15, -15, 15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className='w-32 h-32 md:w-44 md:h-44 object-cover object-top rounded-full border-4 border-white/30 shadow-xl absolute left-2 md:-left-4 top-4 md:top-8 z-10 bg-green-50' 
                    src={doctors[1].image} 
                    alt="Leading Doctor" 
                />

                {/* Secondary Doctor 2 */}
                <motion.img 
                    animate={{ y: [8, -20, 8] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className='w-28 h-28 md:w-36 md:h-36 object-cover object-top rounded-full border-4 border-white/30 shadow-xl absolute right-4 md:right-8 bottom-6 md:bottom-12 z-30 bg-purple-50' 
                    src={doctors[3].image} 
                    alt="Specialist" 
                />
                
                {/* Floating Verified Badge */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 md:top-4 right-10 md:right-16 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-40 hidden md:flex"
                >
                   <img src={assets.verified_icon} className="w-8 h-8" alt="Verified" />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Header