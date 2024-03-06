from django.shortcuts import render
from report.models import Reports
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from .serializers import ReportSerializer

# Create your views here.
@csrf_exempt
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
def report_api(request, pk=None):
    if request.method == 'GET':
        if pk is not None:
            try:
                report = Reports.objects.get(pk=pk)
                serializer = ReportSerializer(report)
                return Response(serializer.data)
            except Reports.DoesNotExist:
                return Response({"message": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            reports = Reports.objects.all()
            serializer = ReportSerializer(reports, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if pk is not None:
            try:
                report = Reports.objects.get(pk=pk)
                report.delete()
                return Response({"message": "Report deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            except Reports.DoesNotExist:
                return Response({"message": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Please provide the report ID"}, status=status.HTTP_400_BAD_REQUEST)