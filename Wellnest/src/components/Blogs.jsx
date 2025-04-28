import React, { useEffect, useState } from "react";
import axios from "axios";

const Blogs = () => {
  
  const [articles, setArticles] = useState([]);
  
  // State for modal
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const getArticles = async() => {
      try {
        const res = await axios.get("http://localhost:4001/Blog");
        console.log(res.data);
        setArticles(res.data);
      } catch (error) {
        console.log("Error fetching articles:", error);
      }
    };
    getArticles();
  }, []);
  
  // Handler for "Read More" button
  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
   
    document.body.style.overflow = 'hidden';
  };
  
  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Handle click outside modal to close
  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  
  // Listen for escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      // Ensure scrolling is re-enabled when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);
  
  // Function to get random height for masonry-like layout
  const getRandomHeight = () => {
    const heights = ['h-64', 'h-72', 'h-80', 'h-96'];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  return (
    <div className="p-4 md:p-6 w-full">
      <h1 className="text-3xl font-bold mb-8 text-center">Discover Inspiration</h1>
      
      
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {articles.map((article) => {
          
          const imgHeight = getRandomHeight();
          
          return (
            <div 
              key={article._id} 
              className="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleReadMore(article)}
            >
              <div className="relative cursor-pointer">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className={`w-full object-cover ${imgHeight}`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 hover:opacity-70 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium">
                      Read
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-bold line-clamp-2">{article.title}</h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{article.content.substring(0, 100)}...</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500">By {article.author}</p>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      
      {showModal && selectedArticle && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackgroundClick}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="relative">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-72 object-cover" 
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center overflow-hidden">
                  {selectedArticle.authorImage ? (
                    <img src={selectedArticle.authorImage} alt={selectedArticle.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium">{selectedArticle.author.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedArticle.author}</p>
                  <p className="text-xs text-gray-500">{selectedArticle.date}</p>
                </div>
              </div>
              
              {/* Article content */}
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{selectedArticle.content}</p>
              </div>
              
              {/* Tags if available */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;