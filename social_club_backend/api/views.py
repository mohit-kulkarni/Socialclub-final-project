

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import viewsets, permissions
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.utils.decorators import method_decorator
from api.models import *
from api.serializers import *
from django.shortcuts import get_object_or_404
from django.core.serializers import serialize
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.contrib.postgres.search import SearchQuery, SearchVector
#forget password ke liye
# from django.shortcuts import get_object_or_404
# from django.http import JsonResponse
# from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def createUser(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        fname = data.get('fname')
        lname = data.get('lname')
        dob = data.get('dob')
        gender = data.get('gender')
        userImg = data.get('userImg')

        # date_values = dob.split('-')
        # Convert string to date
            

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Ops!! Username already exists.'})

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Ops!! Email already exists.'})

        # Create user in built-in User model
        user_created = User.objects.create_user(username=username, email=email, password=password)
        token, created = Token.objects.get_or_create(user=user_created)

        # print(data)
        
        # Create user in custom model
        custom_user = UserProfile.objects.create(
            fname= fname,
            lname= lname,
            username= username,
            email= email,
            gender= gender,
            profile_pic=  userImg,
            user = user_created,
            token= token
        )

        # print(custom_user)
        return  JsonResponse({'message': 'User created successfully'}, status=201)

    return JsonResponse({'message': 'Invalid request method'}, status=400)

class UserProfileAPIView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        customusers = UserProfile.objects.all()
        serializer = UserProfileSerializer(customusers, many=True)
        return Response(serializer.data)

    def post(self, request):
        print(request.data)
        modified_data = request.data.copy()

        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response("Username or email already exists", status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)

        token = token, created = Token.objects.get_or_create(user=user)

        modified_data['user'] = user
        modified_data['token'] = token

        print(modified_data)
        
        serializer = UserProfileSerializer(data=modified_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Added Successfully!!", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
######## to GET all users ########

@csrf_exempt 
@api_view(['GET'])
@permission_classes([AllowAny])
def list_all_users(request):
    if request.method == 'GET':
        search_term = request.GET.get('search_term', '')
        if search_term:
            vector = SearchVector('username', 'email', 'fname', 'lname')
            query = SearchQuery('~' + search_term)  # Fuzzy match

            # Remove the incorrect check for vector.fields
            users = UserProfile.objects.annotate(search=vector).filter(search=query)
            serializer = UserProfileSerializer(users, many=True)
            return Response(serializer.data)
        else:
            # Retrieve all users without search
            users = UserProfile.objects.all()
            serializer = UserProfileSerializer(users, many=True)
            return Response(serializer.data)
        

####### LOGIN ##########


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            user_details = UserProfile.objects.filter(user=user)
            user_profile_json = serialize('json', user_details)
            user_profiles_data = json.loads(user_profile_json)
            user_profiles_fields = [entry['fields'] for entry in user_profiles_data]

            print(user_profiles_fields)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'userData': user_profiles_fields[0]})
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

@permission_classes([AllowAny])
class UserDetailsView(APIView):
    def get(self, request, user_id, format=None):
        user_profile = get_object_or_404(UserProfile, user__id=user_id)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)



class PostListCreate(generics.ListCreateAPIView):
    
    queryset = NewPost.objects.all()
    serializer_class = PostSerializer
    
    permission_classes = [AllowAny]
    
    # def get(self, request, *args, **kwargs,):
    #     queryset = self.get_queryset()
    #     serializer = self.serializer_class(queryset, many=True)
    #     return Response(serializer.data)

    # def post(self, request, *args, **kwargs):
    #     serializer = self.serializer_class(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class StoryListCreateAPIView(generics.ListCreateAPIView):
    
#     serializer_class = StorySerializer
#     permission_classes = [IsAuthenticated]  # Only authenticated users can access stories

#     def get_queryset(self):
#         user = self.request.user
#         # Filter stories based on whether the viewer is a friend of the story creator
#         # Assuming you have a friendship model called Friendship with user1 and user2 fields
#         friends = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
#         friend_user_ids = list(friends.values_list('user1_id', flat=True)) + list(friends.values_list('user2_id', flat=True))
        
#         # # Retrieve stories with complete user objects (using prefetching)
#         # stories = Story.objects.filter(user_id__in=friend_user_ids).prefetch_related('user')

#         # # Iterate and populate user object in each story instance
#         # for story in stories:
#         #     story.user = get_object_or_404(User, pk=story.user_id)


#         # return stories
#         return Story.objects.filter(user_id__in=friend_user_ids)

class StoryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # friends = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
        # friend_user_ids = list(friends.values_list('user1_id', flat=True)) + list(friends.values_list('user2_id', flat=True))
        # Fetch friendships where the user is user1
        user1_friendships = Friendship.objects.filter(user1=user)
        user1_friend_user_ids = list(user1_friendships.values_list('user2_id', flat=True))
        
        # Fetch friendships where the user is user2
        user2_friendships = Friendship.objects.filter(user2=user)
        user2_friend_user_ids = list(user2_friendships.values_list('user1_id', flat=True))
        
        # Combine friend user IDs from both sides of friendships
        friend_user_ids = user1_friend_user_ids + user2_friend_user_ids
        
        # Filter stories based on friend user IDs
        return Story.objects.filter(user_id__in=friend_user_ids)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        # Manually include user details in each serialized story
        serialized_data = []
        for story_data in serializer.data:
            user_data = story_data.pop('user')  # Remove user data from story data
            story_data['user'] = user_data  # Add user data as a separate key
            serialized_data.append(story_data)
        return Response(serialized_data)

class StoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer

class FriendPostList(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Get the current user
        user = self.request.user
        # Get friends of the current user
        friends = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
        # Extract usernames of friends
        friend_usernames = [friend.user1.username if friend.user1 != user else friend.user2.username for friend in friends]
        # Include current user's username
        friend_usernames.append(user.username)
        # Fetch posts created by friends and the current user, order by latest first
        queryset = NewPost.objects.filter(username__in=friend_usernames).order_by('-created_at')
        return queryset
  

@csrf_exempt
def reportApi(request):
    if request.method=='GET':
        report = Report.objects.all()
        report_serializer = ReportSerializer(report, many=True)
        return JsonResponse(report_serializer.data, safe=False)
    
    elif request.method == 'POST':
        report_data = JSONParser().parse(request)
        post_id = report_data.get('post_id')

        try:
            post = NewPost.objects.get(id=post_id)
        except NewPost.DoesNotExist:
            return JsonResponse({"error": "Invalid post id"}, status=status.HTTP_400_BAD_REQUEST)

        report_data['post'] = post.id
        report_serializer = ReportSerializer(data=report_data)

        if report_serializer.is_valid():
            report_serializer.save()
            return JsonResponse("Added Successfully!!", safe=False)
        return JsonResponse("Failed to Add.", safe=False)
    
    elif request.method=='PUT':
        report_data = JSONParser().parse(request)
       
        report_serializer=ReportSerializer(report,data=report_data)
        if report_serializer.is_valid():
            report_serializer.save()
            return JsonResponse("Updated Successfully!!", safe=False)
        return JsonResponse("Failed to Update.", safe=False)

    elif request.method=='DELETE':
       
        report.delete()
        return JsonResponse("Deleted Successfully!!", safe=False)

# @csrf_exempt 
# @api_view(['GET', 'POST'])
# @permission_classes([AllowAny])
# def friend_requests(request):
#     if request.method == 'GET':
#         user = request.user  # Assuming user is authenticated
#         received_requests = FriendRequest.objects.all()
#         serializer = FriendRequestSerializer(received_requests, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = FriendRequestSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


################### FRIEND REQUESTS ######################

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_friend_requests(request):
    pending_requests = FriendRequest.objects.filter(to_user=request.user, status='pending')
    serializer = FriendRequestSerializer(pending_requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    serializer = FriendRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        # Fetch the corresponding User instance for to_user_id
        to_user_id = serializer.validated_data['to_user_id']
        to_user = User.objects.get(pk=to_user_id)

        # Assign the User instance to the to_user field
        serializer.validated_data['to_user'] = to_user
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):
    try:
        friend_request = FriendRequest.objects.get(pk=request_id)
    except FriendRequest.DoesNotExist:
        return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the requesting user is the recipient of the friend request
    if friend_request.to_user == request.user:
        # Only allow accepting pending friend requests
        if friend_request.status == 'pending':
            # Create a friendship record
            friendship = Friendship.objects.create(user1=friend_request.from_user, user2=friend_request.to_user)
            # Update the friend request status
            friend_request.status = 'accepted'
            friend_request.save()
            return Response({'message': 'Friend request accepted successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Friend request has already been accepted or rejected'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'You are not authorized to accept this friend request'}, status=status.HTTP_403_FORBIDDEN)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reject_friend_request(request, request_id):
    friend_request = FriendRequest.objects.get(pk=request_id)
    if friend_request.to_user == request.user:
        friend_request.status = 'rejected'
        friend_request.save()
        return Response({'message': 'Friend request rejected successfully'}, status=status.HTTP_200_OK)
    return Response({'error': 'You are not authorized to reject this friend request'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def list_friendships(request):
    friendships = Friendship.objects.all()
    serializer = FriendshipSerializer(friendships, many=True)
    return Response(serializer.data) 

class IsFriendAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        from_user_id = request.user.id
        # Check if there is a friendship between the two users
        print(user_id)
        is_friend = Friendship.objects.filter(
            (Q(user1_id=from_user_id) & Q(user2_id=user_id)) |
            (Q(user1_id=user_id) & Q(user2_id=from_user_id))
        ).exists()
        # print(from_user_id, "<==")
        # print(user_id, "=>", is_friend)

        return Response(is_friend, status=status.HTTP_200_OK)
    
# @api_view(['GET'])
# def check_is_friend_batch(request):
#     user_ids = request.GET.getlist('user_ids[]')
#     friend_statuses = {}
#     for user_id in user_ids:
#         # Check if the user is a friend of the authenticated user
#         is_friend = Friendship.objects.filter(from_user=request.user, to_user_id=user_id).exists()
#         friend_statuses[user_id] = is_friend
#     return Response(friend_statuses)

################ COMMENT ##################

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def commentApi(request):
    if request.method == 'GET':
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        user_id = request.data.get("user")
        post_id = request.data.get("post")
        content = request.data.get("text")

        try:
            user = User.objects.get(id=user_id)
            post = NewPost.objects.get(id=post_id)

            body = {
                'user': user.id,
                'post': post.id,
                'text': content
            }

            serializer = CommentSerializer(data=body)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except NewPost.DoesNotExist:
            return Response({"error": "Post does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
    

class Like(generics.ListCreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
   
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        likes = self.get_queryset()
        serializer = self.get_serializer(likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class PostListView(generics.ListAPIView):
    queryset = NewPost.objects.all()
    serializer_class = PostSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def check_user_exists(request):
    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        try:
            user = User.objects.get(username=username, email=email)
            return JsonResponse({'message': 'user exists'})
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'user does not exist'})
        

@api_view(['POST'])
@permission_classes([AllowAny])
def update_password(request):
    if request.method == 'POST':
        new_password = request.data.get('newPassword')
        username = request.data.get('username')
        print(new_password)
        # Update the password for the user (you may need to handle hashing)
        # Example:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return JsonResponse({'message': 'password updated successfully'})
    
# class PostViewSet(viewsets.ModelViewSet):
#     queryset = Post.objects.all().order_by('-created_on')
#     serializer_class = PostSerializer


#     def create(self, request, *args, **kwargs):
#         # Access request data in the create method
#         caption = request.data.get('caption')
#         media_files = request.data.get('media_files')
#         token = request.data.get('token')

#         # user = Token.objects.filter(token = token)

#         try:
#             user = Token.objects.get(key=token).user
#         except Token.DoesNotExist:
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        

#         post = Post.objects.create(post_desc=caption, media_files=media_files, user = user)
#         serializer = self.get_serializer(post)
#         return Response(serializer.data)


# class ReportView(viewsets.ModelViewSet):
#     permission_classes = [AllowAny]
#     queryset = Report.objects.all().order_by('-created_on')
#     serializer_class = ReportSerializer

#     def create(self, request, *args, **kwargs):
#         # Access request data in the create method
#         report_type = request.data.get('report_type')
#         description = request.data.get('description')
#         report_status = request.data.get('status')
#         token = request.data.get('user-token')
#         post_id = request.data.get('post-id')

#         try:
#             user = Token.objects.get(key=token).user
#             print(user)
#         except Token.DoesNotExist:
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
#         try:
#             post = Post.objects.get(id=post_id)
#             # print(post)
#         except Token.DoesNotExist:
#             return Response({"error": "Invalid post id"}, status=status.HTTP_401_UNAUTHORIZED)
        

#         report = Report.objects.create(selectedProblem=report_type, user = user, post = post, status=report_status, description = description )
#         serializer = self.get_serializer(report)
#         return Response(serializer.data)
    



# @csrf_exempt
# def UserProfileView(request,id=0):
#     if request.method=='GET':
#         customuser = UserProfile.objects.all()
#         customuser_serializer = UserProfileSerializer(customuser, many=True)
#         return JsonResponse(customuser_serializer.data, safe=False)
    
#     elif request.method=='POST':
#         customuser_data=JSONParser().parse(request)
#         customuser_serializer = UserProfileSerializer(data=customuser_data)
#         if customuser_serializer.is_valid():
#             customuser_serializer.save()
#             return JsonResponse("Added Successfully!!" , safe=False)
#         return JsonResponse("Failed to Add.",safe=False)
    
#     elif request.method=='PUT':
#         customuser_data = JSONParser().parse(request)
#         customuser=UserProfile.objects.get(id=customuser_data['DepartmentId']) #######
#         customuser_serializer=UserProfileSerializer(customuser,data=customuser_data)
#         if customuser_serializer.is_valid():
#             customuser_serializer.save()
#             return JsonResponse("Updated Successfully!!", safe=False)
#         return JsonResponse("Failed to Update.", safe=False)
    

#     elif request.method=='DELETE':
#         customuser=UserProfile.objects.get(id=id)
#         customuser.delete()
#         return JsonResponse("Deleted Successfully!!", safe=False)
    
# @csrf_exempt
# def postApi(request,id=0):
#     if request.method=='GET':
#         post = Post.objects.all()
#         post_serializer = PostSerializer(post, many=True)
#         return JsonResponse(post_serializer.data, safe=False)
    
#     elif request.method=='POST':
#         post_data=JSONParser().parse(request)
#         post_serializer = PostSerializer(data=post_data)
#         if post_serializer.is_valid():
#             post_serializer.save()
#             return JsonResponse("Added Successfully!!" , safe=False)
#         return JsonResponse("Failed to Add.",safe=False)
    
#     elif request.method=='PUT':
#         post_data = JSONParser().parse(request)
#         post=Post.objects.get(id=post_data['id']) #################
#         post_serializer=PostSerializer(post,data=post_data)
#         if post_serializer.is_valid():
#             post_serializer.save()
#             return JsonResponse("Updated Successfully!!", safe=False)
#         return JsonResponse("Failed to Update.", safe=False)

#     elif request.method=='DELETE':
#         post=UserProfile.objects.get(DepartmentId=id)
#         post.delete()
#         return JsonResponse("Deleted Successfully!!", safe=False)
    
# @csrf_exempt
# def commentApi(request,id=0):
#     if request.method=='GET':
#         comment = Comment.objects.all()
#         comment_serializer = CommentSerializer(comment, many=True)
#         return JsonResponse(comment_serializer.data, safe=False)
    
#     elif request.method=='POST':
#         comment_data=JSONParser().parse(request)
#         comment_serializer = CommentSerializer(data=comment_data)
#         if comment_serializer.is_valid():
#             comment_serializer.save()
#             return JsonResponse("Added Successfully!!" , safe=False)
#         return JsonResponse("Failed to Add.",safe=False)
    
#     elif request.method=='PUT':
#         comment_data = JSONParser().parse(request)
#         comment=Comment.objects.get(id=comment_data['id']) ################
#         comment_serializer=CommentSerializer(comment,data=comment_data)
#         if comment_serializer.is_valid():
#             comment_serializer.save()
#             return JsonResponse("Updated Successfully!!", safe=False)
#         return JsonResponse("Failed to Update.", safe=False)

#     elif request.method=='DELETE':
#         comment=Comment.objects.get(id=id) ###############
#         comment.delete()
#         return JsonResponse("Deleted Successfully!!", safe=False)
 
    
# @csrf_exempt
# def likeApi(request,id=0):
#     if request.method=='GET':
#         like = Like.objects.all()
#         like_serializer = LikeSerializer(like, many=True)
#         return JsonResponse(like_serializer.data, safe=False)
    
#     elif request.method=='POST':
#         like_data=JSONParser().parse(request)
#         like_serializer = LikeSerializer(data=like_data)
#         if like_serializer.is_valid():
#             like_serializer.save()
#             return JsonResponse("Added Successfully!!" , safe=False)
#         return JsonResponse("Failed to Add.",safe=False)
    
#     elif request.method=='PUT':
#         like_data = JSONParser().parse(request)
#         like=Like.objects.get(id=like_data['id']) 
#         like_serializer=LikeSerializer(like,data=like_data)
#         if like_serializer.is_valid():
#             like_serializer.save()
#             return JsonResponse("Updated Successfully!!", safe=False)
#         return JsonResponse("Failed to Update.", safe=False)

#     elif request.method=='DELETE':
#         like=Like.objects.get(id=id) ########
#         like.delete()
#         return JsonResponse("Deleted Successfully!!", safe=False)
    
# @csrf_exempt
# def reportApi(request,id=0):
#     if request.method=='GET':
#         report = Report.objects.all()
#         report_serializer = ReportSerializer(report, many=True)
#         return JsonResponse(report_serializer.data, safe=False)
    
#     elif request.method=='POST':
#         report_data=JSONParser().parse(request)
#         report_serializer = ReportSerializer(data=report_data)
#         if report_serializer.is_valid():
#             report_serializer.save()
#             return JsonResponse("Added Successfully!!" , safe=False)
#         return JsonResponse("Failed to Add.",safe=False)
    
#     elif request.method=='PUT':
#         report_data = JSONParser().parse(request)
#         report=Report.objects.get(id=report_data['id']) #################
#         report_serializer=ReportSerializer(report,data=report_data)
#         if report_serializer.is_valid():
#             report_serializer.save()
#             return JsonResponse("Updated Successfully!!", safe=False)
#         return JsonResponse("Failed to Update.", safe=False)

#     elif request.method=='DELETE':
#         report=Report.objects.get(id=id)  ##################
#         report.delete()
#         return JsonResponse("Deleted Successfully!!", safe=False)
 