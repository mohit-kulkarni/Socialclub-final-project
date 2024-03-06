from rest_framework import serializers
from report.models import * 
from report.views import *



class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reports
        fields = '__all__'