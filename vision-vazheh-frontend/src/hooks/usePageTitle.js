// src/hooks/usePageTitle.js
import { useEffect } from 'react';

// این هوک هیچ ارتباطی با AuthContext ندارد و نباید داشته باشد
function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} - ویژن واژه`;
  }, [title]);
}

export default usePageTitle;