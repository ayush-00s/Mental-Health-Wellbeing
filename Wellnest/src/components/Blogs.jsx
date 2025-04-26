import React, { useEffect, useState } from "react";
import axios from "axios";

const Blogs = () => {
  // Mock data for articles
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const getArticles = async() =>{
      try {
       const res = await axios.get("http://localhost:4001/Blog");
       console.log(res.data)
       setArticles(res.data)
      } catch (error) {
        console.log("Error fetching articles:", error);
      }
    };
    getArticles();
  },[]);
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-4">Latest Articles & Blogs</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{article.content.substring(0, 80)}...</p>
              <p className="text-sm text-gray-500 mt-2">By {article.author} | {article.date}</p>
              <button className="mt-3 text-blue-600 font-medium hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;