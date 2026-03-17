import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const TABS = [
  { id:'discussions', label:'Discussions',       icon:'💬', color:T.purple },
  { id:'discover',    label:'Discover Network',  icon:'🔍', color:T.blue   },
  { id:'pending',     label:'Pending Requests',  icon:'⏳', color:T.coral  },
  { id:'connections', label:'My Connections',    icon:'🤝', color:T.lime   },
];

const Avatar = ({ user, size=48 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple},${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:size*.35, flexShrink:0, overflow:'hidden' }}>
    {user?.profileImage && !user.profileImage.includes('ui-avatars') ? (
      <img src={user.profileImage} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
    ) : user?.name?.charAt(0)?.toUpperCase()}
  </div>
);

const BwCard = ({ children, style }) => (
  <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)', borderRadius:18, ...style }}>
    {children}
  </div>
);

const EmptyState = ({ icon, msg, action }) => (
  <BwCard style={{ padding:'3rem', textAlign:'center' }}>
    <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>{icon}</div>
    <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'.9rem', marginBottom: action?'1rem':0 }}>{msg}</p>
    {action}
  </BwCard>
);

const CommunityForum = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'discussions') { const { data } = await api.get('/community/posts'); setPosts(data); }
      else if (activeTab === 'discover') { const { data } = await api.get('/network/discover'); setDiscoverUsers(data); }
      else { const { data } = await api.get('/network/connections'); setFriends(data.friends||[]); setPendingRequests(data.incomingRequests||[]); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSendRequest  = async id => { try { await api.post(`/network/request/${id}`); setDiscoverUsers(p=>p.filter(u=>u._id!==id)); } catch(e) { alert(e.response?.data?.message||'Failed'); } };
  const handleAcceptRequest = async id => { try { await api.post(`/network/accept/${id}`); fetchData(); } catch(e) { console.error(e); } };
  const handleRejectRequest = async id => { try { await api.post(`/network/reject/${id}`); fetchData(); } catch(e) { console.error(e); } };
  const handleVideoCall    = id => navigate(`/mental-health?tab=video&callId=${id}`);

  const SkeletonCard = () => (
    <BwCard style={{ padding:'1.4rem' }}>
      {[70,50,90].map((w,i)=><div key={i} style={{ height:12, borderRadius:6, background:'rgba(255,255,255,0.07)', marginBottom:8, width:`${w}%`, animation:'pulse 1.5s ease-in-out infinite' }}/>)}
    </BwCard>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.03em', marginBottom:'.3rem' }}>
          <span style={{ background:`linear-gradient(135deg,${T.purple},${T.blue})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Community</span> Network
        </h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.875rem' }}>Connect with peers, share discussions, and grow your student network.</p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'1rem' }}>
        {TABS.map(tab => {
          const badge = tab.id==='pending'&&pendingRequests.length>0 ? pendingRequests.length : tab.id==='connections'&&friends.length>0 ? friends.length : null;
          return (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{ display:'flex', alignItems:'center', gap:'.45rem', padding:'.6rem 1.1rem', borderRadius:12, border:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'.82rem', fontWeight:600, transition:'all .2s',
                background: activeTab===tab.id?`${tab.color}20`:'rgba(255,255,255,0.05)',
                color: activeTab===tab.id?tab.color:'rgba(255,255,255,0.52)',
                borderBottom: activeTab===tab.id?`2px solid ${tab.color}`:'2px solid transparent',
              }}>
              <span>{tab.icon}</span>{tab.label}
              {badge && <span style={{ background:T.coral, color:'#fff', fontSize:'.65rem', fontWeight:700, padding:'.1rem .45rem', borderRadius:999 }}>{badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }} transition={{ duration:.3 }}>

          {/* DISCUSSIONS */}
          {activeTab==='discussions' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ fontWeight:700, fontSize:'1.1rem' }}>Recent Discussions</h2>
                <button style={{ padding:'.55rem 1.2rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.82rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                  + New Post
                </button>
              </div>
              {loading ? [...Array(3)].map((_,i)=><SkeletonCard key={i}/>)
                : posts.length===0 ? <EmptyState icon="💬" msg="No posts yet. Be the first to start a discussion!"/>
                : posts.map(post=>(
                  <BwCard key={post._id} style={{ padding:'1.4rem', transition:'all .3s', cursor:'pointer' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${T.purple}40`;e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.09)';e.currentTarget.style.transform=''}}>
                    <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'.3rem' }}>{post.title}</h3>
                    <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,0.38)', marginBottom:'.75rem' }}>
                      <span style={{ color:T.purple, fontWeight:600 }}>{post.author?.name}</span> · {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'.875rem', lineHeight:1.65, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.content}</p>
                    <div style={{ display:'flex', gap:'1.5rem', marginTop:'.9rem', fontSize:'.78rem', color:'rgba(255,255,255,0.38)', fontWeight:500 }}>
                      <span style={{ cursor:'pointer', transition:'color .2s' }} onMouseEnter={e=>e.target.style.color=T.coral} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.38)'}>♥ {post.likes?.length||0}</span>
                      <span style={{ cursor:'pointer', transition:'color .2s' }} onMouseEnter={e=>e.target.style.color=T.blue} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.38)'}>💬 {post.commentsCount||0}</span>
                    </div>
                  </BwCard>
                ))
              }
            </div>
          )}

          {/* DISCOVER */}
          {activeTab==='discover' && (
            <div>
              <h2 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'1.1rem' }}>Discover Network</h2>
              {loading ? <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.35)' }}>Finding connections...</div>
                : discoverUsers.length===0 ? <EmptyState icon="🔍" msg="No new users to discover right now."/>
                : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.1rem' }}>
                  {discoverUsers.map(user=>(
                    <BwCard key={user._id} style={{ padding:'1.6rem', textAlign:'center', transition:'all .3s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${T.blue}40`;e.currentTarget.style.transform='translateY(-4px)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.09)';e.currentTarget.style.transform=''}}>
                      <div style={{ display:'flex', justifyContent:'center', marginBottom:'.9rem' }}><Avatar user={user} size={56}/></div>
                      <div style={{ fontWeight:700, marginBottom:'.2rem' }}>{user.name}</div>
                      <div style={{ fontSize:'.75rem', color:T.purple, fontWeight:600, textTransform:'capitalize', marginBottom:'.5rem' }}>{user.role}</div>
                      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.38)', marginBottom:'1.1rem' }}>{user.university||'University not specified'}</div>
                      <button onClick={()=>handleSendRequest(user._id)}
                        style={{ width:'100%', padding:'.6rem', borderRadius:10, border:`1px solid ${T.blue}40`, background:`rgba(133,141,255,0.1)`, color:T.blue, fontWeight:700, fontSize:'.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", transition:'all .2s' }}
                        onMouseEnter={e=>{e.target.style.background=T.blue;e.target.style.color='#fff'}}
                        onMouseLeave={e=>{e.target.style.background=`rgba(133,141,255,0.1)`;e.target.style.color=T.blue}}>
                        Connect
                      </button>
                    </BwCard>
                  ))}
                </div>
              }
            </div>
          )}

          {/* PENDING */}
          {activeTab==='pending' && (
            <div>
              <h2 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'1.1rem' }}>Pending Friend Requests</h2>
              {loading ? <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.35)' }}>Loading requests...</div>
                : pendingRequests.length===0 ? <EmptyState icon="⏳" msg="No pending connection requests."/>
                : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.1rem' }}>
                  {pendingRequests.map(req=>(
                    <BwCard key={req._id} style={{ padding:'1.6rem', textAlign:'center' }}>
                      <div style={{ display:'flex', justifyContent:'center', marginBottom:'.9rem' }}><Avatar user={req} size={52}/></div>
                      <div style={{ fontWeight:700, marginBottom:'.3rem' }}>{req.name}</div>
                      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.38)', marginBottom:'1.1rem' }}>{req.university||'University not specified'}</div>
                      <div style={{ display:'flex', gap:'.6rem' }}>
                        <button onClick={()=>handleAcceptRequest(req._id)} style={{ flex:1, padding:'.6rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${T.lime},#5bc75b)`, color:'#0D0C1D', fontWeight:700, fontSize:'.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Accept</button>
                        <button onClick={()=>handleRejectRequest(req._id)} style={{ flex:1, padding:'.6rem', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.55)', fontWeight:700, fontSize:'.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Decline</button>
                      </div>
                    </BwCard>
                  ))}
                </div>
              }
            </div>
          )}

          {/* CONNECTIONS */}
          {activeTab==='connections' && (
            <div>
              <h2 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'1.1rem' }}>My Connections</h2>
              {loading ? <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.35)' }}>Loading network...</div>
                : friends.length===0 ? <EmptyState icon="🤝" msg="No connections yet." action={<button onClick={()=>setActiveTab('discover')} style={{ padding:'.6rem 1.4rem', borderRadius:10, border:'none', background:`linear-gradient(135deg,${T.purple},${T.blue})`, color:'#fff', fontWeight:700, fontSize:'.82rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Discover People</button>}/>
                : <div style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>
                  {friends.map(friend=>(
                    <BwCard key={friend._id} style={{ padding:'1.1rem 1.4rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', transition:'all .3s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${T.lime}40`}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'}}>
                      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                        <Avatar user={friend} size={44}/>
                        <div>
                          <div style={{ fontWeight:700, fontSize:'.9rem' }}>{friend.name}</div>
                          <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,0.38)' }}>{friend.university||'University not specified'}</div>
                        </div>
                      </div>
                      <button onClick={()=>handleVideoCall(friend._id)}
                        style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.55rem 1.2rem', borderRadius:10, border:`1px solid ${T.lime}40`, background:`rgba(122,219,120,0.1)`, color:T.lime, fontWeight:700, fontSize:'.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", transition:'all .2s', flexShrink:0 }}
                        onMouseEnter={e=>{e.currentTarget.style.background=T.lime;e.currentTarget.style.color='#0D0C1D'}}
                        onMouseLeave={e=>{e.currentTarget.style.background=`rgba(122,219,120,0.1)`;e.currentTarget.style.color=T.lime}}>
                        📹 Video Call
                      </button>
                    </BwCard>
                  ))}
                </div>
              }
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CommunityForum;
