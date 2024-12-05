import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from './Logo'
import { Github, Twitter, Linkedin } from 'lucide-react'
import React from "react";

export function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white mt-12 border-t border-gray-200"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold text-foreground">
                Club<span className="text-primary">Dev</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 mt-2">Log Your Journey, Build Your Masterpiece</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">About</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ClubDev. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/clubdev" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/clubdev" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/company/clubdev" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

