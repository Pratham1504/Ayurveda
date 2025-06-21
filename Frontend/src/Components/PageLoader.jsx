// import React from "react";

// function PageLoader() {
//   return (
//     <div class="loading">
//       <svg height="48px" width="64px">
//         <polyline
//           id="back"
//           points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
//         ></polyline>
//         <polyline
//           id="front"
//           points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
//         ></polyline>
//         <polyline
//           id="front2"
//           points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
//         ></polyline>
//       </svg>
//     </div>
//   );
// }

// export default PageLoader;



import React from "react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <svg height="48" width="64" className="block">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          className="fill-none stroke-[3] stroke-[#ff4d5033]"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          className="fill-none stroke-[3] stroke-cyan-300"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: "48, 144",
            strokeDashoffset: 192,
            animation: "dash_682 2s linear infinite",
            animationDelay: "0s",
          }}
        />
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          className="fill-none stroke-[3] stroke-cyan-300"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: "48, 144",
            strokeDashoffset: 192,
            animation: "dash_682 2s linear infinite",
            animationDelay: "1s",
          }}
        />
      </svg>
      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes dash_682 {
            72.5% {
              opacity: 0;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PageLoader;