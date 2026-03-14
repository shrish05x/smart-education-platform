const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="text-sm text-gray-500 mt-1">
        by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
      <div className="flex gap-4 mt-3 text-sm text-gray-500">
        <span>❤️ {post.likes?.length || 0}</span>
        <span>💬 {post.commentsCount || 0}</span>
        {post.tags?.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">#{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
