# from django.conf.urls import url
from django.urls import path, include
from api.views import *
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings
# from post.views import *

router = routers.DefaultRouter()

# router.register(r'posts', PostViewSet,basename='posts')
# router.register(r'reports', ReportView,basename='reports')

urlpatterns=[

    # path('department/$',views.departmentApi),
    path('users/', createUser, name='users'),
    path('login/', LoginView.as_view(), name='usersLogin'),
    path('user-detail/', list_all_users, name='list-all-users'),
    path('user-details/', getUserDetails, name= 'getUserDetails'),
    path('user-details/<int:user_id>/', UserDetailsView.as_view(), name='user-details'),
    path('post/', PostListCreate.as_view(), name='post-list-create'),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('comment/',commentApi),
    path('pending-friend-requests/', get_pending_friend_requests, name='get_pending_friend_requests'),
    path('send-friend-request/', send_friend_request, name='send_friend_request'),
    path('friend-request/<int:request_id>/accept/', accept_friend_request, name='accept_friend_request'),
    path('friend-request/<int:request_id>/reject/', reject_friend_request, name='reject_friend_request'),
    path('friendships/', list_friendships, name='friendships'),
    path('like/', Like.as_view(), name='like-list-create'),
    path('report/',reportApi),
    path('check-user-exists/', check_user_exists, name='check_user_exists'),
    path('update-password/', update_password, name='update_password'),
    path('friends-posts/', FriendPostList.as_view(), name='friends-posts'),
    # path('api/is-friend/batch/', check_is_friend_batch),
    path('is-friend/<int:user_id>/', IsFriendAPIView.as_view(), name='is_friend'),
    path('user-profile/<int:user_id>/', UserProfileDetailView.as_view(), name='user_profile_detail'),
    # Adjust your URL configuration to capture a user's PK
    path('bookmarks/', BookmarkCreateAPIView.as_view(), name='create_bookmark'),
    path('delbookmarks/<int:pk>/', BookmarkDeleteAPIView.as_view(), name='delete_bookmark'),
    path('bookmarks/<int:user_id>/', UserBookmarkDetailAPIView.as_view(), name='user_bookmarks_detail'),

    # path('post/',postApi),  
    # path('comment/',commentApi),
    # path('like/',likeApi),
    # path('follower/',views.followerApi),

    # path('SaveFile$', views.SaveFile)
    path('stories/', StoryListCreateAPIView.as_view(), name='story-list-create'),
    path('stories/<int:pk>/', StoryRetrieveUpdateDestroyAPIView.as_view(), name='story-detail')
]
urlpatterns += router.urls
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)