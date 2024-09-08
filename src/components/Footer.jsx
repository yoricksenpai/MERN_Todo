
/**
 * Footer component
 *
 * Renders the footer of the application with a copyright statement
 * and a link to the GitHub profile of the creator.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = () => {
  return (
    <>
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm">© 2024 TodoList App. Created by <span className = "text-blue-500"><a href='https://github.com/yoricksenpai'>@yoricksenpai(Johan Priso)</a></span></p>
      </div>
      </footer>
      </>
  );
};

export default Footer;