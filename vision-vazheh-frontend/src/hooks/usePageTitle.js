// src/hooks/usePageTitle.js
import { useEffect } from 'react';

// این هوک سفارشی، عنوان صفحه را در تب مرورگر به‌روز می‌کند
function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} - ویژن واژه`;
  }, [title]);
}

export default usePageTitle;