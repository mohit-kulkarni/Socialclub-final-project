# serializers.py
from rest_framework import serializers
from .models import NewPost

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewPost
        fields = '__all__'
