from django.db import models

# Create your models here.
class NewPost(models.Model):
    username = models.CharField(max_length=1002,blank=True)
    image_or_video = models.ImageField(upload_to='posts/')
    caption = models.TextField()
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.username}"