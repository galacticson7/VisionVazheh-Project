// src/pages/AuthForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiUser } from 'react-icons/fi'; // FiUser اضافه شد
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import PhoneInput from 'react-phone-number-input';
import usePageTitle from '../hooks/usePageTitle';

import 'react-phone-number-input/style.css';
import styles from './AuthForm.module.css';

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  usePageTitle(isLogin ? 'ورود' : 'ثبت‌نام');

  const [username, setUsername] = useState(''); // --- برای نام کاربری
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setError(''); setSuccess('');
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    const payload = isLogin 
      ? { username, password } 
      : { username, phone_number: phoneNumber, password, password2 };
      
    if (!isLogin && !phoneNumber) return setError('لطفاً شماره موبایل را وارد کنید.');
    if (!isLogin && password !== password2) { return setError('رمزهای عبور با هم مطابقت ندارند.'); }
    
    try {
      const url = isLogin ? '/users/token/' : '/users/register/';
      const response = await axiosInstance.post(url, payload);
      const data = response.data;

      if (isLogin) {
        login(data);
        navigate('/');
      } else {
        setSuccess('ثبت‌نام موفق! در حال انتقال به صفحه ورود...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.detail || errorData?.username?.[0] || errorData?.phone_number?.[0] || 'خطایی رخ داد.';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.formCard}>
        <h2>{isLogin ? 'ورود به ویژن واژه' : 'ساخت حساب کاربری'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label>{isLogin ? 'نام کاربری یا شماره موبایل' : 'نام کاربری'}</label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className={styles.inputField} />
            </div>
          </div>
          
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>شماره موبایل</label>
              <div className={styles.inputWrapper}>
                <PhoneInput international defaultCountry="IR" value={phoneNumber} onChange={setPhoneNumber} required />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>رمز عبور</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={styles.inputField} />
            </div>
          </div>
          
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>تکرار رمز عبور</label>
               <div className={styles.inputWrapper}>
                <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} required className={styles.inputField} />
               </div>
            </div>
          )}

          <button type="submit" className={styles.btnAuth}>
            {isLogin ? 'ورود' : 'ثبت‌نام'}
          </button>
          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
          {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}
        </form>
        <p className={styles.switchLink}>
          {isLogin ? 'حساب کاربری ندارید؟' : 'حساب کاربری دارید؟'}{' '}
          <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}</Link>
        </p>
      </div>
    </div>
  );
}