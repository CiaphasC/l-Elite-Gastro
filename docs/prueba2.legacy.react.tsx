import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Grid2X2, 
  Users, 
  Settings, 
  Plus, 
  Minus, 
  Trash2, 
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  ChefHat,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Star,
  CreditCard,
  LogOut,
  Package,
  ArrowRightLeft,
  X,
  Eye,
  Bell,
  CalendarDays,
  UserCheck,
  Wine,
  MoreHorizontal
} from 'lucide-react';

// --- ESTILOS GLOBALES (SCROLL SUAVE & DISEÑO) ---
const GlobalStyles = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(229, 192, 123, 0.4); }
    .glass-panel { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
    .premium-gradient { background: linear-gradient(135deg, #E5C07B 0%, #C69C54 100%); }
    .text-champagne { color: #E5C07B; }
    .border-champagne { border-color: rgba(229, 192, 123, 0.2); }
    .hover-glow:hover { box-shadow: 0 0 20px rgba(229, 192, 123, 0.15); border-color: rgba(229, 192, 123, 0.4); }
    
    /* Animaciones Custom */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
  `}</style>
);

// --- DATOS MOCK ---
const MENU_CATEGORIES = ["Entrantes", "Principales", "Vinos", "Coctelería", "Postres"];

const INITIAL_MENU_ITEMS = [
  { id: 1, name: "Carpaccio de Wagyu A5", price: 45.00, category: "Entrantes", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800", stock: 12, unit: "raciones" },
  { id: 2, name: "Ostras Fine de Claire", price: 38.00, category: "Entrantes", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800", stock: 5, unit: "docenas" },
  { id: 3, name: "Solomillo Rossini", price: 56.00, category: "Principales", img: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800", stock: 20, unit: "kg" },
  { id: 4, name: "Lubina Salvaje", price: 48.00, category: "Principales", img: "https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&q=80&w=800", stock: 8, unit: "piezas" },
  { id: 5, name: "Dom Pérignon '12", price: 320.00, category: "Vinos", img: "https://images.unsplash.com/photo-1594460750222-29307c67b2fd?auto=format&fit=crop&q=80&w=800", stock: 4, unit: "botellas" },
  { id: 6, name: "Old Fashioned Ahumado", price: 22.00, category: "Coctelería", img: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80&w=800", stock: 50, unit: "copas" },
  { id: 7, name: "Soufflé Grand Marnier", price: 18.00, category: "Postres", img: "https://images.unsplash.com/photo-1579954115545-a95591f28bee?auto=format&fit=crop&q=80&w=800", stock: 15, unit: "raciones" },
];

const TABLES = [
  { id: 101, status: "disponible", guests: 0 },
  { id: 102, status: "ocupada", guests: 4 },
  { id: 103, status: "reservada", guests: 2 },
  { id: 104, status: "disponible", guests: 0 },
  { id: 105, status: "limpieza", guests: 0 },
  { id: 106, status: "disponible", guests: 0 },
];

const INITIAL_RESERVATIONS = [
  { id: 1, name: "Roberto M.", time: "21:00", guests: 2, table: 103, type: "Aniversario", status: "confirmado" },
  { id: 2, name: "Familia Alarcón", time: "21:30", guests: 6, table: 108, type: "Cena", status: "pendiente" },
  { id: 3, name: "CEO Tech Corp", time: "22:00", guests: 4, table: 101, type: "Negocios", status: "vip" },
];

const CLIENTS = [
  { id: 1, name: "Isabella V.", tier: "Platinum", visits: 42, spend: "$12,450", lastVisit: "Ayer", preferences: "Mesa lejos de la entrada, Alérgica a mariscos." },
  { id: 2, name: "Carlos D.", tier: "Gold", visits: 15, spend: "$3,200", lastVisit: "Hace 1 semana", preferences: "Prefiere vino tinto Cabernet." },
];

const INITIAL_KITCHEN_ORDERS = [
  { id: "T-102", items: [{name: "Carpaccio Wagyu", qty: 1}, {name: "Lubina", qty: 2}], time: "12 min", status: "cooking", waiter: "Pedro G.", notes: "Sin sal en la lubina" },
  { id: "T-105", items: [{name: "Ostras", qty: 1}, {name: "Solomillo", qty: 1}], time: "5 min", status: "pending", waiter: "María C.", notes: "Solomillo muy hecho" },
  { id: "T-108", items: [{name: "Soufflé", qty: 4}], time: "2 min", status: "ready", waiter: "Pedro G.", notes: "Servir todos a la vez" },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState(INITIAL_MENU_ITEMS);
  const [kitchenOrders, setKitchenOrders] = useState(INITIAL_KITCHEN_ORDERS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [selectedCategory, setSelectedCategory] = useState("Entrantes");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Estados de Modales
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'kitchen-detail' | 'kitchen-serve'

  const mainContentRef = useRef(null);

  // Simulación de carga inicial con GSAP
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        setIsLoading(false);
        if (window.gsap && mainContentRef.current) {
          window.gsap.fromTo(mainContentRef.current, 
            { opacity: 0, y: 20, filter: "blur(10px)" }, 
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
          );
        }
      }, 1500);
    };
    document.head.appendChild(script);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const updateStock = (id, delta) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  const completeOrder = (orderId) => {
    setKitchenOrders(prev => prev.filter(o => o.id !== orderId));
    setModalType(null);
    setSelectedOrder(null);
  };

  const addReservation = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRes = {
      id: Date.now(),
      name: formData.get('name'),
      time: formData.get('time'),
      guests: formData.get('guests'),
      table: '---',
      type: 'Nueva',
      status: 'pendiente'
    };
    setReservations([...reservations, newRes]);
    setShowReservationModal(false);
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const filteredItems = inventory.filter(item => 
    item.category === selectedCategory && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center text-[#E5C07B]">
        <div className="w-24 h-24 border-[1px] border-t-[#E5C07B] border-[#E5C07B]/10 rounded-full animate-spin mb-8"></div>
        <h1 className="font-serif text-4xl tracking-[0.2em] uppercase text-white mb-3 animate-pulse">L'Élite</h1>
        <span className="text-xs uppercase tracking-[0.5em] opacity-60 text-[#E5C07B]">Gastro Suite Pro</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 font-sans overflow-hidden select-none relative">
      <GlobalStyles />
      
      {/* Fondo Ambiental */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E5C07B]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E5C07B]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Navegación Lateral Premium */}
      <aside className="w-24 border-r border-white/5 flex flex-col items-center py-10 gap-8 bg-[#080808]/80 backdrop-blur-xl z-20">
        <div className="w-12 h-12 premium-gradient rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(229,192,123,0.3)] cursor-pointer hover:scale-105 transition-transform duration-500">
          <UtensilsCrossed className="text-[#050505]" size={24} />
        </div>
        
        <nav className="flex flex-col gap-3 w-full px-4">
          <NavItem icon={<LayoutDashboard size={20} />} active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} tooltip="Dashboard" />
          <NavItem icon={<UtensilsCrossed size={20} />} active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} tooltip="Menú" />
          <NavItem icon={<Grid2X2 size={20} />} active={activeTab === 'tables'} onClick={() => setActiveTab('tables')} tooltip="Salón" />
          <NavItem icon={<CalendarDays size={20} />} active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} tooltip="Reservas" />
          <NavItem icon={<ChefHat size={20} />} active={activeTab === 'kitchen'} onClick={() => setActiveTab('kitchen')} tooltip="Cocina" />
          <NavItem icon={<UserCheck size={20} />} active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} tooltip="Clientes VIP" />
          <NavItem icon={<Package size={20} />} active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} tooltip="Bodega" />
        </nav>

        <div className="mt-auto flex flex-col gap-4 w-full px-4">
          <NavItem icon={<Settings size={20} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} tooltip="Ajustes" />
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto custom-scroll p-10 relative z-10">
        
        {/* Header Flotante */}
        <header className="flex justify-between items-center mb-12 sticky top-0 z-30 py-4 -mt-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <div className="h-[1px] w-8 bg-[#E5C07B]"></div>
               <span className="text-[#E5C07B] text-[10px] font-bold tracking-[0.4em] uppercase">Bienvenido, Maitre</span>
            </div>
            <h1 className="text-4xl font-serif text-white tracking-tight">
               {activeTab === 'dash' && "Resumen Ejecutivo"}
               {activeTab === 'menu' && "Carta de Autor"}
               {activeTab === 'tables' && "Gestión de Sala"}
               {activeTab === 'reservations' && "Agenda de Reservas"}
               {activeTab === 'kitchen' && "Pase de Cocina"}
               {activeTab === 'clients' && "Cartera de Clientes"}
               {activeTab === 'inventory' && "Control de Bodega"}
               {activeTab === 'settings' && "Configuración"}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="relative group cursor-pointer">
               <Bell size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
               {notifications > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E5C07B] rounded-full animate-pulse"></span>}
             </div>
             {(activeTab === 'menu' || activeTab === 'inventory' || activeTab === 'clients') && (
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#E5C07B] transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm w-64 focus:outline-none focus:border-[#E5C07B]/40 focus:bg-white/10 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
             )}
             <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="text-right hidden md:block">
                  <p className="text-white text-sm font-medium">Jean-Luc Picard</p>
                  <p className="text-[#E5C07B] text-[10px] uppercase tracking-widest">Gerente</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#E5C07B]/30 p-0.5">
                  <img src="https://i.pravatar.cc/100?u=1" className="w-full h-full rounded-full object-cover grayscale" alt="Profile" />
                </div>
             </div>
          </div>
        </header>

        {/* --- VISTA DASHBOARD --- */}
        {activeTab === 'dash' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <StatsCard title="Ventas Netas" value="$4,820" trend="+12%" icon={<TrendingUp size={20}/>} />
            <StatsCard title="Comensales" value="84" trend="+5%" icon={<Users size={20}/>} />
            <StatsCard title="Ticket Medio" value="$157" trend="-2%" icon={<CreditCard size={20}/>} />
            <StatsCard title="T. Servicio" value="14 min" trend="Óptimo" icon={<Clock size={20}/>} />
            
            <div className="col-span-1 lg:col-span-3 glass-panel rounded-[2rem] p-8 mt-4">
               <h3 className="font-serif text-2xl text-white mb-8 flex items-center gap-4">
                  <Star className="text-[#E5C07B] fill-[#E5C07B]/20" size={20} />
                  Rendimiento Semanal
               </h3>
               <div className="h-64 w-full flex items-end gap-4 px-4">
                  {[45, 72, 48, 95, 68, 88, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                       <div className="w-full bg-white/5 group-hover:bg-[#E5C07B]/20 transition-all duration-500 rounded-t-lg relative overflow-hidden" style={{ height: `${h}%` }}>
                          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#E5C07B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#E5C07B] shadow-[0_0_10px_#E5C07B]"></div>
                       </div>
                       <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest group-hover:text-[#E5C07B] transition-colors">Día {i+1}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-8 mt-4 flex flex-col">
               <h3 className="font-serif text-xl text-white mb-6">Alertas Stock</h3>
               <div className="space-y-4 flex-1">
                  {inventory.filter(i => i.stock < 10).slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                       <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>
                       <div className="flex-1 overflow-hidden">
                          <p className="text-sm text-zinc-200 truncate group-hover:text-white transition-colors">{item.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-red-400">{item.stock} {item.unit}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button onClick={() => setActiveTab('inventory')} className="w-full mt-6 py-3 border border-white/10 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:border-[#E5C07B] hover:text-[#E5C07B] transition-all">
                  Gestionar Bodega
               </button>
            </div>
          </div>
        )}

        {/* --- VISTA MENU --- */}
        {activeTab === 'menu' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5">
              {MENU_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                    ? "bg-[#E5C07B] text-black border-[#E5C07B] font-bold shadow-[0_0_15px_rgba(229,192,123,0.3)]" 
                    : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => addToCart(item)}
                  className="glass-panel rounded-[2rem] p-5 hover-glow transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[#111] relative">
                    <img src={item.img} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={item.name} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                          <Plus size={24} />
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif text-white tracking-tight">{item.name}</h3>
                    <span className="text-[#E5C07B] font-mono font-bold text-lg">${item.price}</span>
                  </div>
                  <p className="text-zinc-500 text-xs italic">Ingredientes seleccionados de origen.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISTA RESERVAS --- */}
        {activeTab === 'reservations' && (
          <div className="glass-panel rounded-[2.5rem] p-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif text-white">Agenda de Hoy</h3>
                <button 
                  onClick={() => setShowReservationModal(true)}
                  className="flex items-center gap-2 bg-[#E5C07B] text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#c4a162] transition-colors shadow-lg shadow-[#E5C07B]/20"
                >
                   <Plus size={16} /> Nueva Reserva
                </button>
             </div>
             
             <div className="space-y-4">
                {reservations.map(res => (
                   <div key={res.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-[#E5C07B]/30 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/10">
                            <Clock size={18} className="text-[#E5C07B] mb-1" />
                            <span className="text-xs font-bold text-white">{res.time}</span>
                         </div>
                         <div>
                            <h4 className="text-lg font-serif text-white">{res.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-xs text-zinc-400 flex items-center gap-1"><Users size={12}/> {res.guests} Pax</span>
                               <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                               <span className="text-xs text-zinc-400 flex items-center gap-1"><Grid2X2 size={12}/> Mesa {res.table}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border ${
                            res.status === 'vip' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                            res.status === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                         }`}>
                            {res.status}
                         </span>
                         <button className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors">
                            <MoreHorizontal size={20} />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VISTA COCINA --- */}
        {activeTab === 'kitchen' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {kitchenOrders.map(order => (
              <div key={order.id} className="glass-panel rounded-[2rem] p-0 overflow-hidden hover-glow transition-all flex flex-col h-full">
                <div className={`p-6 flex justify-between items-center ${
                  order.status === 'ready' ? 'bg-emerald-500/10 border-b border-emerald-500/20' : 
                  order.status === 'cooking' ? 'bg-[#E5C07B]/10 border-b border-[#E5C07B]/20' : 'bg-white/5 border-b border-white/5'
                }`}>
                  <div>
                    <span className="text-2xl font-serif text-white">{order.id}</span>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{order.waiter}</p>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase font-bold opacity-60">Tiempo</span>
                     <span className={`text-xl font-mono font-bold ${order.status === 'cooking' ? 'text-[#E5C07B]' : 'text-white'}`}>{order.time}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 bg-gradient-to-b from-transparent to-black/20">
                   <ul className="space-y-4">
                      {order.items.map((it, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                           <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'ready' ? 'bg-emerald-500' : 'bg-[#E5C07B]'}`}></div>
                              <span className="text-zinc-200">{it.name}</span>
                           </div>
                           <span className="font-mono text-zinc-400">x{it.qty}</span>
                        </li>
                      ))}
                   </ul>
                   {order.notes && (
                     <div className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-3 items-start">
                        <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                        <p className="text-xs italic text-zinc-400 leading-relaxed">"{order.notes}"</p>
                     </div>
                   )}
                </div>

                <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3">
                   <button 
                    onClick={() => { setSelectedOrder(order); setModalType('kitchen-serve'); }}
                    className="flex-1 py-3 bg-[#E5C07B]/10 text-[#E5C07B] border border-[#E5C07B]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E5C07B] hover:text-black transition-all"
                   >
                      Servir
                   </button>
                   <button 
                    onClick={() => { setSelectedOrder(order); setModalType('kitchen-detail'); }}
                    className="flex-1 py-3 bg-white/5 text-zinc-400 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                   >
                      Detalle
                   </button>
                </div>
              </div>
            ))}
            
            {kitchenOrders.length === 0 && (
              <div className="col-span-full h-64 flex flex-col items-center justify-center glass-panel rounded-[2rem] opacity-50">
                <ChefHat size={48} className="text-zinc-500 mb-4" />
                <p className="font-serif text-xl text-zinc-400">Todo el servicio completado</p>
              </div>
            )}
          </div>
        )}

        {/* --- VISTA CLIENTES --- */}
        {activeTab === 'clients' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              {CLIENTS.map(client => (
                 <div key={client.id} className="glass-panel rounded-[2rem] p-8 hover:border-[#E5C07B]/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-2xl font-serif text-[#E5C07B]">
                             {client.name.charAt(0)}
                          </div>
                          <div>
                             <h4 className="text-xl font-serif text-white">{client.name}</h4>
                             <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${
                                client.tier === 'Platinum' ? 'text-zinc-300 border-zinc-500' : 'text-[#E5C07B] border-[#E5C07B]/30'
                             }`}>
                                {client.tier} Member
                             </span>
                          </div>
                       </div>
                       <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                          <Eye size={18} />
                       </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-white/5">
                       <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Visitas</p>
                          <p className="text-white font-mono">{client.visits}</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Gasto Total</p>
                          <p className="text-[#E5C07B] font-mono">{client.spend}</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Última Vez</p>
                          <p className="text-white font-mono">{client.lastVisit}</p>
                       </div>
                    </div>
                    <div>
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Star size={12} className="text-[#E5C07B]" /> Preferencias
                       </p>
                       <p className="text-sm text-zinc-300 italic">"{client.preferences}"</p>
                    </div>
                 </div>
              ))}
           </div>
        )}
        
        {/* --- VISTA INVENTARIO --- */}
        {activeTab === 'inventory' && (
          <div className="glass-panel rounded-[2.5rem] p-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif text-white">Bodega & Stock</h3>
                <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors border border-white/10">
                   <ArrowRightLeft size={16} /> Movimientos
                </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-left border-b border-white/5">
                        <th className="pb-4 pl-4 font-black">Producto</th>
                        <th className="pb-4 font-black">Categoría</th>
                        <th className="pb-4 font-black">Stock</th>
                        <th className="pb-4 font-black">Estado</th>
                        <th className="pb-4 pr-4 font-black text-right">Ajuste</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filteredItems.map(item => (
                       <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-4">
                             <div className="flex items-center gap-4">
                                <img src={item.img} className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                             </div>
                          </td>
                          <td className="py-4 text-xs text-zinc-500 uppercase tracking-wider">{item.category}</td>
                          <td className="py-4 font-mono text-zinc-300">{item.stock} <span className="text-[10px] text-zinc-600 ml-1">{item.unit}</span></td>
                          <td className="py-4">
                             <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider ${
                               item.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                             }`}>
                                {item.stock < 10 ? 'Bajo' : 'OK'}
                             </div>
                          </td>
                          <td className="py-4 pr-4 text-right">
                             <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => updateStock(item.id, -1)} className="p-1 hover:text-red-400 bg-white/5 rounded"><Minus size={12}/></button>
                                <button onClick={() => updateStock(item.id, 1)} className="p-1 hover:text-emerald-400 bg-white/5 rounded"><Plus size={12}/></button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {/* --- VISTA SALÓN --- */}
        {activeTab === 'tables' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl py-4 animate-in fade-in duration-500">
             {TABLES.map(t => (
               <div key={t.id} className="aspect-square glass-panel rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-[#E5C07B]/40 transition-all cursor-pointer relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                     t.status === 'disponible' ? 'from-emerald-500 to-transparent' : 
                     t.status === 'ocupada' ? 'from-[#E5C07B] to-transparent' : 'from-zinc-500 to-transparent'
                  }`}></div>
                  
                  <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold z-10">Mesa</span>
                  <span className={`text-6xl font-serif transition-colors z-10 ${t.status === 'ocupada' ? 'text-[#E5C07B]' : 'text-white'}`}>
                     {t.id % 100}
                  </span>
                  
                  <div className={`mt-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border z-10 backdrop-blur-md ${
                     t.status === 'disponible' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                     t.status === 'ocupada' ? 'bg-[#E5C07B]/10 text-[#E5C07B] border-[#E5C07B]/20' :
                     'bg-zinc-800/50 text-zinc-400 border-zinc-700'
                  }`}>
                     {t.status}
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* --- VISTA CONFIGURACIÓN --- */}
        {activeTab === 'settings' && (
           <div className="max-w-2xl glass-panel rounded-[2.5rem] p-10 animate-in fade-in slide-in-from-bottom duration-500">
              <h3 className="text-2xl font-serif text-white mb-8">Configuración del Sistema</h3>
              
              <div className="space-y-8">
                 <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div>
                       <h4 className="text-white font-medium">Modo Oscuro Profundo</h4>
                       <p className="text-xs text-zinc-500 mt-1">Activar tema Midnight Luxe para entornos nocturnos.</p>
                    </div>
                    <div className="w-12 h-6 bg-[#E5C07B] rounded-full relative cursor-pointer">
                       <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div>
                       <h4 className="text-white font-medium">Notificaciones de Cocina</h4>
                       <p className="text-xs text-zinc-500 mt-1">Recibir alertas sonoras cuando un plato esté listo.</p>
                    </div>
                    <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer border border-white/10">
                       <div className="absolute top-1 left-1 w-4 h-4 bg-zinc-500 rounded-full shadow-md"></div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div>
                       <h4 className="text-white font-medium">Impresión Automática</h4>
                       <p className="text-xs text-zinc-500 mt-1">Enviar ticket a barra al confirmar comanda.</p>
                    </div>
                    <div className="w-12 h-6 bg-[#E5C07B] rounded-full relative cursor-pointer">
                       <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* --- PANEL LATERAL: CARRITO --- */}
      <aside className="hidden xl:flex w-[450px] bg-[#080808] border-l border-white/5 flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-30 relative overflow-hidden">
        {/* Efecto de fondo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5C07B]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="p-10 flex-1 flex flex-col min-h-0 relative z-10">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h2 className="text-3xl font-serif text-white tracking-tight">Comanda Actual</h2>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                   Mesa 102 • <span className="text-[#E5C07B]">VIP Service</span>
                </div>
             </div>
             <button onClick={() => setCart([])} className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all">
                <Trash2 size={20} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scroll">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                 <Wine size={64} className="mb-6 stroke-1" />
                 <p className="font-serif italic text-xl px-10">"La excelencia está en los detalles."</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-5 items-center bg-white/5 p-3 rounded-2xl border border-white/5 animate-in slide-in-from-right duration-300">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black relative">
                    <img src={item.img} className="w-full h-full object-cover opacity-80" alt="" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white leading-tight mb-1">{item.name}</h4>
                    <p className="text-[#E5C07B] text-xs font-mono font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5">
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-[#E5C07B] transition-colors"><Plus size={12} /></button>
                    <span className="text-xs font-mono w-5 text-center text-white">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-[#E5C07B] transition-colors"><Minus size={12} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-10 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/10 relative z-20">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">
              <span>Subtotal</span>
              <span className="font-mono text-zinc-300">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">
              <span>Servicio (10%)</span>
              <span className="font-mono text-zinc-300">${(total * 0.10).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-3xl font-serif text-white pt-6 border-t border-white/10">
              <span>Total</span>
              <span className="text-[#E5C07B] font-mono tracking-tighter">${(total * 1.10).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
            className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${
              cart.length > 0 
              ? "bg-[#E5C07B] text-black shadow-[0_0_30px_rgba(229,192,123,0.2)] hover:scale-[1.02]" 
              : "bg-white/5 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 size={18} />
            Confirmar Orden
          </button>
        </div>
      </aside>

      {/* --- MODAL CHECKOUT --- */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
           <div className="glass-panel p-16 rounded-[3rem] max-w-lg w-full text-center relative overflow-hidden animate-in zoom-in duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent"></div>
              
              <div className="w-24 h-24 bg-[#E5C07B]/10 rounded-full flex items-center justify-center mx-auto mb-10 text-[#E5C07B] border border-[#E5C07B]/20 shadow-[0_0_50px_rgba(229,192,123,0.15)]">
                 <CheckCircle2 size={40} />
              </div>
              
              <h2 className="text-4xl font-serif text-white mb-6">Comanda Exitosa</h2>
              <p className="text-zinc-400 mb-12 font-light italic px-8">La orden ha sido enviada a cocina con prioridad VIP. El tiempo estimado de preparación es de 18 minutos.</p>
              
              <button 
                onClick={() => { setShowCheckout(false); setCart([]); }}
                className="w-full py-5 border border-white/10 hover:border-[#E5C07B] text-white hover:text-[#E5C07B] rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all"
              >
                 Cerrar y Continuar
              </button>
           </div>
        </div>
      )}

      {/* --- MODAL COCINA: SERVIR --- */}
      {modalType === 'kitchen-serve' && selectedOrder && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="glass-panel p-12 rounded-[2.5rem] max-w-md w-full text-center border border-emerald-500/20">
               <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <ChefHat size={32} />
               </div>
               <h3 className="text-3xl font-serif text-white mb-4">¿Platos Listos?</h3>
               <p className="text-zinc-400 mb-8 italic text-sm">Confirma que la orden para la <strong>Mesa {selectedOrder.id}</strong> está completa y lista para ser servida.</p>
               <div className="flex flex-col gap-3">
                  <button 
                     onClick={() => completeOrder(selectedOrder.id)}
                     className="w-full py-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-all"
                  >
                     Confirmar Servicio
                  </button>
                  <button 
                     onClick={() => setModalType(null)}
                     className="w-full py-4 bg-white/5 text-zinc-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10"
                  >
                     Cancelar
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* --- MODAL COCINA: DETALLE --- */}
      {modalType === 'kitchen-detail' && selectedOrder && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="glass-panel p-10 rounded-[2.5rem] max-w-2xl w-full relative">
               <button onClick={() => setModalType(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                  <X size={24} />
               </button>
               <div className="flex justify-between items-start mb-8">
                  <div>
                     <h3 className="text-3xl font-serif text-white">Mesa {selectedOrder.id}</h3>
                     <p className="text-[#E5C07B] text-[10px] uppercase font-bold tracking-widest mt-1">Camarero: {selectedOrder.waiter}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Tiempo</p>
                     <p className="text-2xl font-mono text-white">{selectedOrder.time}</p>
                  </div>
               </div>

               <div className="space-y-6 mb-8">
                  {selectedOrder.items.map((it, idx) => (
                     <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-lg text-zinc-200">{it.name}</span>
                        <span className="text-[#E5C07B] font-mono font-bold bg-[#E5C07B]/10 px-3 py-1 rounded-lg">x{it.qty}</span>
                     </div>
                  ))}
                  {selectedOrder.notes && (
                     <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Notas de Cocina</p>
                        <p className="text-zinc-300 italic">"{selectedOrder.notes}"</p>
                     </div>
                  )}
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setModalType('kitchen-serve')} className="flex-1 py-4 bg-[#E5C07B] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#c4a162]">
                     Marcar para Servir
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* --- MODAL NUEVA RESERVA --- */}
      {showReservationModal && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="glass-panel p-10 rounded-[3rem] max-w-lg w-full relative">
               <button onClick={() => setShowReservationModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white">
                  <X size={24} />
               </button>
               
               <h3 className="text-3xl font-serif text-white mb-2">Nueva Reserva</h3>
               <p className="text-zinc-500 text-xs uppercase tracking-widest mb-8">Registrar cliente en agenda</p>

               <form onSubmit={addReservation} className="space-y-5">
                  <div>
                     <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest ml-2 mb-1 block">Nombre Cliente</label>
                     <input name="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#E5C07B] outline-none transition-all" placeholder="Ej. Familia Grimaldi" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest ml-2 mb-1 block">Hora</label>
                        <input name="time" type="time" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#E5C07B] outline-none transition-all" defaultValue="21:00" required />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest ml-2 mb-1 block">Pax</label>
                        <input name="guests" type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#E5C07B] outline-none transition-all" defaultValue="2" required />
                     </div>
                  </div>
                  <div>
                     <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest ml-2 mb-1 block">Tipo de Evento</label>
                     <div className="flex gap-2">
                        {['Cena', 'Aniversario', 'Negocios', 'VIP'].map(type => (
                           <button type="button" key={type} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase font-bold text-zinc-400 hover:bg-[#E5C07B]/10 hover:text-[#E5C07B] hover:border-[#E5C07B]/30 transition-all">
                              {type}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-[#E5C07B] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#c4a162] mt-4 shadow-lg shadow-[#E5C07B]/20">
                     Confirmar Reserva
                  </button>
               </form>
            </div>
         </div>
      )}

    </div>
  );
};

// --- SUB-COMPONENTES ---

const StatsCard = ({ title, value, trend, icon }) => (
  <div className="glass-panel rounded-[2rem] p-6 hover-glow transition-all group cursor-default">
     <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#E5C07B] border border-white/5 group-hover:bg-[#E5C07B] group-hover:text-black transition-all duration-500">
           {icon}
        </div>
        <span className={`text-[9px] font-black tracking-widest px-2 py-1 rounded border ${
           trend.includes('+') ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
           trend.includes('-') ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-zinc-400 border-white/10'
        }`}>
           {trend}
        </span>
     </div>
     <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2">{title}</p>
     <h4 className="text-3xl font-mono text-white tracking-tighter">{value}</h4>
  </div>
);

const NavItem = ({ icon, active, onClick, tooltip }) => (
  <button 
    onClick={onClick}
    className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${
      active ? "bg-[#E5C07B]/10 text-[#E5C07B] border border-[#E5C07B]/20" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
    }`}
  >
    {icon}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E5C07B] rounded-r-full shadow-[0_0_10px_#E5C07B]"></div>}
    
    {/* Tooltip */}
    <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0">
      {tooltip}
    </div>
  </button>
);

export default App;