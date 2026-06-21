import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems, setIsCartOpen } = useCart();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'Offers', path: '/offers' },
        { name: 'Events', path: '/events' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
            <div className="container mx-auto px-4">
                <div className={`mx-auto max-w-7xl flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 glass-panel ${isScrolled ? 'bg-black/80 shadow-lg border-white/10' : 'bg-black/20 border-white/5'}`}>
                    <Link to="/" className="text-2xl font-bold font-[Playfair_Display] text-white hover:scale-105 transition-transform">
                        pro cafe<span className="text-cafe-brown">.</span>
                    </Link>

                    <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-cafe-brown' : 'text-gray-300 hover:text-white'}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* User Auth controls */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/profile" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:text-cafe-brown transition-colors">
                                    <UserIcon size={16} className="text-cafe-brown" />
                                    {user.name.split(' ')[0]}
                                </Link>
                                <Link to="/orders" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                                    Orders
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-[10px] font-bold uppercase tracking-widest text-pizza-red hover:text-white transition-colors ml-1"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:text-cafe-brown transition-colors"
                            >
                                <UserIcon size={16} />
                                Login
                            </Link>
                        )}

                        {/* Shopping Cart Trigger */}
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white/5 border border-white/10 hover:border-cafe-brown hover:text-cafe-brown text-white p-2.5 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center"
                            aria-label="Open Cart"
                        >
                            <ShoppingBag size={18} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-cafe-brown text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-neutral-900 shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 glass-panel border-t border-white/10 mt-2 p-4 flex flex-col gap-4 mx-4 rounded-2xl bg-black/90 pt-8 pb-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-medium text-gray-300 hover:text-white text-center"
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    {user ? (
                        <>
                            <NavLink
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-gray-300 hover:text-white text-center"
                            >
                                Profile ({user.name})
                            </NavLink>
                            <NavLink
                                to="/orders"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-gray-300 hover:text-white text-center"
                            >
                                My Orders
                            </NavLink>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    logout();
                                }}
                                className="text-lg font-medium text-pizza-red text-center"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-medium text-gray-300 hover:text-white text-center"
                        >
                            Login / Register
                        </NavLink>
                    )}
                    <button 
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsCartOpen(true);
                        }} 
                        className="bg-cafe-brown hover:bg-pizza-red transition-colors rounded-full py-3 text-center text-white font-semibold mt-4 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={16} />
                        View Cart ({totalItems})
                    </button>
                </div>
            )}
        </header>
    );
}
