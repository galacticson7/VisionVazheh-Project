# content/models.py
from django.db import models

class Lesson(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان درس")
    lesson_number = models.PositiveIntegerField(verbose_name="شماره درس")
    grade = models.IntegerField(choices=[(10, 'دهم'), (11, 'یازدهم'), (12, 'دوازدهم')], verbose_name="پایه تحصیلی")
    # فیلد جدید برای نام آیکون
    icon_name = models.CharField(max_length=50, default='book', verbose_name="نام آیکون")

    class Meta:
        verbose_name = "درس"
        verbose_name_plural = "درس‌ها"
        unique_together = ('lesson_number', 'grade')
        ordering = ['grade', 'lesson_number']

    def __str__(self):
        return f"پایه {self.get_grade_display()} - درس {self.lesson_number}: {self.title}"

class Word(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='words', verbose_name="درس مربوطه")
    english_word = models.CharField(max_length=100, unique=True, verbose_name="لغت انگلیسی")
    persian_meaning = models.CharField(max_length=255, verbose_name="معنی فارسی")
    phonetic = models.CharField(max_length=100, blank=True, null=True, verbose_name="تلفظ نوشتاری")
    audio_pronunciation = models.FileField(upload_to='pronunciations/', blank=True, null=True, verbose_name="فایل صوتی تلفظ")

    class Meta:
        verbose_name = "لغت"
        verbose_name_plural = "لغات"
        ordering = ['english_word']

    def __str__(self):
        return self.english_word

class ExampleSentence(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='examples', verbose_name="لغت مربوطه")
    sentence_text = models.TextField(verbose_name="متن جمله")
    audio_sentence = models.FileField(upload_to='sentences/', blank=True, null=True, verbose_name="فایل صوتی جمله")

    class Meta:
        verbose_name = "جمله مثال"
        verbose_name_plural = "جملات مثال"

    def __str__(self):
        return f"Example for {self.word.english_word}: {self.sentence_text[:30]}..."