import { useState } from 'react';
import { Save, Image, Bold, Italic, List, Link, FileText, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import axios from 'axios'; 
import { useAuth } from '../context/AuthProvider';

export default function Create() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authUser } = useAuth();

  const handleSave = async () => {
    // Basic validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create blog post data
      const blogData = {
        title,
        content,
        category,
        image,
        author: authUser ? authUser.name : "Anonymous"
      };

      // Send POST request to your API
      const response = await axios.post('http://localhost:4001/Blog/create', blogData);
      
      if (response.data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(response.data.message || 'Failed to save blog');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the blog');
    } finally {
      setLoading(false);
    }
  };

  const formatText = (format) => {
   
    console.log(`Formatting with ${format}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null); 
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">BlogCraft</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className={`px-4 py-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded flex items-center gap-2`}
          >
            <Save size={16} />
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 mb-4 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-grow gap-4">
        {/* Sidebar */}
        <aside className="w-1/5 bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">Article Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="technology">Technology</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Featured Image</label>
            <input 
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label 
              htmlFor="image-upload"
              className="w-full p-2 border rounded flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image size={16} />
              {image ? 'Change Image' : 'Upload Image'}
            </label>
            {image && (
              <div className="mt-2">
                <img 
                  src={image} 
                  alt="Featured" 
                  className="w-full h-32 object-cover rounded"
                />
                 <button 
                    onClick={handleRemoveImage} 
                    className="mt-1 text-red-500 text-sm hover:text-red-700"
                    >
                    Remove image
                 </button>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input 
              type="text" 
              placeholder="Add tags separated by commas"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Publish Status</label>
            <select className="w-full p-2 border rounded">
              <option>Draft</option>
              <option>Published</option>
              <option>Scheduled</option>
            </select>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="w-4/5 bg-white p-6 rounded-lg shadow">
          {!preview ? (
            <div className="flex flex-col h-full">
              {/* Editor Toolbar */}
              <div className="flex gap-2 mb-4 pb-2 border-b">
                <button onClick={() => formatText('bold')} className="p-2 hover:bg-gray-100 rounded"><Bold size={18} /></button>
                <button onClick={() => formatText('italic')} className="p-2 hover:bg-gray-100 rounded"><Italic size={18} /></button>
                <button onClick={() => formatText('list')} className="p-2 hover:bg-gray-100 rounded"><List size={18} /></button>
                <button onClick={() => formatText('link')} className="p-2 hover:bg-gray-100 rounded"><Link size={18} /></button>
                <div className="border-r mx-1"></div>
                <button onClick={() => formatText('alignLeft')} className="p-2 hover:bg-gray-100 rounded"><AlignLeft size={18} /></button>
                <button onClick={() => formatText('alignCenter')} className="p-2 hover:bg-gray-100 rounded"><AlignCenter size={18} /></button>
                <button onClick={() => formatText('alignRight')} className="p-2 hover:bg-gray-100 rounded"><AlignRight size={18} /></button>
              </div>
              
              {/* Title */}
              <input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold mb-4 p-2 border-b focus:outline-none focus:border-blue-400"
              />
              
              {/* Content */}
              <textarea
                placeholder="Start writing your article..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-grow p-2 focus:outline-none resize-none"
              />
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <h1 className="text-3xl font-bold mb-6">{title || "Untitled Article"}</h1>
              <div className="prose max-w-none">
                {content || (
                  <div className="text-gray-400 italic">
                    Your article preview will appear here. Start writing in the editor to see a preview.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}