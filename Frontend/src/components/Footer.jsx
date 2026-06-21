import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-[Playfair_Display] text-2xl font-bold mb-2">pro cafe<span className="text-cafe-brown">.</span></h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Modern urban café bringing community energy, fresh flavors, and premium e-commerce convenience to your table.</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-gray-400 font-mono">System Online</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Explore</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-400">
                            <li><Link to="/menu" className="hover:text-cafe-brown transition-colors">Menu</Link></li>
                            <li><Link to="/offers" className="hover:text-cafe-brown transition-colors">Offers</Link></li>
                            <li><Link to="/events" className="hover:text-cafe-brown transition-colors">Events</Link></li>
                            <li><Link to="/gallery" className="hover:text-cafe-brown transition-colors">Gallery</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-400">
                            <li>Kailsa Road Street, Pakwara</li>
                            <li>contact@pizzamakercafe.com</li>
                            <li>+91 8057516983 </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Hours</h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-400">
                            <li>Open 10AM – 10PM</li>
                            <li>7 Days a Week</li>
                            <li className="text-cafe-brown mt-2">Delivery within 2KM</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-[15vw] leading-none font-[Playfair_Display] font-bold text-center text-white/5 select-none text-cafe-brown/10">
                    PRO CAFE
                </h2>

                <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-white/10 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Pro Cafe. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
