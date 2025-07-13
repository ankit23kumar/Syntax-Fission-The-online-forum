from django.contrib import admin
from .models import Question, ViewCount, QuestionTag

admin.site.register(Question)
admin.site.register(ViewCount)
admin.site.register(QuestionTag)
