from rest_framework import serializers
from api.models import * 
        
class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset = User.objects.all(),
        slug_field= 'id',
    )

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'email', 'profile_pic']  # Include only necessary fields



class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class LikeCountField(serializers.Field):
    def to_representation(self,post):
        return post.like_set.count()


class PostSerializer(serializers.ModelSerializer):
    likes_count = LikeCountField(source='*',read_only=True)

    class Meta:
        model = NewPost
        fields = '__all__'


class StorySerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    class Meta:
        model = Story
        fields = '__all__'

        
# class PostSerializer(serializers.ModelSerializer):
#     user = serializers.SlugRelatedField(
#         queryset = UserProfile.objects.all(),
#         slug_field = 'id'
#     )

#     class Meta:
#         model = Post
#         fields =  '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment  # Change from Comments to Comment
        fields = ['user', 'post', 'text']
 

class ReportSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset = UserProfile.objects.all(),
        slug_field = 'id'
    )
    post = serializers.SlugRelatedField(
        queryset = NewPost.objects.all(),
        slug_field = 'id'
    )
    
    class Meta:
        model = Report
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    from_user_id = serializers.IntegerField()
    to_user_id = serializers.IntegerField()

    class Meta:
        model = FriendRequest
        fields = '__all__'

class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = '__all__'

# class CommentSerializer(serializers.ModelSerializer):
#     user = serializers.SlugRelatedField(
#         queryset = UserProfile.objects.all(),
#         slug_field = 'id'
#     )
#     post = serializers.SlugRelatedField(
#         queryset = Post.objects.all(),
#         slug_field = 'id'
#     )

#     class Meta:
#         model = Comment
#         fields = '__all__'

# class LikeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Like
#         fields = '__all__'

# class ReportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Report
#         fields = '__all__'


                  