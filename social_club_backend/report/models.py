from django.db import models
from django.contrib.auth.models import User
from post.models import NewPost

# Create your models here.
class Reports(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(NewPost, on_delete=models.CASCADE)
    reason = models.TextField()

    def __str__(self):
        return f"Report - User: {self.user}, Post: {self.post}, Reason: {self.reason}"
