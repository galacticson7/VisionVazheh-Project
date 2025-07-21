// src/pages/HelpPage.jsx
import styles from './HelpPage.module.css';
import { FaBrain, FaFire, FaMedal, FaStar, FaThLarge } from 'react-icons/fa';

const AccordionItem = ({ icon, title, children, defaultOpen = false }) => {
  return (
    <details className={styles.accordionItem} open={defaultOpen}>
      <summary className={styles.accordionTitle}>
        <span className={styles.accordionIcon}>{icon}</span>
        {title}
      </summary>
      <div className={styles.accordionContent}>
        {children}
      </div>
    </details>
  );
};

export default function HelpPage() {
  return (
    <div className={styles.helpContainer}>
      <h1 className={styles.title}>راهنمای سفر کهکشانی</h1>
      
      <AccordionItem icon={<FaThLarge />} title="بخش‌های اصلی برنامه" defaultOpen={true}>
        <div className={styles.sectionDetail}>
          <h4>خانه (Home)</h4>
          <p>نقطه شروع سفر شماست. در این بخش لیست تمام دروس را می‌بینید و با کلیک روی هرکدام، برای یادگیری اولیه لغات وارد آن می‌شوید.</p>
        </div>
        <div className={styles.sectionDetail}>
          <h4>تمرین (Practice)</h4>
          <p>قلب تپنده یادگیری! لغاتی که در بخش یادگیری به لیست مرور اضافه کرده‌اید، اینجا برای آزمون و تثبیت در حافظه نمایش داده می‌شوند.</p>
        </div>
        <div className={styles.sectionDetail}>
          <h4>پروفایل (Profile)</h4>
          <p>در این بخش می‌توانید آمار پیشرفت خودتان، مانند امتیاز کل، تعداد روزهای استریک فعال و مدال‌هایی که کسب کرده‌اید را ببینید.</p>
        </div>
      </AccordionItem>

      <AccordionItem icon={<FaBrain />} title="سیستم مرور هوشمند چطور کار می‌کند؟">
        <p>
          اپلیکیشن ما از روش علمی مرور فاصله‌دار (SRS) استفاده می‌کند. این سیستم تضمین می‌کند که شما لغات را درست زمانی مرور کنید که نزدیک به فراموش کردنشان هستید. این کار به انتقال لغات به حافظه بلندمدت کمک می‌کند.
        </p>
        <p><strong>برنامه مرور به این شکل است:</strong></p>
        <ul className={styles.srsList}>
          <li>بعد از اولین پاسخ صحیح ➔ مرور بعدی: <strong>۱ روز بعد</strong></li>
          <li>بعد از دومین پاسخ صحیح ➔ مرور بعدی: <strong>۳ روز بعد</strong></li>
          <li>بعد از سومین پاسخ صحیح ➔ مرور بعدی: <strong>۱ هفته بعد</strong></li>
          <li>بعد از چهارمین پاسخ صحیح ➔ مرور بعدی: <strong>۱۶ روز بعد</strong></li>
        </ul>
        <p>اگر کلمه‌ای را "فراموش کردم" بزنید، به مرحله اول برمی‌گردد و فوراً برای تمرین مجدد در دسترس قرار می‌گیرد!</p>
      </AccordionItem>
      
      <AccordionItem icon={<FaFire />} title="استریک (Streak) و امتیاز چیست؟">
        <p>
          <strong>امتیاز (Stardust):</strong> با هر پاسخ صحیح در بخش تمرین، شما <strong>۱۰ امتیاز "گرد و غبار ستاره‌ای"</strong> دریافت می‌کنید. این امتیازها در آینده برای شرکت در رتبه‌بندی‌های هفتگی و باز کردن مراحل جدید استفاده خواهند شد.
        </p>
        <p>
          <strong>استریک (Streak):</strong> تعداد روزهای متوالی است که شما در اپلیکیشن تمرین می‌کنید. حفظ کردن استریک، نشان‌دهنده تعهد شما به یادگیری است و در آینده به شما امتیازات ویژه‌ای خواهد داد.
        </p>
      </AccordionItem>

      {/* بخش جدید برای نمایش لیست مدال‌ها */}
      <div className={styles.achievementListSection}>
          <h2 className={styles.listTitle}><FaMedal /> دستاوردها و مدال‌ها</h2>
          <div className={styles.achItem}>
              <span className={styles.achIcon}>🥇</span>
              <div className={styles.achText}>
                  <h4>کاشف تازه کار</h4>
                  <p>شرط دریافت: افزودن اولین لغت به لیست مرور.</p>
              </div>
          </div>
          <div className={styles.achItem}>
              <span className={styles.achIcon}><FaStar /></span>
              <div className={styles.achText}>
                  <h4>ستاره‌شناس</h4>
                  <p>شرط دریافت: کسب ۱۰۰ امتیاز "گرد و غبار ستاره‌ای".</p>
              </div>
          </div>
          <div className={styles.achItem}>
              <span className={styles.achIcon}>🚀</span>
              <div className={styles.achText}>
                  <h4>کهکشان‌نورد</h4>
                  <p>شرط دریافت: یادگیری کامل ۵۰۰ لغت (رساندن به مرحله ۵).</p>
              </div>
          </div>
          <div className={styles.achItem}>
              <span className={styles.achIcon}>🔥</span>
              <div className={styles.achText}>
                  <h4>فضانورد ثابت‌قدم</h4>
                  <p>شرط دریافت: رسیدن به استریک ۳۰ روزه.</p>
              </div>
          </div>
      </div>
    </div>
  );
}