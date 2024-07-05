from django.urls import path, include
from .views import *

urlpatterns = [
    path('folders/', readFolder.as_view()),
    path('readfile/', readDataFile.as_view()),
]