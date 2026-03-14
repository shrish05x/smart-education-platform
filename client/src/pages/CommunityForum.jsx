import { useState, useEffect } from 'react';
import api from '../services/api';

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/community/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-10">Loading forum...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
          New Post
        </button>
      </div>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet. Be the first to start a discussion!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm mt-1">by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-700 mt-2 line-clamp-2">{post.content}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.commentsCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
