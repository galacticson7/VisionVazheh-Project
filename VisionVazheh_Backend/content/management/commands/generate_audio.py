# content/management/commands/generate_audio.py

import os
from gtts import gTTS
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from content.models import Word, Lesson

class Command(BaseCommand):
    help = 'Generates audio pronunciation for a predefined list of words'

    def handle(self, *args, **kwargs):
        words_to_process = [
            'endanger', 'nature', 'future', 'instead', 'protect',
            'destroy', 'wild', 'animal', 'mean', 'pay attention',
            'increase', 'hopefully', 'planet', 'life', 'save'
        ]

        lesson, created = Lesson.objects.get_or_create(
            grade=10,
            lesson_number=1,
            defaults={'title': 'Saving Nature'}
        )

        audio_dir = os.path.join(settings.MEDIA_ROOT, 'pronunciations')
        os.makedirs(audio_dir, exist_ok=True)
        
        self.stdout.write("Starting audio generation...")

        for word_text in words_to_process:
            if Word.objects.filter(english_word=word_text, audio_pronunciation__isnull=False).exists():
                self.stdout.write(f"'{word_text}' already has audio. Skipping.")
                continue

            try:
                tts = gTTS(text=word_text, lang='en', slow=False)
                
                # --- تغییر اصلی اینجاست ---
                # فاصله را با آندرلاین جایگزین می‌کنیم تا نام فایل صحیح باشد
                safe_filename = f"{word_text.replace(' ', '_')}.mp3"
                file_path = os.path.join('pronunciations', safe_filename)
                # -------------------------

                full_path = os.path.join(settings.MEDIA_ROOT, file_path)
                tts.save(full_path)

                word, created = Word.objects.update_or_create(
                    english_word=word_text,
                    lesson=lesson,
                    defaults={
                        'persian_meaning': 'معنی بعدا اضافه شود',
                        'audio_pronunciation': file_path
                    }
                )
                
                self.stdout.write(self.style.SUCCESS(f"Successfully generated audio for '{word_text}'"))
                
                time.sleep(2)

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Could not process '{word_text}': {e}"))

        self.stdout.write(self.style.SUCCESS("Finished generating all audio files."))