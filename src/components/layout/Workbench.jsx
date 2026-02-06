import React from 'react';

const Workbench = ({ children }) => {
    return (
        <div
            className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 bg-[#fdfbf7]"
        >
            {/* Background Texture Overlay (Optional, using CSS pattern later) */}
            {/* <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div> */}

            {/* Main Content Area - Use the Workbench Image as the 'World' background */}
            <div
                className="relative w-full max-w-6xl h-full max-h-[90vh] min-h-[500px] shadow-2xl p-4 sm:p-8 flex flex-col items-center border-[12px] border-white/80 transition-transform duration-700 overflow-hidden rounded-xl"
                style={{
                    backgroundImage: "url('/assets/bg-workbench-v2.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Paper texture/noise could go here */}
                {children}
            </div>
        </div>
    );
};

export default Workbench;
