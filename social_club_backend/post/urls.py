# urls.py
from django.urls import path
from .views import PostListCreate

urlpatterns = [
    path('', PostListCreate.as_view(), name='post-list-create'),
]
