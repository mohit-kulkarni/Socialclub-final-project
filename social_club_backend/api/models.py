import os
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
# from post.models import NewPost


class UserProfile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fname = models.CharField(max_length=50, null=True)
    lname = models.CharField(max_length=50, null=True)
    username = models.CharField(max_length=50, default='')
    email = models.CharField(max_length=100, default='')
    dob = models.DateField(null=True, blank=True)
    GENDER_CHOICES = [('F', 'Female'),('M', 'Male'),('O', 'Other'),]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    profile_pic = models.FileField(upload_to='public/static/profile_pictures/', default='public/static/profile_pictures/no_user.jpg')
    created_on = models.DateTimeField(default=timezone.now)
    token = models.OneToOneField(Token, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    # def save(self, *args, **kwargs):
    #     # Ensure password is hashed before saving
    #     if self.password:
    #         self.set_password(self.password)
    #     super().save(*args, **kwargs)

class NewPost(models.Model):
    username = models.CharField(max_length=1002,blank=True)
    image_or_video = models.FileField(upload_to='public/static/posts/')
    caption = models.TextField()
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.username}"
    
########### STORY ###########
class Story(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    caption = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='stories/images/', blank=True, null=True)
    video = models.FileField(upload_to='stories/videos/', blank=True, null=True)
    created_at = models.DateTimeField( default=timezone.now)
    
    def is_valid(self):
        return self.created_at >= timezone.now() - timedelta(hours=24)

    def __str__(self):
        return f"Story by {self.user.username}"
    
    class Meta:
        verbose_name = 'Story'
        verbose_name_plural = 'Stories'
    
########################################################################################
############################# NEW POST WITH MULTIPLE FILES #############################
########################################################################################

# class NewPost(models.Model):
#     username = models.CharField(max_length=1002, blank=True)
#     caption = models.TextField()
#     location = models.CharField(max_length=100, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Post by {self.username}"

# class PostMedia(models.Model):
#     post = models.ForeignKey(NewPost, related_name='media', on_delete=models.CASCADE)
#     file = models.FileField(upload_to='public/static/posts/')

########################################################################################
########################################################################################
########################################################################################

    
class FriendRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]

    from_user = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1_friendships', default=None)
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2_friendships', default=None)
    class Meta:
        unique_together = ['user1', 'user2']

def validate_media_file(value):
    # Get the file extension
    ext = os.path.splitext(value.name)[1].lower()
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp3', '.wav', '.mp4', '.mov']
    if ext not in valid_extensions:
        raise ValidationError('Unsupported file format.')
    

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(NewPost, on_delete=models.CASCADE)  
    text = models.TextField()

    def __str__(self):
        return f"{self.text}"


class Like(models.Model):
    post = models.ForeignKey(NewPost, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')


    def __str__(self):
        return f"{self.user.username} liked post ID: {self.post.id}"


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_bookmarks')
    post = models.ForeignKey(NewPost, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class Report(models.Model):
    REPORT_TYPES = (
        ('spam', 'Spam'),
        ('scam', 'Scam or Fraud'),
        ('hate_speech', 'Hate Speech or Symbols'),
        ('false_information', 'False Information'),
        ('violence', 'Violence or Dangerous Organizations'),
        ('intellectual_property', 'Intellectual Property Violation'),
        ('illegal_goods', 'Sale of Illegal or Regulated Goods'),
        ('suicide_self_injury', 'Suicide or Self-Injury'),
        ('eating_disorders', 'Eating Disorders'),
        ('other', 'Something Else')
    )


    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]


    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey(NewPost, on_delete=models.CASCADE)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    description = models.TextField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Report for Post ID: {self.post.id} - Type: {self.report_type}"
    
