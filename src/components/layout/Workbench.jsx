import React from 'react';

const Workbench = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full bg-workbench overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Texture Overlay (Optional, using CSS pattern later) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Main Content Area - A big piece of paper on the desk */}
            <div className="relative w-full max-w-5xl aspect-video bg-paper shadow-cardboard p-8 flex flex-col items-center justify-center border-2 border-cardboard-dark rounded-sm">
                {/* Paper texture/noise could go here */}
                {children}
            </div>
        </div>
    );
};

export default Workbench;
