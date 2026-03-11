import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const users = [
  { id:1, name:"Sarah Mitchell", email:"sarah@email.com", avatar:"SM", avatarColor:"#E63946", totalItems:12, lastActive:"2m ago", status:"active", totalValue:1240,
    wishlist:[{name:"Premium Leather Handbag",category:"Accessories",price:289,img:"👜",addedOn:"Mar 10",inStock:true},{name:"Wireless Headphones",category:"Electronics",price:349,img:"🎧",addedOn:"Mar 8",inStock:true},{name:"Silk Evening Dress",category:"Fashion",price:195,img:"👗",addedOn:"Mar 5",inStock:false},{name:"Gold Pendant Necklace",category:"Jewelry",price:120,img:"📿",addedOn:"Feb 28",inStock:true}]},
  { id:2, name:"James Kowalski", email:"james@email.com", avatar:"JK", avatarColor:"#4ECDC4", totalItems:7, lastActive:"15m ago", status:"active", totalValue:890,
    wishlist:[{name:"Running Sneakers Pro",category:"Footwear",price:180,img:"👟",addedOn:"Mar 9",inStock:true},{name:"Smart Fitness Watch",category:"Electronics",price:299,img:"⌚",addedOn:"Mar 6",inStock:true},{name:"Yoga Mat Premium",category:"Sports",price:85,img:"🧘",addedOn:"Mar 1",inStock:false}]},
  { id:3, name:"Priya Lakshmanan", email:"priya@email.com", avatar:"PL", avatarColor:"#45B7D1", totalItems:23, lastActive:"1h ago", status:"active", totalValue:3140,
    wishlist:[{name:"Diamond Stud Earrings",category:"Jewelry",price:520,img:"💎",addedOn:"Mar 10",inStock:true},{name:"Silk Saree Collection",category:"Fashion",price:340,img:"🥻",addedOn:"Mar 7",inStock:true},{name:"Perfume Set Luxury",category:"Beauty",price:210,img:"🌸",addedOn:"Mar 3",inStock:true}]},
  { id:4, name:"Omar Tahir", email:"omar@email.com", avatar:"OT", avatarColor:"#F4A261", totalItems:5, lastActive:"3h ago", status:"idle", totalValue:760,
    wishlist:[{name:"Leather Wallet Premium",category:"Accessories",price:95,img:"👛",addedOn:"Mar 8",inStock:true},{name:"Cologne Oud Edition",category:"Beauty",price:380,img:"✨",addedOn:"Feb 22",inStock:true}]},
  { id:5, name:"Chen Wei", email:"chen@email.com", avatar:"CW", avatarColor:"#BB8FCE", totalItems:18, lastActive:"5h ago", status:"idle", totalValue:2890,
    wishlist:[{name:"Vintage Camera",category:"Photography",price:420,img:"📷",addedOn:"Mar 9",inStock:true},{name:"Mechanical Keyboard",category:"Electronics",price:265,img:"⌨️",addedOn:"Mar 4",inStock:true},{name:"Art Print Collection",category:"Home",price:180,img:"🖼️",addedOn:"Feb 28",inStock:false}]},
  { id:6, name:"Amara Diallo", email:"amara@email.com", avatar:"AD", avatarColor:"#2ECC71", totalItems:9, lastActive:"1d ago", status:"offline", totalValue:1560,
    wishlist:[{name:"Linen Blazer Classic",category:"Fashion",price:290,img:"🧣",addedOn:"Mar 7",inStock:true},{name:"Ceramic Vase Set",category:"Home",price:145,img:"🏺",addedOn:"Mar 2",inStock:true}]},
  { id:7, name:"Lucas Ferreira", email:"lucas@email.com", avatar:"LF", avatarColor:"#E67E22", totalItems:14, lastActive:"30m ago", status:"active", totalValue:2100,
    wishlist:[{name:"Espresso Machine",category:"Kitchen",price:550,img:"☕",addedOn:"Mar 10",inStock:true},{name:"Leather Boots",category:"Footwear",price:320,img:"👢",addedOn:"Mar 6",inStock:false}]},
  { id:8, name:"Yuki Tanaka", email:"yuki@email.com", avatar:"YT", avatarColor:"#E91E8C", totalItems:31, lastActive:"10m ago", status:"active", totalValue:4200,
    wishlist:[{name:"Anime Figurine Set",category:"Collectibles",price:180,img:"🎎",addedOn:"Mar 11",inStock:true},{name:"Gaming Headset",category:"Electronics",price:220,img:"🎮",addedOn:"Mar 9",inStock:true},{name:"Sakura Perfume",category:"Beauty",price:95,img:"🌸",addedOn:"Mar 5",inStock:true}]},
];

const areaData = [
  {day:"Mon",saves:42,value:3200},{day:"Tue",saves:58,value:4100},{day:"Wed",saves:35,value:2800},
  {day:"Thu",saves:71,value:5600},{day:"Fri",saves:89,value:7200},{day:"Sat",saves:64,value:5100},{day:"Sun",saves:95,value:8400},
];
const barData = [
  {month:"Oct",wishlists:180},{month:"Nov",wishlists:240},{month:"Dec",wishlists:310},
  {month:"Jan",wishlists:280},{month:"Feb",wishlists:390},{month:"Mar",wishlists:447},
];
const categoryData = [
  {name:"Fashion",value:32,color:"#E63946"},
  {name:"Electronics",value:28,color:"#4ECDC4"},
  {name:"Jewelry",value:18,color:"#F4A261"},
  {name:"Beauty",value:12,color:"#BB8FCE"},
  {name:"Other",value:10,color:"#45B7D1"},
];

const statusColor = {active:"#10B981",idle:"#F59E0B",offline:"#9CA3AF"};
const statusBg = {active:"#ECFDF5",idle:"#FFFBEB",offline:"#F9FAFB"};
const statusTextColor = {active:"#059669",idle:"#D97706",offline:"#6B7280"};

const CustomTooltip = ({active,payload,label}) => {
  if (active && payload && payload.length) return (
    <div style={{background:"white",border:"1px solid #E5E7EB",borderRadius:10,padding:"10px 14px",fontSize:12,boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
      <div style={{color:"#9CA3AF",marginBottom:4,fontWeight:600}}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{color:p.color,fontWeight:700}}>{p.name}: {p.value > 999 ? `$${p.value.toLocaleString()}` : p.value}</div>)}
    </div>
  );
  return null;
};

export default function WishlistDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAnim, setModalAnim] = useState(false);
  const [search, setSearch] = useState("");
  const [animated, setAnimated] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 120); }, []);

  const openModal = (user) => { setSelectedUser(user); setTimeout(() => setModalAnim(true), 10); };
  const closeModal = () => { setModalAnim(false); setTimeout(() => setSelectedUser(null), 280); };

  const totalItems = users.reduce((a,u) => a+u.totalItems, 0);
  const totalValue = users.reduce((a,u) => a+u.totalValue, 0);
  const totalProducts = users.reduce((a,u) => a+u.wishlist.length, 0);
  const activeUsers = users.filter(u => u.status==="active").length;
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#F4F5F7",minHeight:"100vh",color:"#1A1A2E"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.4}}

        .stat-card{
          background:white; border-radius:18px; padding:22px 24px;
          border:1.5px solid #EBEBEC;
          box-shadow:0 1px 4px rgba(0,0,0,0.05);
          transition:all 0.28s cubic-bezier(0.34,1.4,0.64,1);
          position:relative; overflow:hidden;
          animation:fadeUp 0.45s ease both;
        }
        .stat-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.1);border-color:transparent;}

        .graph-card{
          background:white; border-radius:20px; padding:24px;
          border:1.5px solid #EBEBEC;
          box-shadow:0 1px 4px rgba(0,0,0,0.05);
          animation:fadeUp 0.45s ease both;
          transition:box-shadow 0.2s;
        }
        .graph-card:hover{box-shadow:0 8px 28px rgba(0,0,0,0.08);}

        .user-row{
          display:flex; align-items:center; gap:13px;
          padding:13px 16px; border-radius:12px; cursor:pointer;
          transition:background 0.15s,transform 0.15s;
          border-bottom:1px solid #F3F4F6;
          animation:fadeUp 0.35s ease both;
        }
        .user-row:last-child{border-bottom:none;}
        .user-row:hover{background:#FFF5F6;transform:translateX(3px);}
        .user-row:hover .row-arrow{color:#E63946;transform:translateX(3px);}
        .row-arrow{color:#D1D5DB;font-size:16px;transition:all 0.2s;}

        .search-input{
          background:#F9FAFB; border:1.5px solid #E5E7EB; border-radius:11px;
          padding:9px 13px 9px 38px; font-size:13px; color:#1A1A2E;
          outline:none; font-family:inherit; width:200px;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .search-input::placeholder{color:#9CA3AF;}
        .search-input:focus{border-color:#E63946;box-shadow:0 0 0 3px rgba(230,57,70,0.08);}

        .shimmer-btn{
          background:linear-gradient(270deg,#E63946,#FF6B6B,#FF8C69,#FF6B6B,#E63946);
          background-size:300% 100%; animation:shimmer 3s ease infinite;
          color:white; border:none; padding:9px 18px; border-radius:9px;
          font-weight:700; font-size:12px; cursor:pointer; font-family:inherit;
          box-shadow:0 3px 12px rgba(230,57,70,0.3); transition:transform 0.15s;
        }
        .shimmer-btn:hover{transform:translateY(-1px);}

        .modal-overlay{
          position:fixed; inset:0;
          background:rgba(15,15,30,0.45); backdrop-filter:blur(6px);
          z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px;
          animation:fadeUp 0.2s ease;
        }
        .modal-box{
          background:white; border-radius:22px; width:100%; max-width:560px;
          max-height:85vh; overflow:hidden; display:flex; flex-direction:column;
          box-shadow:0 32px 80px rgba(0,0,0,0.18);
          transition:opacity 0.28s,transform 0.28s cubic-bezier(0.34,1.4,0.64,1);
          border:1px solid #F0F0F0;
        }
        .product-row{
          display:flex; align-items:center; gap:13px;
          padding:12px 0; border-bottom:1px solid #F3F4F6;
        }
        .product-row:last-child{border-bottom:none;}
        .close-btn{
          width:30px; height:30px; border-radius:50%; border:none;
          background:#F3F4F6; color:#6B7280; font-size:15px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; font-family:inherit;
        }
        .close-btn:hover{background:#E63946;color:white;transform:rotate(90deg);}

        .sidebar-stat{
          display:flex; align-items:center; gap:12px; padding:12px 14px;
          border-radius:13px; border:1.5px solid #F0F0F0; background:white;
          margin-bottom:8px; animation:fadeUp 0.4s ease both;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .sidebar-stat:hover{border-color:#E63946;box-shadow:0 4px 16px rgba(230,57,70,0.08);}

        .live-dot{animation:pulse2 2s infinite;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#F3F4F6;}
        ::-webkit-scrollbar-thumb{background:#E0E0E0;border-radius:2px;}
        ::-webkit-scrollbar-thumb:hover{background:#E63946;}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:"white",borderBottom:"1px solid #EBEBEC",padding:"0 28px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 8px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#E63946,#FF8C69)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 4px 10px rgba(230,57,70,0.35)"}}>❤️</div>
          <span style={{fontWeight:800,fontSize:17,color:"#1A1A2E",letterSpacing:"-0.3px"}}>WishList Pro</span>
          <span style={{background:"#FFF0F1",color:"#E63946",border:"1px solid rgba(230,57,70,0.2)",borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:700,marginLeft:4}}>ADMIN</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#ECFDF5",border:"1px solid #BBF7D0",borderRadius:20,padding:"5px 12px"}}>
            <div className="live-dot" style={{width:6,height:6,borderRadius:"50%",background:"#10B981"}}/>
            <span style={{fontSize:12,fontWeight:600,color:"#059669"}}>{activeUsers} Active Now</span>
          </div>
          <button className="shimmer-btn" style={{padding:"8px 20px",fontSize:13}}>+ New Campaign</button>
        </div>
      </div>

      <div style={{display:"flex",minHeight:"calc(100vh - 60px)"}}>

        {/* ── SIDEBAR ── */}
        <div style={{width:268,flexShrink:0,borderRight:"1px solid #EBEBEC",padding:"24px 18px",display:"flex",flexDirection:"column",gap:24,overflowY:"auto",background:"white"}}>

          <div>
            <div style={{fontSize:10,fontWeight:800,color:"#9CA3AF",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Summary</div>
            {[
              {label:"Total Customers",value:users.length,icon:"👥",color:"#45B7D1",delay:"0s"},
              {label:"Wishlist Items",value:totalItems,icon:"❤️",color:"#E63946",delay:"0.06s"},
              {label:"Unique Products",value:totalProducts,icon:"🛍️",color:"#F4A261",delay:"0.12s"},
              {label:"Total Value",value:`$${totalValue.toLocaleString()}`,icon:"💰",color:"#BB8FCE",delay:"0.18s"},
            ].map((s,i) => (
              <div key={i} className="sidebar-stat" style={{animationDelay:s.delay}}>
                <div style={{width:38,height:38,borderRadius:11,background:`${s.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:19,fontWeight:900,color:"#1A1A2E",letterSpacing:"-0.5px"}}>{s.value}</div>
                  <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Category bars */}
          <div>
            <div style={{fontSize:10,fontWeight:800,color:"#9CA3AF",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>By Category</div>
            {categoryData.map((cat,i) => (
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{cat.name}</span>
                  <span style={{fontSize:12,fontWeight:700,color:cat.color}}>{cat.value}%</span>
                </div>
                <div style={{height:6,background:"#F3F4F6",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:animated?`${cat.value}%`:"0%",background:`linear-gradient(90deg,${cat.color}77,${cat.color})`,borderRadius:3,transition:`width 1s cubic-bezier(0.34,1.2,0.64,1) ${i*0.1}s`}}/>
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div>
            <div style={{fontSize:10,fontWeight:800,color:"#9CA3AF",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>User Status</div>
            {[
              {label:"Active",count:users.filter(u=>u.status==="active").length,color:"#10B981",bg:"#ECFDF5",border:"#BBF7D0"},
              {label:"Idle",count:users.filter(u=>u.status==="idle").length,color:"#F59E0B",bg:"#FFFBEB",border:"#FDE68A"},
              {label:"Offline",count:users.filter(u=>u.status==="offline").length,color:"#9CA3AF",bg:"#F9FAFB",border:"#E5E7EB"},
            ].map((s,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 13px",borderRadius:10,background:s.bg,border:`1px solid ${s.border}`,marginBottom:7}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:s.color}}/>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{s.label}</span>
                </div>
                <span style={{fontSize:15,fontWeight:900,color:s.color}}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{flex:1,padding:"26px 26px",overflowY:"auto",display:"flex",flexDirection:"column",gap:22}}>

          {/* KPI cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[
              {label:"Total Wishlists",value:users.length,sub:"↑ 12% this week",icon:"❤️",color:"#E63946",delay:"0s"},
              {label:"Items Saved",value:totalItems,sub:"↑ 8% this week",icon:"🛍️",color:"#4ECDC4",delay:"0.08s"},
              {label:"Total Value",value:`$${totalValue.toLocaleString()}`,sub:"↑ 24% this month",icon:"💰",color:"#F4A261",delay:"0.16s"},
              {label:"Avg per User",value:Math.round(totalItems/users.length),sub:"items per wishlist",icon:"📊",color:"#BB8FCE",delay:"0.24s"},
            ].map((s,i) => (
              <div key={i} className="stat-card" style={{animationDelay:s.delay}}>
                <div style={{position:"absolute",top:-24,right:-24,width:90,height:90,background:`radial-gradient(circle,${s.color}18,transparent 70%)`,borderRadius:"50%"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,position:"relative"}}>
                  <div style={{width:44,height:44,borderRadius:13,background:`${s.color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21}}>{s.icon}</div>
                  <div style={{width:8,height:8,borderRadius:"50%",background:s.color,boxShadow:`0 0 8px ${s.color}99`,marginTop:4}}/>
                </div>
                <div style={{fontSize:29,fontWeight:900,letterSpacing:"-1px",color:"#1A1A2E",marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:12,color:"#9CA3AF"}}>{s.label}</div>
                <div style={{fontSize:11,color:s.color,fontWeight:700,marginTop:7,display:"flex",alignItems:"center",gap:4}}>
                  <span style={{background:`${s.color}12`,padding:"2px 7px",borderRadius:20}}>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:18}}>

            {/* Area chart */}
            <div className="graph-card" style={{animationDelay:"0.3s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#1A1A2E",marginBottom:2}}>Wishlist Activity</div>
                  <div style={{fontSize:12,color:"#9CA3AF"}}>Daily saves & value this week</div>
                </div>
                <div style={{display:"flex",gap:14,fontSize:11}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#E63946"}}/><span style={{color:"#6B7280",fontWeight:600}}>Saves</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#4ECDC4"}}/><span style={{color:"#6B7280",fontWeight:600}}>Value</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={175}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="gSaves" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{fill:"#9CA3AF",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#9CA3AF",fontSize:11}} axisLine={false} tickLine={false} width={30}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="saves" name="Saves" stroke="#E63946" strokeWidth={2.5} fill="url(#gSaves)" dot={false}/>
                  <Area type="monotone" dataKey="value" name="Value $" stroke="#4ECDC4" strokeWidth={2.5} fill="url(#gValue)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="graph-card" style={{animationDelay:"0.38s"}}>
              <div style={{fontWeight:700,fontSize:15,color:"#1A1A2E",marginBottom:2}}>By Category</div>
              <div style={{fontSize:12,color:"#9CA3AF",marginBottom:14}}>Product distribution</div>
              <ResponsiveContainer width="100%" height={145}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={3} dataKey="value">
                    {categoryData.map((c,i) => <Cell key={i} fill={c.color}/>)}
                  </Pie>
                  <Tooltip content={<CustomTooltip/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px",marginTop:6}}>
                {categoryData.map((c,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                    <span style={{color:"#6B7280",fontWeight:500}}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="graph-card" style={{animationDelay:"0.44s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:"#1A1A2E",marginBottom:2}}>Monthly Wishlist Growth</div>
                <div style={{fontSize:12,color:"#9CA3AF"}}>Total wishlists created per month</div>
              </div>
              <div style={{background:"#FFF0F1",border:"1px solid rgba(230,57,70,0.2)",borderRadius:9,padding:"5px 13px",fontSize:12,fontWeight:700,color:"#E63946"}}>
                +147 this month ↑
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={barData} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#9CA3AF",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#9CA3AF",fontSize:11}} axisLine={false} tickLine={false} width={30}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="wishlists" name="Wishlists" radius={[7,7,0,0]}>
                  {barData.map((_,i) => (
                    <Cell key={i} fill={i===barData.length-1 ? "#E63946" : `#E63946${Math.round(30+i*28).toString(16).padStart(2,"0")}`}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer list */}
          <div style={{background:"white",border:"1.5px solid #EBEBEC",borderRadius:20,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",animation:"fadeUp 0.5s ease 0.5s both"}}>
            <div style={{padding:"18px 20px 14px",borderBottom:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:"#1A1A2E"}}>Customer Wishlists</div>
                <div style={{fontSize:12,color:"#9CA3AF",marginTop:2}}>Click any row to view full wishlist</div>
              </div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#9CA3AF"}}>🔍</span>
                <input className="search-input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
            </div>

            <div style={{padding:"6px 8px"}}>
              {filtered.map((user,i) => (
                <div key={user.id} className="user-row" style={{animationDelay:`${i*0.05}s`}} onClick={()=>openModal(user)}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${user.avatarColor},${user.avatarColor}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"white",flexShrink:0,boxShadow:`0 3px 10px ${user.avatarColor}40`}}>{user.avatar}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#1A1A2E",marginBottom:2}}>{user.name}</div>
                    <div style={{fontSize:11,color:"#9CA3AF"}}>{user.email}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,background:statusBg[user.status],border:`1px solid ${statusColor[user.status]}30`,borderRadius:20,padding:"3px 9px"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:statusColor[user.status]}}/>
                      <span style={{fontSize:11,fontWeight:600,color:statusTextColor[user.status],textTransform:"capitalize"}}>{user.status}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,minWidth:100}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#1A1A2E"}}>{user.totalItems} items</div>
                    <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>${user.totalValue.toLocaleString()}</div>
                  </div>
                  <div style={{fontSize:11,color:"#C4C4C4",flexShrink:0,minWidth:55,textAlign:"right"}}>{user.lastActive}</div>
                  <div className="row-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{opacity:modalAnim?1:0,transform:modalAnim?"scale(1) translateY(0)":"scale(0.94) translateY(16px)"}} onClick={e=>e.stopPropagation()}>

            <div style={{background:`linear-gradient(135deg,${selectedUser.avatarColor}ee,${selectedUser.avatarColor}99)`,padding:"24px 24px 20px",flexShrink:0,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-40,right:-40,width:150,height:150,background:"rgba(255,255,255,0.12)",borderRadius:"50%"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:54,height:54,borderRadius:16,background:"rgba(255,255,255,0.25)",backdropFilter:"blur(8px)",border:"2px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"white"}}>{selectedUser.avatar}</div>
                    <div>
                      <div style={{fontWeight:800,fontSize:18,color:"white",letterSpacing:"-0.3px"}}>{selectedUser.name}</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:2}}>{selectedUser.email}</div>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>✕</button>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[{icon:"❤️",label:`${selectedUser.totalItems} items`},{icon:"💰",label:`$${selectedUser.totalValue.toLocaleString()}`},{icon:"🕐",label:selectedUser.lastActive}].map((s,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:"white",display:"flex",alignItems:"center",gap:5}}>
                      <span>{s.icon}</span>{s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{padding:"20px 24px",overflowY:"auto",flex:1,background:"white"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:14,color:"#1A1A2E"}}>
                  Saved Products
                  <span style={{marginLeft:8,background:"#FFF0F1",color:"#E63946",border:"1px solid rgba(230,57,70,0.2)",padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{selectedUser.wishlist.length}</span>
                </div>
                <button className="shimmer-btn">📧 Notify</button>
              </div>
              {selectedUser.wishlist.map((item,i)=>(
                <div key={i} className="product-row">
                  <div style={{width:44,height:44,borderRadius:12,background:"#F9FAFB",border:"1px solid #F0F0F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.img}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:"#1A1A2E",marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>
                    <div style={{display:"flex",gap:6}}>
                      <span style={{background:"#F3F4F6",color:"#6B7280",padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:600}}>{item.category}</span>
                      <span style={{fontSize:11,color:"#C4C4C4"}}>Added {item.addedOn}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E",marginBottom:4}}>${item.price}</div>
                    <div style={{display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,background:item.inStock?"#ECFDF5":"#FFF0F1",color:item.inStock?"#059669":"#E63946"}}>
                      {item.inStock?"✓ In Stock":"✗ Out of Stock"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{padding:"14px 24px",borderTop:"1px solid #F3F4F6",display:"flex",gap:8,justifyContent:"flex-end",background:"#FAFAFA",flexShrink:0}}>
              <button onClick={closeModal} style={{background:"white",border:"1.5px solid #E5E7EB",borderRadius:9,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",color:"#374151",fontFamily:"inherit"}}>Close</button>
              <button className="shimmer-btn">🛒 Send Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}