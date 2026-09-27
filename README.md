# سازنده گواهینامه (Certificate Studio)

## About / درباره پروژه

### English

This software allows you to create certificates that are not only visually appealing and attractive but also genuinely credible. It is ideal for private tutors and centers that need to issue verified credentials. By issuing these professional documents, instructors can validate their expertise and build their personal brand, eliminating the need to rely on providers of fake or illegitimate certificates—such as those dubious, obscure, or non-existent institutions. This is a groundbreaking project that enables you to establish and prove your professional credibility.

### فارسی

این یک نرم‌افزار است برای ایجاد سرتیفیکیت‌های زیبا و جذاب و البته معتبر. مناسب برای مدرس‌های خصوصی و مراکزی که نیاز به ارائه مدرک تاییدشده دارند. مدرسان می‌توانند با ارائه مدارک و مستندات تخصصی خود، ضمن تایید هویت و اصالت تخصص، برند خود را توسعه دهند و دیگر نیاز به ارائه‌دهنده‌های سرتیفیکیت‌های نامعتبر و جعلی نداشته باشند — آن هم از مراکز و موسسات بی‌نام‌ونشان جعلی و بی‌اعتباری که اصلاً وجود خارجی ندارند.

اینجا یک پروژه فضایی است که باعث می‌شود اعتبار خودت را ثابت کنی.

---

اپلیکیشن وب **ایستا و مستقل** برای طراحی گواهینامه چندزبانه (محتوای گواهی: فارسی / انگلیسی / عربی — زبان رابط: فارسی / English).

QRهای پیش‌نمایش **نمونه** هستند. برای **کیوآرکد معتبر** تایید اصالت و هویت مدرس به سایت [pandenik.ir](https://pandenik.ir) مراجعه کنید.

## اجرا

```bash
# ویندوز
start-windows.bat

# یا
python -m http.server 8080
```

سپس `http://127.0.0.1:8765` یا `http://localhost:8080` را باز کنید.

## انتشار روی GitHub / هاست استاتیک

فایل‌های لازم برای آپلود:

- `index.html`, `sw.js`
- `css/`, `js/`, `vendor/`, `assets/`

پوشه `tools/` فقط برای ساخت قالب است و برای اجرای سایت لازم نیست.

```bash
git add .
git commit -m "Release: bilingual UI, sample QR, privacy defaults"
gh repo create certificate-studio --public --source=. --remote=origin --push
```

یا ریپو را در GitHub بسازید و `git remote add origin …` سپس `git push -u origin master`.

## امنیت و حریم خصوصی

- توکن احراز هویت **هرگز** در `localStorage` ذخیره نمی‌شود.
- نام‌های پیش‌فرض عمومی‌اند: «هنرجو یا کارآموز» و «مدرس» (بدون نام واقعی افراد).
- فایل‌های `.env`، نمونه‌های محلی و زیپ‌ها در `.gitignore` هستند.
- جزئیات بیشتر: [SECURITY.md](./SECURITY.md)

## اتصال اختیاری به پندنیک

اگر داخل پنل پندنیک (iframe) باز شود، با `postMessage` می‌توان QR واقعی و ذخیره گواهی را فعال کرد. بدون اتصال هم طراحی و خروجی PNG/PDF با QR نمونه کار می‌کند.

## مجوز

MIT — فایل `LICENSE`
