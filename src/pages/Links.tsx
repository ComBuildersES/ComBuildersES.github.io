import { useEffect } from 'react';

const Links = () => {
  useEffect(() => {
    // Redirect to Linktree immediately
    window.location.replace('https://linktr.ee/ComBuilders_ES');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirecting to our links page...</p>
      </div>
    </div>
  );
};

export default Links;
