from django.db import models
from users.models import User

class Vote(models.Model):
    VOTE_TYPES = [('upvote', 'Upvote'), ('downvote', 'Downvote')]
    TARGET_TYPES = [('question', 'Question'), ('answer', 'Answer')]

    vote_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    target_type = models.CharField(max_length=10, choices=TARGET_TYPES)
    target_id = models.BigIntegerField()
    vote_type = models.CharField(max_length=10, choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
