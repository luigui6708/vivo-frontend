'use client';

import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import { usePathname } from 'next/navigation';

import { SessionData } from '@/lib/session';

interface NavbarProps {
    user: SessionData['user'];
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();

    // Don't show navbar if not logged in
    if (!user?.isLoggedIn) return null;

    const allNavigation = [
        { name: 'Dashboard', href: '/', requiredGroup: null },
        { name: 'Entidades', href: '/entidades', requiredGroup: 'Sales' }, // Contacts often linked to Sales
        { name: 'Recepción', href: '/recepcion', requiredGroup: 'Inventory' },
        { name: 'Producción', href: '/produccion', requiredGroup: 'Manufacturing' },
        { name: 'Calidad', href: '/calidad', requiredGroup: 'Manufacturing' },
        { name: 'Ventas', href: '/ventas', requiredGroup: 'Sales' },
        { name: 'IA 🧠', href: '/inteligencia', requiredGroup: null },
        { name: 'Ayuda ❓', href: '/ayuda', requiredGroup: null },
    ];

    const navigation = allNavigation.filter(item => {
        if (!item.requiredGroup) return true;
        // Check if user has any group containing the required keyword
        // This is a loose check; in production, use precise XML IDs or full names
        return user.groups?.some(g => g.includes(item.requiredGroup!));
    });

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl">ALTOS ERP</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                >
                                    <span className="sr-only">Cerrar Sesión</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-5M18 7.5 21 12m0 0-3 4.5M21 12H9" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
