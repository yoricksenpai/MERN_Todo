import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 sm:py-4 mt-auto">
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <p className="text-center text-xs sm:text-sm">© 2024 TodoList App. Created by <span className="text-blue-400"><a href='https://github.com/yoricksenpai'>@yoricksenpai(Johan Priso)</a></span></p>
      </div>
    </footer>
  );
};

export default Footer;