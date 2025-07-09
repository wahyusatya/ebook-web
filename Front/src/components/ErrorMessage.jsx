const ErrorMessage = ({ message, darkMode }) => {
  if (!message) return null;

  return (
    <div className={`p-4 mb-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'}`}>
      {message}
    </div>
  );
};

export default ErrorMessage;