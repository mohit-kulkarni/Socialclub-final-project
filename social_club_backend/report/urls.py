from django.urls import path, include
from report.views import *
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings
from report import views  # Add this line

router = routers.DefaultRouter()
urlpatterns=[

    # path('department/$',views.departmentApi),
     path('', report_api),  # Include built-in auth URLs


]