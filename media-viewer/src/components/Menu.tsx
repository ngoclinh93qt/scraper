
import Link from 'next/link';
import { ReactNode } from 'react';

export type MenuProps = {
  children: ReactNode
}

const Menu = ({ children }: MenuProps) => {
  return (
    <div className="min-h-screen">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-lg font-bold hover:text-gray-200">
                Home
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/upload"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  Upload
                </Link>
                <Link
                  href="/serverside"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  Server Side Render
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">{children}</main>
    </div>
  );
};

export default Menu;
