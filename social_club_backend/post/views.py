# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import NewPost
from .serializers import PostSerializer
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt



# @permission_classes([IsAuthenticated])

class PostListCreate(generics.ListCreateAPIView):
    
   
    queryset = NewPost.objects.all()
    serializer_class = PostSerializer
    
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs,):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
