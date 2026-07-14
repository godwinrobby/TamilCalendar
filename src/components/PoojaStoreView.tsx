/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ShoppingCart, Search, Plus, Minus, Trash2, Check, Star, ShoppingBag, X } from 'lucide-react';
import { PoojaItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PoojaStoreViewProps {
  onClose: () => void;
}

export default function PoojaStoreView({ onClose }: PoojaStoreViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Array<{ item: PoojaItem; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // List of spiritual pooja items
  const items: PoojaItem[] = [
    {
      id: 'p1',
      name: 'Asal Paambu Panchangam 2026',
      tamilName: 'அசல் பாம்பு பஞ்சாங்கம் 2026',
      price: 120,
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
      description: 'The authentic traditional Tamil astrology almanac guide',
      tamilDescription: 'கிரக நிலைகள், நல்ல நேரம் மற்றும் சுபமுகூர்த்த விபரங்கள் அடங்கிய பாரம்பரிய பஞ்சாங்கம்.'
    },
    {
      id: 'p2',
      name: 'Original Karungali Malai (8mm)',
      tamilName: 'அசல் கருங்காலி மாலை (8மிமீ)',
      price: 299,
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200',
      description: 'Handcrafted black ebony wood garland for positive energy',
      tamilDescription: 'வெற்றி மற்றும் நேர்மறை அதிர்வுகளை ஈர்க்கும் தூய்மையான கருங்காலி கட்டை மாலை.'
    },
    {
      id: 'p3',
      name: 'Brass Kuthu Vilakku (Traditional)',
      tamilName: 'பித்தளை குத்துவிளக்கு (ஒரு ஜோடி)',
      price: 499,
      category: 'Pooja',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=200',
      description: 'Heavy traditional hand-polished brass oil lamp pair',
      tamilDescription: 'பூஜை அறையை அலங்கரிக்கும் நேர்த்தியான கைவேலைப்பாடுகள் கொண்ட பித்தளை விளக்கு.'
    },
    {
      id: 'p4',
      name: 'Divine Spatika Lingam Statue',
      tamilName: 'தூய ஸ்படிக லிங்க சிலை',
      price: 350,
      category: 'Statues',
      image: 'https://images.unsplash.com/photo-1609137144813-91180fb2b75a?auto=format&fit=crop&q=80&w=200',
      description: 'Authentic clear quartz crystal Shiva Lingam statue',
      tamilDescription: 'மன அமைதி மற்றும் வழிபாட்டு பலன் தரும் படிக வடிவ லிங்கம்.'
    },
    {
      id: 'p5',
      name: 'Pure Javadhu Scented Powder',
      tamilName: 'அசல் இயற்கை ஜவ்வாது தூள்',
      price: 60,
      category: 'Pooja',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200',
      description: 'Sandalwood-based aromatic natural herbal powder',
      tamilDescription: 'பூஜைக்கு உகந்த மன அமைதியும் தெய்வீக வாசனையும் தரும் இயற்கை மூலிகை ஜவ்வாது.'
    },
    {
      id: 'p6',
      name: 'Panchaloha Om Ring',
      tamilName: 'பஞ்சலோக ஓம் மோதிரம்',
      price: 180,
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200',
      description: 'Five-metal protective ring stamped with sacred Om symbol',
      tamilDescription: 'உடலுக்கு நன்மையும் நேர்மறை எண்ணங்களையும் தரும் பஞ்சலோக மோதிரம்.'
    },
  ];

  const categories = ['all', 'Books', 'Spiritual', 'Pooja', 'Statues'];

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tamilName.includes(searchTerm);
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const addToCart = (item: PoojaItem) => {
    const existing = cart.find((c) => c.item.id === item.id);
    if (existing) {
      setCart(cart.map((c) => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(
      cart.map((c) => {
        if (c.item.id === itemId) {
          const newQty = c.quantity + change;
          return newQty > 0 ? { ...c, quantity: newQty } : c;
        }
        return c;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((c) => c.item.id !== itemId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, c) => total + c.item.price * c.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, c) => count + c.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF0] text-[#5C1A1A] font-sans pb-10" id="pooja_store_container">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706]" id="store_header">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-1 px-3 py-1 bg-[#FDF6E2] text-[#8A1A1A] rounded-lg font-medium text-xs hover:bg-amber-100 transition shadow-inner"
          id="btn_back_dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>முகப்பு (Home)</span>
        </button>
        <h1 className="text-base md:text-lg font-bold font-display flex items-center space-x-2" id="store_title">
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          <span>அங்காடி (Pooja Store)</span>
        </h1>
        
        {/* Shopping Cart Trigger */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 bg-[#FCE5A2] text-[#8A1A1A] rounded-xl hover:bg-amber-200 transition shadow"
          id="btn_open_cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-[10px] font-black w-5 h-5 flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Search Bar */}
      <div className="max-w-md w-full mx-auto px-4 mt-4" id="store_search">
        <div className="relative flex items-center bg-white border-2 border-[#8A1A1A] rounded-2xl shadow-sm px-3 py-1.5" id="search_box">
          <Search className="w-5 h-5 text-amber-800 mr-2" />
          <input 
            type="text" 
            placeholder="ஆன்மீக பொருட்களை தேடவும்..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[#5C1A1A] font-bold text-xs md:text-sm placeholder-amber-800/40"
            id="search_store_input"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-md w-full mx-auto px-4 mt-3" id="store_tabs">
        <div className="flex space-x-1.5 overflow-x-auto scrollbar-none pb-1" id="store_category_scroller">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${selectedCategory === cat ? 'bg-[#8A1A1A] border-[#8A1A1A] text-white shadow-md' : 'bg-white border-amber-200 text-[#8A1A1A] hover:bg-amber-50'}`}
            >
              {cat === 'all' ? 'அனைத்தும்' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Product Grid */}
      <div className="flex-grow max-w-md w-full mx-auto px-4 mt-4 grid grid-cols-2 gap-3" id="store_grid">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-[#FCF8E3] border-2 border-[#8A1A1A]/70 rounded-2xl p-3 flex flex-col justify-between shadow-md hover:border-[#8A1A1A] transition"
            id={`product_${item.id}`}
          >
            {/* Image & Price Tag */}
            <div className="relative rounded-xl overflow-hidden aspect-square border border-amber-200/50 bg-white">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-1.5 left-1.5 bg-[#8A1A1A] text-[#FDF6E2] text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                ₹{item.price}
              </span>
            </div>

            {/* Product description details */}
            <div className="mt-2 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-[#8A1A1A] leading-tight line-clamp-1">{item.tamilName}</h3>
                <span className="text-[9px] font-bold text-amber-800/80 block">{item.name}</span>
                <p className="text-[10px] text-amber-950 font-medium leading-relaxed mt-1 line-clamp-2">
                  {item.tamilDescription}
                </p>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => addToCart(item)}
                className="mt-3 w-full bg-[#8A1A1A] hover:bg-[#A32222] text-[#FDF6E2] py-2 rounded-xl text-[10px] font-bold shadow-md transition flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
                id={`btn_add_to_cart_${item.id}`}
              >
                <Plus className="w-3 h-3" />
                <span>கூடையில் சேர்க்க (Add)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" id="cart_overlay">
            <motion.div 
              initial={{ x: 350 }}
              animate={{ x: 0 }}
              exit={{ x: 350 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="max-w-sm w-full bg-[#FFFDF0] h-full shadow-2xl flex flex-col justify-between"
              id="cart_drawer"
            >
              {/* Header */}
              <div className="bg-[#8A1A1A] text-[#FDF6E2] px-4 py-4 border-b-4 border-amber-500 flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                  <ShoppingCart className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-sm">வாங்குபவர் கூடை (Your Cart)</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-[#A32222] rounded-full transition"
                  id="btn_close_cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto px-4 py-4 space-y-3">
                {cart.length > 0 ? (
                  cart.map((c) => (
                    <div 
                      key={c.item.id} 
                      className="bg-[#FCF8E3] border border-amber-200 rounded-xl p-3 flex items-center justify-between space-x-2"
                      id={`cart_item_${c.item.id}`}
                    >
                      <img 
                        src={c.item.image} 
                        alt={c.item.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-white flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-black text-[#8A1A1A] leading-tight line-clamp-1">{c.item.tamilName}</h4>
                        <span className="text-[10px] text-amber-900 block font-bold mt-0.5">₹{c.item.price} x {c.quantity}</span>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button 
                          onClick={() => updateQuantity(c.item.id, -1)}
                          className="p-1 bg-white border border-amber-300 rounded-lg text-amber-900 hover:bg-amber-100/50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black font-mono w-4 text-center">{c.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(c.item.id, 1)}
                          className="p-1 bg-white border border-amber-300 rounded-lg text-amber-900 hover:bg-amber-100/50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => removeFromCart(c.item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center text-xs text-amber-800 font-bold space-y-2">
                    <ShoppingBag className="w-12 h-12 text-amber-300 animate-pulse" />
                    <p>கூடையில் பொருட்கள் எதுவும் இல்லை.</p>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              <div className="p-4 bg-[#FCF8E3] border-t border-amber-200">
                <div className="flex justify-between items-center font-bold text-sm mb-4">
                  <span className="text-amber-950">மொத்த தொகை (Subtotal):</span>
                  <span className="text-red-700 font-mono font-black text-base">₹{cartTotal}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-[#8A1A1A] hover:bg-[#A32222] text-[#FDF6E2] py-3 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer active:scale-95 text-center flex items-center justify-center space-x-1"
                  id="btn_cart_checkout"
                >
                  <Check className="w-4 h-4" />
                  <span>ஆர்டர் செய்ய (Confirm Order)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Success Popup Modal */}
      <AnimatePresence>
        {isCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="success_modal">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FCF8E3] border-4 border-[#8A1A1A] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-300">
                <Check className="w-8 h-8 font-black animate-bounce" />
              </div>
              <h3 className="text-base md:text-lg font-black text-[#8A1A1A] mt-4">ஆர்டர் வெற்றிகரமாக பதிவானது!</h3>
              <p className="text-xs text-amber-950 font-medium leading-relaxed mt-2">
                ஆன்மீக பொருட்களுக்கான உங்கள் ஆர்டர் பெறப்பட்டது. Cash on Delivery முறையில் 3-5 வேலை நாட்களுக்குள் உங்கள் வீட்டு முகவரியைத் தேடி வரும்.
              </p>
              
              <div className="mt-4 bg-white p-3 rounded-xl border border-amber-200 text-xs font-semibold text-[#8A1A1A] text-left">
                <p>• ஆர்டர் வகை: <span className="font-extrabold text-[#8A1A1A]">தபால் விநியோகம் (COD)</span></p>
                <p>• விநியோக கட்டணம்: <span className="font-extrabold text-emerald-700">இலவசம் (Free Delivery)</span></p>
              </div>

              <button
                onClick={() => setIsCheckoutSuccess(false)}
                className="mt-5 w-full bg-[#8A1A1A] text-[#FDF6E2] py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#A32222] transition cursor-pointer"
                id="btn_success_modal_ok"
              >
                சரி (OK)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
