from django.db import models

class Tag(models.Model):
    tag_id = models.BigAutoField(primary_key=True)
    tag_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.tag_name