import { useState, useRef, useEffect } from "react";

function BlogDescription({ blog }) {
  const [showFull, setShowFull] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className="relative mb-8 text-gray-800">
      {/* Blog HTML content */}
      <div
        ref={contentRef}
        className={`prose max-w-none transition-all duration-500 ease-in-out ${
          showFull ? "" : "max-h-[16.5em] overflow-hidden relative"
        }`}
        style={{ lineHeight: "1.6em" }} // For line control
        dangerouslySetInnerHTML={{ __html: blog.description }}
      />

      {/* Fade + Button */}
      {!showFull && (
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent flex justify-center items-end pointer-events-none">
          <button
            onClick={() => setShowFull(true)}
            className="pointer-events-auto mb-4 px-5 py-2 text-sky-600 border border-sky-300 bg-white rounded-full shadow hover:shadow-md hover:bg-sky-50 transition-all cursor-pointer"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogDescription;
