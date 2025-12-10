import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <svg
                        className="mx-auto h-12 w-12 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Acceso Denegado</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        No tienes los permisos necesarios para acceder a esta sección.
                    </p>
                </div>
                <div className="mt-5">
                    <Link
                        href="/"
                        className="font-medium text-green-600 hover:text-green-500"
                    >
                        Volver al Inicio &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
