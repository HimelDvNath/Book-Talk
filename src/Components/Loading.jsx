import React from "react";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[100vh] ">
            {/* Spinner */}
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute w-full h-full border-4 border-t-blue border-b-blue border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            </div>

            {/* Animated Dots */}
            <div className="flex space-x-2">
                <span className="w-4 h-4 bg-blue rounded-full animate-bounce delay-150"></span>
                <span className="w-4 h-4 bg-blue rounded-full animate-bounce delay-300"></span>
                <span className="w-4 h-4 bg-blue rounded-full animate-bounce delay-450"></span>
            </div>

            {/* Loading Text */}
            <p className="mt-6 text-blue text-lg font-semibold tracking-wide animate-pulse">
                Loading, please wait...
            </p>
        </div>
    );
};

export default Loading;
