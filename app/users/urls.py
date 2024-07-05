from django.urls import path, include
from .views import *

urlpatterns = [
    path('register/', registerUser.as_view()),
    path('login/', loginUser.as_view()),
    path('user/', getUser.as_view()),
    path('logout/', logout.as_view()),
]