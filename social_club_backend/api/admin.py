from django.contrib import admin

from api.models import *

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
            'username',
            'fname',
            'lname',
            'email',
            'dob',
            'gender',
            'is_approved',
            'profile_pic',
            'created_on',

    ]
    list_filter = ['fname']
    search_fields = ['fname']


@admin.register(NewPost)
class PostAdmin(admin.ModelAdmin):
    list_display = [
            'username',
            'caption', 
            'id',
    ]

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
            'id',
            'user',
            'post',
            'report_type',
            'description',
            'created_on',
            'status',
            
    ]
    
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = [
            'id',
            'user',
            'post',
            'text',
    ]

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
        list_display = [
                'id',
                'from_user',
                'to_user',
                'status',
        ]
        
@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
        list_display = [
                'user1',
                'user2',
        ]

        
@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
        list_display = [
                'post',
                'user',
        ]
        
