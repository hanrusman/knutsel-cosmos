import React from 'react';

const Workbench = ({ children }) => {
    return (
        <div
            className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4"
            style={{
                backgroundImage: "url('/assets/bg-workbench-v2.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Background Texture Overlay (Optional, using CSS pattern later) */}
            {/* <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div> */}

            {/* Main Content Area - A big piece of paper on the desk */}
            <div className="relative w-full max-w-5xl aspect-video bg-[#fdfbf7] shadow-2xl p-8 flex flex-col items-center justify-center border-none rotate-1 transform transition-transform duration-700 hover:rotate-0">
                {/* Paper texture/noise could go here */}
                {children}
            </div>
        </div>
    );
};

export default Workbench;
