// src/components/Skeleton.jsx
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius = '8px', className = '' }) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius,
  };

  return <div className={`${styles.skeleton} ${className}`} style={style}></div>;
};

export default Skeleton;