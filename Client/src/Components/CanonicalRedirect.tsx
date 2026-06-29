import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CanonicalRedirect = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const lowerCasePath = pathname.toLowerCase();
    const withoutTrailingSlash = lowerCasePath !== '/' ? lowerCasePath.replace(/\/+$/, '') : '/';

    if (pathname !== withoutTrailingSlash) {
      navigate(`${withoutTrailingSlash}${search}${hash}`, { replace: true });
    }
  }, [hash, navigate, pathname, search]);

  return null;
};

export default CanonicalRedirect;
