import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { SiteConfig } from "../types/product";

interface NavbarProps {
  siteConfig: SiteConfig;
  cartItemCount?: number;
}

export default function Navbar({
  siteConfig,
  cartItemCount = 0,
}: Readonly<NavbarProps>) {
  return (
    <nav className="bg-surface border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              {siteConfig.logo && (
                <img
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  className="h-8 w-auto"
                />
              )}
              <span className="text-xl font-bold text-primary">
                {siteConfig.name}
              </span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-text hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="/shop"
              className="text-text hover:text-primary transition-colors"
            >
              Shop
            </a>
            <a
              href="/about"
              className="text-text hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-text hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center">
            <a
              href="/cart"
              className="relative p-2 text-text hover:text-primary transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="text-text hover:text-primary transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
