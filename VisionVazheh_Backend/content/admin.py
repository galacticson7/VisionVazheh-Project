from django.contrib import admin
from .models import Lesson, Word, ExampleSentence

# Register your models here.
admin.site.register(Lesson)
admin.site.register(Word)
admin.site.register(ExampleSentence)