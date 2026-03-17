import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CommunityForum = () => {
  const [activeTab, setActiveTab] = useState('discussions'); // discussions, discover, pending, connections
  const [posts, setPosts] = useState([]);
  
  // Network States
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'discussions') {
        const { data } = await api.get('/community/posts');
        setPosts(data);
      } else if (activeTab === 'discover') {
        const { data } = await api.get('/network/discover');
        setDiscoverUsers(data);
      } else if (activeTab === 'pending' || activeTab === 'connections') {
        const { data } = await api.get('/network/connections');
        setFriends(data.friends || []);
        setPendingRequests(data.incomingRequests || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await api.post(`/network/request/${userId}`);
      // Remove from discover list visually
      setDiscoverUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error sending request', error);
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await api.post(`/network/accept/${userId}`);
      fetchData(); // Refresh lists
    } catch (error) {
      console.error('Error accepting request', error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await api.post(`/network/reject/${userId}`);
      fetchData(); // Refresh lists
    } catch (error) {
      console.error('Error rejecting request', error);
    }
  };

  const handleVideoCall = (userId) => {
    navigate(`/dashboard/mental-health?tab=video&callId=${userId}`);
  };

  // UI Components mapping
  const renderDiscussions = () => (
    <>
      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium shadow-sm">
          + New Post
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading discussions...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500 font-medium">No posts yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
              <p className="text-gray-500 text-sm mt-1">
                 <span className="font-medium text-indigo-600">{post.author?.name}</span> • {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-3 line-clamp-2 leading-relaxed">{post.content}</p>
              <div className="flex gap-6 mt-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> {post.likes?.length || 0}</span>
                <span className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> {post.commentsCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderDiscover = () => (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover Network</h2>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Finding connections...</div>
      ) : discoverUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500 font-medium">No new users to discover right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverUsers.map(user => (
            <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
               <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-indigo-50 shadow-sm text-2xl flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold">
                 {user.profileImage && user.profileImage !== 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=User' ? (
                   <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   user.name.charAt(0).toUpperCase()
                 )}
               </div>
               <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
               <p className="text-sm text-indigo-600 font-medium mb-1 capitalize">{user.role}</p>
               <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-1.5 h-10 line-clamp-2">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                 {user.university || 'University not specified'}
               </p>
               <button 
                 onClick={() => handleSendRequest(user._id)}
                 className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100"
               >
                 Connect
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPending = () => (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Friend Requests</h2>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading requests...</div>
      ) : pendingRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500 font-medium">You have no pending connection requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map(req => (
            <div key={req._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-indigo-50 bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
                  {req.profileImage && req.profileImage !== 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=User' ? (
                   <img src={req.profileImage} alt={req.name} className="w-full h-full object-cover" />
                 ) : (
                   req.name.charAt(0).toUpperCase()
                 )}
               </div>
               <h3 className="font-bold text-lg text-gray-900">{req.name}</h3>
               <p className="text-sm text-gray-500 mb-6">{req.university || 'University not specified'}</p>
               
               <div className="flex gap-2 w-full">
                 <button onClick={() => handleAcceptRequest(req._id)} className="flex-1 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition">Accept</button>
                 <button onClick={() => handleRejectRequest(req._id)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">Decline</button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderConnections = () => (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Connections</h2>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading network...</div>
      ) : friends.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500 font-medium mb-4">You haven't added any friends yet.</p>
           <button onClick={() => setActiveTab('discover')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
             Discover People
           </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {friends.map(friend => (
            <div key={friend._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                    {friend.profileImage && friend.profileImage !== 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=User' ? (
                       <img src={friend.profileImage} alt={friend.name} className="w-full h-full object-cover" />
                     ) : (
                       friend.name.charAt(0).toUpperCase()
                     )}
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-gray-900">{friend.name}</h3>
                   <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                      {friend.university || 'University not specified'}
                   </p>
                 </div>
               </div>
               
               <button 
                 onClick={() => handleVideoCall(friend._id)}
                 className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
               >
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                 Video Call
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Network Header/Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Community Network</h1>
        
        <div className="flex gap-8 overflow-x-auto pb-[-1px]">
          <button 
            onClick={() => setActiveTab('discussions')}
            className={`pb-4 px-1 font-medium text-[15px] whitespace-nowrap border-b-2 transition-colors ${activeTab === 'discussions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
             Discussions
          </button>
          <button 
            onClick={() => setActiveTab('discover')}
            className={`pb-4 px-1 font-medium text-[15px] whitespace-nowrap border-b-2 transition-colors ${activeTab === 'discover' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
             Discover Network
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-1 font-medium text-[15px] whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
             Pending Requests {pendingRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pendingRequests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('connections')}
            className={`pb-4 px-1 font-medium text-[15px] whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'connections' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
             My Connections {friends.length > 0 && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{friends.length}</span>}
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'discussions' && renderDiscussions()}
        {activeTab === 'discover' && renderDiscover()}
        {activeTab === 'pending' && renderPending()}
        {activeTab === 'connections' && renderConnections()}
      </div>
    </div>
  );
};

export default CommunityForum;
