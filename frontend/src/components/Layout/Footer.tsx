import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200  py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <img
                src="../../../public/logo.png"
                alt="HobbyRoadmap"
                className="max-h-10"
              />
            </Link>
            <p className="text-sm text-gray-600 max-w-md mx-auto md:mx-0">
              Discover structured learning paths for your favorite hobbies. 
              Track progress, take quizzes, and master new skills at your own pace.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/roadmaps" className="hover:text-primary transition-colors">Roadmaps</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} HobbyRoadmap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
