import React from 'react'
import './AnimatedBackground.css'

const DnaStrand = ({ className, nodeColor1 = 'var(--neon-blue)', nodeColor2 = 'var(--neon-pink)', length = 20, delayMultiplier = 0.15 }) => {
  return (
    <div className={`dna-strand ${className}`}>
      {[...Array(length)].map((_, i) => (
        <div key={i} className="dna-base-pair" style={{ animationDelay: `-${i * delayMultiplier}s` }}>
          <div className="dna-node node-left" style={{ animationDelay: `-${i * delayMultiplier}s`, backgroundColor: nodeColor1, boxShadow: `0 0 15px ${nodeColor1}` }}></div>
          <div className="dna-line" style={{ animationDelay: `-${i * delayMultiplier}s`, background: `linear-gradient(90deg, ${nodeColor1} 0%, ${nodeColor2} 100%)` }}></div>
          <div className="dna-node node-right" style={{ animationDelay: `-${i * delayMultiplier}s`, backgroundColor: nodeColor2, boxShadow: `0 0 15px ${nodeColor2}` }}></div>
        </div>
      ))}
    </div>
  )
}

const AnimatedBackground = () => {
  return (
    <div className='fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-100'>
        {/* Widespread, smooth DNA strands layered across the viewport */}
        <DnaStrand className='absolute top-[5%] -left-[5%] scale-[0.6] opacity-50 rotate-[30deg]' nodeColor1='#5F6FFF' nodeColor2='#a5abf5' length={20} delayMultiplier={0.12} />
        
        <DnaStrand className='absolute top-[15%] right-[5%] scale-[0.5] opacity-40 -rotate-[45deg]' nodeColor1='#4ade80' nodeColor2='#14b8a6' length={15} delayMultiplier={0.15} />
        
        <DnaStrand className='absolute top-[40%] left-[8%] scale-[0.4] opacity-30 rotate-[70deg]' nodeColor1='#a855f7' nodeColor2='#ec4899' length={18} delayMultiplier={0.1} />
        
        <DnaStrand className='absolute bottom-[25%] right-[12%] scale-[0.7] opacity-45 -rotate-[15deg]' nodeColor1='#FFB84D' nodeColor2='#FF6B6B' length={16} delayMultiplier={0.18} />
        
        <DnaStrand className='absolute bottom-[5%] left-[25%] scale-[0.5] opacity-35 rotate-[80deg]' nodeColor1='#ef4444' nodeColor2='#eab308' length={22} delayMultiplier={0.14} />

        <DnaStrand className='absolute bottom-[-10%] right-[30%] scale-[0.6] opacity-30 -rotate-[60deg]' nodeColor1='#6366f1' nodeColor2='#818cf8' length={25} delayMultiplier={0.11} />
        
        {/* Large, very transparent strand spanning the center background organically */}
        <DnaStrand className='absolute top-[25%] left-[30%] scale-[1.1] opacity-10 rotate-[20deg]' nodeColor1='#5F6FFF' nodeColor2='#9ca3af' length={30} delayMultiplier={0.08} />
    </div>
  )
}

export default AnimatedBackground
